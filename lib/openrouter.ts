import { logger } from "@/lib/logger";
import { QUALITY_OPTIONS } from "@/lib/constants";
import type { Quality, RoomType, Theme } from "@/types";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
/**
 * How long to wait for an image before giving up, so a hung provider ends in
 * the route's refund. Ultra usually takes about 2 minutes. Waiting on fetch
 * uses no CPU time, so the Workers Paid CPU limit does not apply.
 */
export const OPENROUTER_TIMEOUT_MS = 280_000;
export const POSITIVE_PROMPT = `beautiful interior design, professional photography, well-lit, 
detailed textures, high quality, realistic, modern aesthetic, clean composition`;

export const NEGATIVE_PROMPT = `blurry, distorted, ugly, deformed, low quality, poorly lit, 
cluttered, amateur, watermark, text`;

interface GenerationResult {
    success: boolean;
    images: string[]; // Base64 data URLs
    textResponse?: string;
    error?: string;
}

interface GenerateParams {
    base64Image: string;
    prompt: string;
    quality?: Quality;
    /** Aborts the request, e.g. when the browser disconnects. */
    signal?: AbortSignal;
}

interface OpenRouterMessage {
    role: "user" | "assistant";
    content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
    images?: Array<{ type: string; image_url: { url: string } }>;
}

interface OpenRouterResponse {
    choices: Array<{
        message: OpenRouterMessage;
    }>;
    error?: {
        message: string;
        code: string;
    };
}

/** Names of the top-level keys of a JSON text, or [] when it is not a JSON object. */
function topLevelKeys(text: string): string[] {
    try {
        const parsed: unknown = JSON.parse(text);
        return parsed && typeof parsed === "object" ? Object.keys(parsed) : [];
    } catch {
        return [];
    }
}

export async function generateDesign({
    base64Image,
    prompt,
    quality = "standard",
    signal,
}: GenerateParams): Promise<GenerationResult> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!apiKey) {
        logger.error({}, "[OpenRouter] Missing OPENROUTER_API_KEY");
        throw new Error("Missing OpenRouter API key");
    }

    const selectedModel = QUALITY_OPTIONS[quality].model;

    logger.info(
        {
            model: selectedModel,
            quality,
            promptLength: prompt.length,
            imageSize: base64Image.length
        },
        "[OpenRouter] Starting generation"
    );

    const startTime = Date.now();

    // Aborts on the caller's signal or after OPENROUTER_TIMEOUT_MS, whichever comes first.
    const controller = new AbortController();
    const timer = setTimeout(
        () => controller.abort(new Error(`OpenRouter did not answer within ${OPENROUTER_TIMEOUT_MS / 1000} s`)),
        OPENROUTER_TIMEOUT_MS
    );
    const stopForCaller = () => controller.abort(signal?.reason);
    if (signal?.aborted) {
        stopForCaller();
    } else {
        signal?.addEventListener("abort", stopForCaller, { once: true });
    }

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": appUrl,
                "X-Title": "Magic Room", // Shows in OpenRouter dashboard
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt,
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: base64Image,
                                },
                            },
                        ],
                    },
                ],
                modalities: ["image", "text"],
            }),
        });

        const duration = Date.now() - startTime;

        if (!response.ok) {
            // Status, keys and size only: the body is the provider's, not ours to keep in logs.
            const errorText = await response.text().catch(() => "");
            logger.error(
                {
                    status: response.status,
                    responseKeys: topLevelKeys(errorText),
                    responseSize: errorText.length,
                    duration
                },
                "[OpenRouter] API request failed"
            );
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data: OpenRouterResponse = await response.json();

        if (data.error) {
            logger.error(
                { responseKeys: Object.keys(data), errorKeys: Object.keys(data.error), duration },
                "[OpenRouter] API returned error"
            );
            throw new Error("OpenRouter API error");
        }

        const choice = data.choices?.[0];
        if (!choice) {
            // Keys only: the body can be large and is not ours to keep in logs.
            logger.error({ responseKeys: Object.keys(data ?? {}), duration }, "[OpenRouter] No choices in response");
            throw new Error("No response from OpenRouter");
        }

        const images: string[] = [];
        let textResponse: string | undefined;

        const message = choice.message;

        if (typeof message.content === "string") {
            textResponse = message.content;
        }

        if (message.images && Array.isArray(message.images)) {
            for (const img of message.images) {
                if (img.image_url?.url) {
                    images.push(img.image_url.url);
                }
            }
        }

        if (Array.isArray(message.content)) {
            for (const item of message.content) {
                if (item.type === "image_url" && item.image_url?.url) {
                    images.push(item.image_url.url);
                } else if (item.type === "text" && item.text) {
                    textResponse = item.text;
                }
            }
        }

        logger.info(
            {
                imagesCount: images.length,
                hasText: !!textResponse,
                duration
            },
            "[OpenRouter] Generation complete"
        );

        if (images.length === 0) {
            logger.warn(
                { responseKeys: Object.keys(data), responseSize: JSON.stringify(data).length, duration },
                "[OpenRouter] No images in response"
            );
            return {
                success: false,
                images: [],
                textResponse,
                error: "No images generated. The AI may have returned only text.",
            };
        }

        return {
            success: true,
            images,
            textResponse,
        };
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(
            {
                error: error instanceof Error ? error.message : String(error),
                duration
            },
            "[OpenRouter] Generation failed"
        );
        throw error;
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener("abort", stopForCaller);
    }
}

export function buildDesignPrompt({
    roomType,
    theme,
    quality = "standard",
    customPrompt,
}: {
    roomType: RoomType;
    theme: Theme;
    quality?: Quality;
    customPrompt?: string;
}): string {
    void quality; // Parameter used for type safety but not needed in prompt construction
    const roomDescriptions: Record<RoomType, string> = {
        "living-room": "a modern living room with comfortable seating",
        bedroom: "a relaxing bedroom with a stylish bed",
        kitchen: "a functional kitchen with modern appliances",
        bathroom: "a clean, bright bathroom",
        "dining-room": "an elegant dining room with a table",
        office: "a productive home office",
        "gaming-room": "a high-tech gaming setup",
        nursery: "a calm, safe nursery with a crib",
        "laundry-room": "an organized laundry room with a washer and dryer",
        basement: "a cozy, well-lit finished basement",
        sunroom: "a bright sunroom with plenty of natural light",
        "home-theater": "a comfortable home theater with a large screen",
        mudroom: "a practical mudroom with storage and a bench",
        "walk-in-closet": "an organized walk-in closet with open shelving",
    };

    const themeModifiers: Record<Theme, string> = {
        modern: "contemporary, sleek, minimalist, clean lines",
        minimalist: "minimalist, clutter-free, simple, elegant",
        scandinavian: "Scandinavian design, light wood, cozy, warm",
        industrial: "industrial style, exposed brick, metal, raw",
        tropical: "tropical, vibrant, plants, natural, bright",
        bohemian: "bohemian, eclectic, colorful, artistic",
        vintage: "vintage, retro, antique, nostalgic",
        luxury: "luxury, opulent, premium, sophisticated",
        japandi: "Japandi, Japanese-Scandinavian fusion, natural wood, muted tones, calm",
        "art-deco": "Art Deco, geometric patterns, brass, velvet, glamorous",
        coastal: "coastal, airy, light blues and whites, natural textures, breezy",
        farmhouse: "farmhouse, rustic wood, shiplap, warm, homey",
        mediterranean: "Mediterranean, terracotta, plaster walls, warm earth tones, sunlit",
        transitional: "transitional, classic meets contemporary, neutral, balanced",
    };

    const roomDesc = roomDescriptions[roomType] || roomType;
    const themeDesc = themeModifiers[theme] || theme;

    let fullPrompt = `Transform this room into ${roomDesc} with ${themeDesc} style. ${POSITIVE_PROMPT}. Avoid: ${NEGATIVE_PROMPT}`;

    if (customPrompt) {
        fullPrompt = `Transform this room into ${roomDesc} with ${themeDesc} style. ${customPrompt}. ${POSITIVE_PROMPT}. Avoid: ${NEGATIVE_PROMPT}`;
    }

    return fullPrompt;
}

import { logger } from "@/lib/logger";

export const OPENROUTER_MODEL = "google/gemini-2.5-flash-image";
export const OPENROUTER_MODEL_PREMIUM = "google/gemini-3-pro-image-preview";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
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

export async function generateDesign(
    base64Image: string,
    prompt: string,
    quality: "standard" | "premium" = "standard"
): Promise<GenerationResult> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!apiKey) {
        logger.error({}, "[OpenRouter] Missing OPENROUTER_API_KEY");
        throw new Error("Missing OpenRouter API key");
    }

    const selectedModel = quality === "premium" ? OPENROUTER_MODEL_PREMIUM : OPENROUTER_MODEL;

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

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
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
            const errorData = await response.json().catch(() => ({}));
            logger.error(
                {
                    status: response.status,
                    error: errorData,
                    duration
                },
                "[OpenRouter] API request failed"
            );
            throw new Error(
                errorData?.error?.message || `OpenRouter API error: ${response.status}`
            );
        }

        const data: OpenRouterResponse = await response.json();

        if (data.error) {
            logger.error(
                { error: data.error, duration },
                "[OpenRouter] API returned error"
            );
            throw new Error(data.error.message || "OpenRouter API error");
        }

        const choice = data.choices?.[0];
        if (!choice) {
            logger.error({ data, duration }, "[OpenRouter] No choices in response");
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
                { response: JSON.stringify(data).substring(0, 500), duration },
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
    }
}

export function buildDesignPrompt(
    roomType: string,
    theme: string,
    quality: "standard" | "premium" = "standard",
    customPrompt?: string
): string {
    void quality; // Parameter used for type safety but not needed in prompt construction
    const roomDescriptions: Record<string, string> = {
        "living-room": "a modern living room with comfortable seating",
        bedroom: "a relaxing bedroom with a stylish bed",
        kitchen: "a functional kitchen with modern appliances",
        bathroom: "a clean, bright bathroom",
        "dining-room": "an elegant dining room with a table",
        office: "a productive home office",
        "gaming-room": "a high-tech gaming setup",
    };

    const themeModifiers: Record<string, string> = {
        modern: "contemporary, sleek, minimalist, clean lines",
        minimalist: "minimalist, clutter-free, simple, elegant",
        scandinavian: "Scandinavian design, light wood, cozy, warm",
        industrial: "industrial style, exposed brick, metal, raw",
        tropical: "tropical, vibrant, plants, natural, bright",
        bohemian: "bohemian, eclectic, colorful, artistic",
        vintage: "vintage, retro, antique, nostalgic",
        luxury: "luxury, opulent, premium, sophisticated",
    };

    const roomDesc = roomDescriptions[roomType] || roomType;
    const themeDesc = themeModifiers[theme] || theme;

    let fullPrompt = `Transform this room into ${roomDesc} with ${themeDesc} style. ${POSITIVE_PROMPT}. Avoid: ${NEGATIVE_PROMPT}`;

    if (customPrompt) {
        fullPrompt = `Transform this room into ${roomDesc} with ${themeDesc} style. ${customPrompt}. ${POSITIVE_PROMPT}. Avoid: ${NEGATIVE_PROMPT}`;
    }

    return fullPrompt;
}

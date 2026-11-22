import { buildDesignPrompt, generateDesign } from "@/lib/openrouter";
import { logger } from "@/lib/logger";
import type { Quality, RoomType, Theme } from "@/types";

export interface RoomDesignRequest {
    photo: string;
    roomType: RoomType;
    theme: Theme;
    quality: Quality;
    note?: string;
}

export type RoomDesign =
    | { ok: true; images: string[] }
    | {
          ok: false;
          failure: { kind: "no-image"; message?: string } | { kind: "provider-error"; cause: unknown };
      };

/**
 * Turns the User's choices into one Design result. Never throws for a failed
 * Design: it returns the images or a tagged failure. `cause` is for logs only.
 */
export async function designRoom({
    req,
    signal,
}: {
    req: RoomDesignRequest;
    signal?: AbortSignal;
}): Promise<RoomDesign> {
    try {
        const prompt = buildDesignPrompt({
            roomType: req.roomType,
            theme: req.theme,
            customPrompt: req.note,
        });
        logger.info({ promptLength: prompt.length }, "[Generate] Prompt built");

        const generationStartTime = Date.now();
        const result = await generateDesign({ base64Image: req.photo, prompt, quality: req.quality, signal });
        logger.info(
            {
                duration: Date.now() - generationStartTime,
                imagesCount: result.images.length,
                success: result.success,
            },
            "[Generate] OpenRouter generation complete"
        );

        if (!result.success || result.images.length === 0) {
            return { ok: false, failure: { kind: "no-image", message: result.error } };
        }
        return { ok: true, images: result.images };
    } catch (cause) {
        return { ok: false, failure: { kind: "provider-error", cause } };
    }
}

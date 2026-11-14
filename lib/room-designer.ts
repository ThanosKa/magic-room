// Why this is not inside lib/openrouter.ts: calls inside one module do not pass
// through `vi.mock`. If designRoom lived there, it would call the real
// generateDesign and buildDesignPrompt, hiding the mocked generateDesign from
// the route tests and blinding the prompt-baseline test. So it imports both
// through the OpenRouter module's exports.
import { buildDesignPrompt, generateDesign } from "@/lib/openrouter";
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
export async function designRoom(
    req: RoomDesignRequest,
    opts: { signal?: AbortSignal }
): Promise<RoomDesign> {
    try {
        const prompt = buildDesignPrompt(req.roomType, req.theme, req.quality, req.note);
        const result = await generateDesign(req.photo, prompt, req.quality, { signal: opts.signal });

        if (!result.success || result.images.length === 0) {
            return { ok: false, failure: { kind: "no-image", message: result.error } };
        }
        return { ok: true, images: result.images };
    } catch (cause) {
        return { ok: false, failure: { kind: "provider-error", cause } };
    }
}

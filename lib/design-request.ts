import type { IGenerateResponse, Quality, RoomType, Theme } from "@/types";

export type DesignAnswer =
    | { kind: "design"; id: string; outputUrls: string[] }
    | { kind: "signed-out" }
    | { kind: "account-missing" }
    | { kind: "photo-rejected" }
    | { kind: "timed-out" }
    | { kind: "not-enough-credits" }
    | { kind: "too-many"; resetAt?: number }
    | { kind: "failed-refunded" }
    | { kind: "failed" }
    | { kind: "offline" };

export interface DesignChoices {
    photo: string;
    roomType: RoomType;
    theme: Theme;
    quality: Quality;
    note?: string;
}

type GenerateBody = Partial<IGenerateResponse> & { resetAt?: unknown };

function classify({ status, ok, body }: { status: number; ok: boolean; body: GenerateBody }): DesignAnswer {
    if (ok && body.success && body.outputUrls && body.outputUrls.length > 0) {
        return { kind: "design", id: body.predictionId ?? "", outputUrls: body.outputUrls };
    }
    if (status === 401) return { kind: "signed-out" };
    if (status === 404) return { kind: "account-missing" };
    if (status === 400) return { kind: "photo-rejected" };
    if (status === 408 || status === 502 || status === 503 || status === 504) return { kind: "timed-out" };
    if (status === 402) return { kind: "not-enough-credits" };
    if (status === 429) {
        return typeof body.resetAt === "number" ? { kind: "too-many", resetAt: body.resetAt } : { kind: "too-many" };
    }
    if (status >= 500 && body.success === false) return { kind: "failed-refunded" };
    return { kind: "failed" };
}

/** Ask for one design and say what came back. Never throws. */
export async function requestDesign({ photo, roomType, theme, quality, note }: DesignChoices): Promise<DesignAnswer> {
    const customPrompt = note?.trim();
    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                base64Image: photo,
                roomType,
                theme,
                quality,
                ...(customPrompt ? { customPrompt } : {}),
            }),
        });
        const body: GenerateBody = (await response.json().catch(() => null)) ?? {};
        return classify({ status: response.status, ok: response.ok, body });
    } catch {
        return { kind: "offline" };
    }
}

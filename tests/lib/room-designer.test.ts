import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QUALITY_OPTIONS } from "@/lib/constants";
import { designRoom } from "@/lib/room-designer";

vi.mock("@/lib/logger", () => ({
    logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

const request = {
    photo: "data:image/png;base64,room",
    roomType: "bedroom" as const,
    theme: "japandi" as const,
    quality: "premium" as const,
};

const IMAGE_MESSAGE = { images: [{ type: "image_url", image_url: { url: "data:image/png;base64,out" } }] };

function answer(message: object, status = 200) {
    return vi.fn().mockResolvedValue(new Response(JSON.stringify({ choices: [{ message }] }), { status }));
}

describe("designRoom", () => {
    beforeEach(() => {
        vi.stubEnv("OPENROUTER_API_KEY", "test-key");
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    it("returns the images when the provider sends one", async () => {
        const fetchMock = answer({ images: [{ type: "image_url", image_url: { url: "data:image/png;base64,out" } }] });
        vi.stubGlobal("fetch", fetchMock);

        expect(await designRoom(request, {})).toEqual({ ok: true, images: ["data:image/png;base64,out"] });

        const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
        expect(body.model).toBe(QUALITY_OPTIONS.premium.model);
        expect(body.messages[0].content[0].text).toContain("Japandi");
    });

    it("puts the note into the prompt", async () => {
        const fetchMock = answer({ images: [{ type: "image_url", image_url: { url: "data:image/png;base64,out" } }] });
        vi.stubGlobal("fetch", fetchMock);

        await designRoom({ ...request, note: "add a big plant" }, {});

        const body = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
        expect(body.messages[0].content[0].text).toContain("add a big plant");
    });

    it("returns no-image with the provider's message when it answers with text only", async () => {
        vi.stubGlobal("fetch", answer({ content: "I cannot do that" }));

        expect(await designRoom(request, {})).toEqual({
            ok: false,
            failure: { kind: "no-image", message: "No images generated. The AI may have returned only text." },
        });
    });

    it("returns provider-error with the cause when OpenRouter answers 502", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 502 })));

        const result = await designRoom(request, {});

        expect(result).toMatchObject({ ok: false, failure: { kind: "provider-error" } });
        if (!result.ok && result.failure.kind === "provider-error") {
            expect((result.failure.cause as Error).message).toMatch(/502/);
        }
    });

    it("returns provider-error when the signal is already aborted", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn((_url: string, init?: RequestInit) =>
                init?.signal?.aborted
                    ? Promise.reject(init.signal.reason)
                    : Promise.resolve(new Response(JSON.stringify({ choices: [{ message: IMAGE_MESSAGE }] })))
            )
        );
        const controller = new AbortController();
        controller.abort(new Error("browser left"));

        const result = await designRoom(request, { signal: controller.signal });

        expect(result).toMatchObject({ ok: false, failure: { kind: "provider-error" } });
        if (!result.ok && result.failure.kind === "provider-error") {
            expect((result.failure.cause as Error).message).toBe("browser left");
        }
    });

    it("returns provider-error when the API key is missing", async () => {
        vi.stubEnv("OPENROUTER_API_KEY", "");
        vi.stubGlobal("fetch", vi.fn());

        expect(await designRoom(request, {})).toMatchObject({ ok: false, failure: { kind: "provider-error" } });
        expect(fetch).not.toHaveBeenCalled();
    });
});

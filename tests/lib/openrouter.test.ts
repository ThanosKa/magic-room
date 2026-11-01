import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateDesign } from "@/lib/openrouter";

vi.mock("@/lib/logger", () => ({
    logger: { error: vi.fn(), warn: vi.fn(), info: vi.fn() },
}));

/** The model id each request asked OpenRouter for. */
function sentModels(fetchMock: ReturnType<typeof vi.fn>): string[] {
    return fetchMock.mock.calls.map(([, init]) => JSON.parse((init as RequestInit).body as string).model);
}

describe("generateDesign: which model makes the image", () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.stubEnv("OPENROUTER_API_KEY", "test-key");
        fetchMock = vi.fn().mockImplementation(async () =>
            new Response(
                JSON.stringify({
                    choices: [{ message: { images: [{ type: "image_url", image_url: { url: "data:image/png;base64,x" } }] } }],
                }),
                { status: 200 }
            )
        );
        vi.stubGlobal("fetch", fetchMock);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    it("Quick uses Nano Banana 2.1, Pro uses Nano Banana Pro, Ultra uses GPT-5.4 Image 2", async () => {
        await generateDesign("data:image/png;base64,room", "prompt", "standard");
        await generateDesign("data:image/png;base64,room", "prompt", "premium");
        await generateDesign("data:image/png;base64,room", "prompt", "ultra");

        expect(sentModels(fetchMock)).toEqual([
            "google/gemini-nano-banana-2.1",
            "google/gemini-3-pro-image",
            "openai/gpt-5.4-image-2",
        ]);
    });
});

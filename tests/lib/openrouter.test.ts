import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateDesign } from "@/lib/openrouter";
import { logger } from "@/lib/logger";

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

describe("generateDesign: how long it waits for OpenRouter", () => {
    /** Like fetch to a provider that hangs: rejects only when its signal aborts. */
    const hangingFetch = vi.fn((_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
        })
    );

    beforeEach(() => {
        vi.useFakeTimers();
        vi.stubEnv("OPENROUTER_API_KEY", "test-key");
        hangingFetch.mockClear();
        vi.stubGlobal("fetch", hangingFetch);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    // 280 s: under the 300 s the route had on Vercel, longer than Ultra's
    // usual 2 minutes. The route's catch refunds when this throws.
    it("gives up after 280 seconds so the route can refund", async () => {
        const outcome = generateDesign("data:image/png;base64,room", "prompt", "ultra").then(
            () => "answered",
            (error: Error) => error.message
        );

        await vi.advanceTimersByTimeAsync(279_999);
        expect(await Promise.race([outcome, Promise.resolve("still waiting")])).toBe("still waiting");

        await vi.advanceTimersByTimeAsync(1);
        expect(await outcome).toMatch(/did not answer within 280 s/);
    });

    it("stops waiting as soon as the caller's signal aborts", async () => {
        const browser = new AbortController();
        const outcome = generateDesign("data:image/png;base64,room", "prompt", "ultra", {
            signal: browser.signal,
        }).then(
            () => "answered",
            () => "stopped"
        );

        browser.abort();

        expect(await outcome).toBe("stopped");
    });
});

describe("generateDesign: nothing the provider sent back reaches a log", () => {
    const MARKER = "PROVIDER-SECRET-MARKER-9137";

    beforeEach(() => {
        vi.stubEnv("OPENROUTER_API_KEY", "test-key");
        vi.mocked(logger.error).mockClear();
        vi.mocked(logger.warn).mockClear();
        vi.mocked(logger.info).mockClear();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    /** Every logger call (all levels) as one string. */
    function everythingLogged(): string {
        return JSON.stringify([
            ...vi.mocked(logger.error).mock.calls,
            ...vi.mocked(logger.warn).mock.calls,
            ...vi.mocked(logger.info).mock.calls,
        ]);
    }

    function answerWith(body: unknown, status: number) {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })));
    }

    it("keeps the body of an HTTP error out of the logs and the thrown error", async () => {
        answerWith({ error: { message: MARKER, code: MARKER }, detail: MARKER }, 500);

        const error = await generateDesign("data:image/png;base64,room", "prompt").catch((e: Error) => e);

        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).not.toContain(MARKER);
        expect(everythingLogged()).not.toContain(MARKER);
    });

    it("keeps an API error inside a 200 answer out of the logs and the thrown error", async () => {
        answerWith({ error: { message: MARKER, code: MARKER } }, 200);

        const error = await generateDesign("data:image/png;base64,room", "prompt").catch((e: Error) => e);

        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).not.toContain(MARKER);
        expect(everythingLogged()).not.toContain(MARKER);
    });

    it("keeps the text of a 200 answer with no image out of the logs", async () => {
        answerWith({ choices: [{ message: { content: MARKER } }] }, 200);

        const result = await generateDesign("data:image/png;base64,room", "prompt");

        expect(result).toMatchObject({
            success: false,
            error: "No images generated. The AI may have returned only text.",
        });
        expect(everythingLogged()).not.toContain(MARKER);
    });
});

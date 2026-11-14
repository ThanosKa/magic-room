import { afterEach, describe, expect, it, vi } from "vitest";
import { requestDesign, type DesignAnswer } from "@/lib/design-request";

const choices = { photo: "data:image/jpeg;base64,AAA", roomType: "bedroom", theme: "japandi", quality: "standard" } as const;

function answerWith(status: number, body: unknown, json = true) {
    const fetchMock = vi.fn().mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        json: json ? async () => body : async () => Promise.reject(new SyntaxError("not json")),
    });
    vi.stubGlobal("fetch", fetchMock);
    return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("requestDesign", () => {
    const table: Array<[string, number, unknown, DesignAnswer]> = [
        ["200 with an image", 200, { success: true, predictionId: "d1", outputUrls: ["u1"] }, { kind: "design", id: "d1", outputUrls: ["u1"] }],
        ["200 without an image", 200, { success: true, outputUrls: [] }, { kind: "failed" }],
        ["200 with success false", 200, { success: false, outputUrls: ["u"] }, { kind: "failed" }],
        ["401", 401, { error: "x" }, { kind: "signed-out" }],
        ["404", 404, { error: "x" }, { kind: "account-missing" }],
        ["400", 400, { error: "x" }, { kind: "photo-rejected" }],
        ["408", 408, null, { kind: "timed-out" }],
        ["502 with success false", 502, { success: false }, { kind: "timed-out" }],
        ["503", 503, null, { kind: "timed-out" }],
        ["504", 504, null, { kind: "timed-out" }],
        ["402", 402, { error: "x" }, { kind: "not-enough-credits" }],
        ["429 with numeric resetAt", 429, { resetAt: 123 }, { kind: "too-many", resetAt: 123 }],
        ["429 with non-numeric resetAt", 429, { resetAt: "soon" }, { kind: "too-many" }],
        ["429 without a body", 429, null, { kind: "too-many" }],
        ["500 with success false", 500, { success: false }, { kind: "failed-refunded" }],
        ["500 without success false", 500, { error: "x" }, { kind: "failed" }],
        ["418", 418, null, { kind: "failed" }],
    ];

    it.each(table)("%s", async (_name, status, body, expected) => {
        answerWith(status, body);
        expect(await requestDesign(choices)).toEqual(expected);
    });

    it("lets the status decide when the body is not JSON", async () => {
        answerWith(402, null, false);
        expect(await requestDesign(choices)).toEqual({ kind: "not-enough-credits" });
    });

    it("gives offline when fetch rejects", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
        expect(await requestDesign(choices)).toEqual({ kind: "offline" });
    });

    it("sends the request as before, with the note only when it has text", async () => {
        const fetchMock = answerWith(200, { success: true, predictionId: "d", outputUrls: ["u"] });
        await requestDesign({ ...choices, note: "  " });
        await requestDesign({ ...choices, note: " warm light " });
        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe("/api/generate");
        expect(init.method).toBe("POST");
        expect(init.headers).toEqual({ "Content-Type": "application/json" });
        expect(JSON.parse(init.body)).toEqual({ base64Image: choices.photo, roomType: "bedroom", theme: "japandi", quality: "standard" });
        expect(JSON.parse(fetchMock.mock.calls[1][1].body).customPrompt).toBe("warm light");
    });
});

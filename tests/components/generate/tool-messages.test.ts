import { afterEach, describe, expect, it, vi } from "vitest";
import { messageFor, NETWORK_MESSAGE } from "@/components/generate/tool-messages";

const ctx = { cost: 2, signInAgain: vi.fn() };

afterEach(() => vi.useRealTimers());

describe("messageFor", () => {
    it("says nothing for a delivered design", () => {
        expect(messageFor({ answer: { kind: "design", id: "d", outputUrls: ["u"] }, ...ctx })).toBeNull();
    });

    it("offers Sign in again when signed out or the account is missing", () => {
        for (const kind of ["signed-out", "account-missing"] as const) {
            const message = messageFor({ answer: { kind }, ...ctx });
            expect(message?.action).toEqual({ label: "Sign in again", onClick: ctx.signInAgain });
        }
    });

    it("offers Buy credits when there are not enough", () => {
        expect(messageFor({ answer: { kind: "not-enough-credits" }, ...ctx })?.action).toEqual({ label: "Buy credits", href: "/pricing" });
    });

    it("tells the minutes until the limit resets, or to wait a minute", () => {
        vi.useFakeTimers();
        vi.setSystemTime(0);
        expect(messageFor({ answer: { kind: "too-many", resetAt: 5 * 60_000 }, ...ctx })?.text).toContain("about 5 minutes");
        expect(messageFor({ answer: { kind: "too-many", resetAt: 30_000 }, ...ctx })?.text).toContain("Wait a minute");
        expect(messageFor({ answer: { kind: "too-many" }, ...ctx })?.text).toContain("Wait a minute");
    });

    it("tells refunded failures apart from other failures", () => {
        expect(messageFor({ answer: { kind: "failed-refunded" }, ...ctx })?.text).toContain("refunded");
        expect(messageFor({ answer: { kind: "failed" }, ...ctx })?.text).not.toContain("refunded");
    });

    it("uses the No connection message when offline", () => {
        expect(messageFor({ answer: { kind: "offline" }, ...ctx })).toBe(NETWORK_MESSAGE);
    });
});

import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import PricingContent from "@/components/pricing-content";

vi.mock("@clerk/nextjs", () => ({
    useUser: () => ({ isLoaded: false, isSignedIn: undefined, user: undefined }),
    SignUpButton: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
    useSearchParams: () => new URLSearchParams(),
}));

/** The pricing page as plain text, the way a reader (or a crawler) sees it. */
function pageText(): string {
    const html = renderToString(<PricingContent />);
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent!.replace(/\s+/g, " ");
}

describe("Pricing page", () => {
    it("sells 20, 60 and 120 credits for €9.99, €19.99 and €29.99", () => {
        const text = pageText();

        expect(text).toContain("€9.99 for 20 credits");
        expect(text).toContain("€19.99 for 60 credits");
        expect(text).toContain("€29.99 for 120 credits");
        expect(text).not.toMatch(/\b(30|90|200) (credits|designs)\b/);
    });

    it("says what a design costs on each quality: Quick 1, Pro 2, Ultra 3 credits", () => {
        const text = pageText();

        expect(text).toContain("Quick 1 credit");
        expect(text).toContain("Pro 2 credits");
        expect(text).toContain("Ultra 3 credits");
    });
});

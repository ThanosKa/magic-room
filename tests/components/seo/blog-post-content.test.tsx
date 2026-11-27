import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { BlogPostContent } from "@/components/seo/blog-post-content";
import { getBlogPostBySlug, type IBlogPost } from "@/lib/seo/blog-data";

const WORKER_TIMEZONE = "UTC";
const originalTimezone = process.env.TZ;

beforeAll(() => {
    Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);
});

let root: Root | null = null;
afterEach(() => {
    act(() => root?.unmount());
    root = null;
    document.body.innerHTML = "";
    process.env.TZ = originalTimezone;
    vi.restoreAllMocks();
});

function postWithBothDates(): IBlogPost {
    const post = getBlogPostBySlug("industrial-kitchen-design-ideas");
    if (!post) throw new Error("industrial-kitchen-design-ideas is missing from BLOG_POSTS");
    return { ...post, publishedDate: "2026-01-26", updatedDate: "2026-03-25" };
}

async function hydrateForVisitorIn(visitorTimezone: string) {
    const post = postWithBothDates();

    process.env.TZ = WORKER_TIMEZONE;
    const container = document.createElement("div");
    container.innerHTML = renderToString(<BlogPostContent post={post} />);
    document.body.appendChild(container);

    const problems: string[] = [];
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
        const text = args.map(String).join(" ");
        if (/hydrat/i.test(text)) problems.push(text);
    });

    process.env.TZ = visitorTimezone;
    await act(async () => {
        root = hydrateRoot(container, <BlogPostContent post={post} />, {
            onRecoverableError: (error) => problems.push(String(error)),
        });
    });

    const dates = [...container.querySelectorAll("time")].map((time) => time.textContent);
    return { problems, dates };
}

describe("BlogPostContent dates", () => {
    it.each(["America/Los_Angeles", "America/New_York", "Europe/Athens", "Asia/Tokyo", "Pacific/Kiritimati"])(
        "hydrates without a mismatch for a visitor in %s",
        async (visitorTimezone) => {
            const { problems, dates } = await hydrateForVisitorIn(visitorTimezone);

            expect(problems).toEqual([]);
            expect(dates).toEqual(["26 January 2026", "25 March 2026"]);
        },
    );
});

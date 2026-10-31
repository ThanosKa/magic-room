import { describe, expect, it } from "vitest";
import { diffSnapshots, extractPageRecord } from "@/scripts/seo-parity/lib.mjs";
import committedAllowList from "@/scripts/seo-parity/allow-list.json";

const BASE = "http://localhost:3101";

function page(head: string, body: string): string {
    return `<!DOCTYPE html><html><head>${head}</head><body>${body}</body></html>`;
}

describe("extractPageRecord", () => {
    it("records the head SEO fields, robots header and H1 text", () => {
        const html = page(
            `<title>AI Interior Design | Magic Room</title>
             <meta name="description" content="Redesign any room.">
             <link rel="canonical" href="https://magic-room.dev/pricing">
             <meta name="robots" content="index, follow">`,
            `<h1>  AI interior <span>design</span> </h1>`
        );

        const record = extractPageRecord({
            path: "/pricing",
            baseOrigin: BASE,
            hops: [{ url: "/pricing", status: 200, location: null }],
            headers: { "x-robots-tag": "noindex, follow" },
            html,
        });

        expect(record).toMatchObject({
            path: "/pricing",
            status: 200,
            finalPath: "/pricing",
            title: "AI Interior Design | Magic Room",
            description: "Redesign any room.",
            canonical: "https://magic-room.dev/pricing",
            robotsMeta: "index, follow",
            xRobotsTag: "noindex, follow",
            h1: ["AI interior design"],
        });
    });
});

describe("extractPageRecord content", () => {
    const html = page(
        `<title>T</title>
         <script type="application/ld+json">{"@type":"FAQPage","name":"Q"}</script>
         <script type="application/ld+json">[{"@type":"Organization"}]</script>
         <script src="https://elegant-cheetah-55.clerk.accounts.dev/clerk.browser.js" data-clerk-js-script="true"></script>
         <style>.a{color:red}</style>`,
        `<nav><a href="/pricing">Pricing</a><a href="/design#styles">Styles</a></nav>
         <main><h1>Hello</h1><p>Design <b>any</b> room.</p><div>Second block</div>
           <a href="http://localhost:3101/blog?page=2">Blog</a>
           <a href="https://magic-room.dev">Home</a>
           <a href="/pricing">Pricing again</a>
           <a href="https://x.com/someone">X</a>
           <a href="mailto:a@b.c">Mail</a>
           <noscript>Enable JS</noscript>
           <script>self.__next_f.push([1,"payload"])</script>
         </main>`
    );
    const record = extractPageRecord({
        path: "/",
        baseOrigin: BASE,
        hops: [{ url: "/", status: 200, location: null }],
        headers: {},
        html,
    });

    it("keeps every JSON-LD block, parsed", () => {
        expect(record.jsonLd).toEqual([
            { "@type": "FAQPage", name: "Q" },
            [{ "@type": "Organization" }],
        ]);
    });

    it("lists internal links as sorted unique paths, dropping fragments and external links", () => {
        expect(record.internalLinks).toEqual(["/", "/blog?page=2", "/design", "/pricing"]);
    });

    it("records visible body text without scripts, styles or noscript", () => {
        expect(record.bodyText).toBe(
            "Pricing Styles Hello Design any room. Second block Blog Home Pricing again X Mail"
        );
    });
});

describe("extractPageRecord redirects", () => {
    it("records the redirect chain and the final path for an internal redirect", () => {
        const record = extractPageRecord({
            path: "/vs/roomgpt",
            baseOrigin: BASE,
            hops: [
                { url: "/vs/roomgpt", status: 308, location: "/alternatives/roomgpt" },
                { url: "/alternatives/roomgpt", status: 200, location: null },
            ],
            headers: {},
            html: page("<title>Alt</title>", "<h1>Alt</h1>"),
        });

        expect(record).toMatchObject({
            status: 308,
            redirects: [{ status: 308, location: "/alternatives/roomgpt" }],
            finalPath: "/alternatives/roomgpt",
            title: "Alt",
        });
    });

    it("keeps only origin and path of an external redirect (the sign-in query string is per-server noise)", () => {
        const record = extractPageRecord({
            path: "/generate",
            baseOrigin: BASE,
            hops: [
                {
                    url: "/generate",
                    status: 307,
                    location:
                        "https://elegant-cheetah-55.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3101%2Fgenerate",
                },
            ],
            headers: {},
            html: "",
        });

        expect(record).toMatchObject({
            status: 307,
            redirects: [{ status: 307, location: "https://elegant-cheetah-55.accounts.dev/sign-in" }],
            finalPath: "https://elegant-cheetah-55.accounts.dev/sign-in",
        });
    });
});

describe("extractPageRecord noise normalisation", () => {
    const record = extractPageRecord({
        path: "/gallery",
        baseOrigin: BASE,
        hops: [{ url: "/gallery", status: 200, location: null }],
        headers: {},
        html: page(
            `<script type="application/ld+json">${JSON.stringify({
                image: "http://localhost:3101/_next/static/media/hero.3b6cae6d.webp",
                thumbnail: "/_next/image?url=%2Fgallery%2Fa.jpg&w=1080&q=75",
                data: "/_next/data/AbC123xyz/gallery.json",
                logo: "https://magic-room.dev/icon.png?icon.8e2e57ee.png",
                page: "https://magic-room.dev/gallery?dpl=dpl_9fXk2",
            })}</script>`,
            `<a href="/_next/static/chunks/9442991e96bbea57.css">x</a>`
        ),
    });

    it("replaces the crawled server's origin, hashed asset names, image sizes, build and deployment ids", () => {
        expect(record.jsonLd).toEqual([
            {
                image: "/_next/static/[asset]",
                thumbnail: "/_next/image?url=%2Fgallery%2Fa.jpg",
                data: "/_next/data/[build]/gallery.json",
                logo: "https://magic-room.dev/icon.png",
                page: "https://magic-room.dev/gallery",
            },
        ]);
        expect(record.internalLinks).toEqual(["/_next/static/[asset]"]);
    });
});

function pricingRecord(overrides: Record<string, unknown> = {}) {
    return {
        path: "/pricing",
        status: 200,
        redirects: [],
        finalPath: "/pricing",
        title: "Pricing | Magic Room",
        description: "Credit packs.",
        canonical: "https://magic-room.dev/pricing",
        robotsMeta: "index, follow",
        xRobotsTag: null,
        h1: ["Pricing"],
        jsonLd: [],
        internalLinks: ["/", "/generate"],
        bodyText: "Pricing Starter Pro",
        ...overrides,
    };
}

function snapshot(pages: Record<string, unknown>[], sitemap = ["/pricing"]) {
    return {
        sitemap,
        robotsTxt: "User-agent: *\nAllow: /",
        pages: Object.fromEntries(pages.map((p) => [p.path, p])),
    };
}

describe("diffSnapshots", () => {
    it("reports nothing for identical snapshots", () => {
        const result = diffSnapshots(snapshot([pricingRecord()]), snapshot([pricingRecord()]), []);
        expect(result).toEqual({ differences: [], failed: false });
    });

    it("fails on a changed title and says what changed", () => {
        const result = diffSnapshots(
            snapshot([pricingRecord()]),
            snapshot([pricingRecord({ title: "Plans | Magic Room" })]),
            []
        );
        expect(result.failed).toBe(true);
        expect(result.differences).toEqual([
            {
                path: "/pricing",
                field: "title",
                allowed: false,
                before: "Pricing | Magic Room",
                after: "Plans | Magic Room",
            },
        ]);
    });

    it("ignores whitespace-only changes in H1 and body text (a restyle may rewrap words)", () => {
        const result = diffSnapshots(
            snapshot([pricingRecord({ h1: ["AI interior design for rooms"], bodyText: "Pricing Starter Pro" })]),
            snapshot([pricingRecord({ h1: ["AI interior design for  rooms"], bodyText: "Pricing StarterPro" })]),
            []
        );
        expect(result).toEqual({ differences: [], failed: false });
    });

    it("reports a page that disappeared and a page that appeared", () => {
        const home = pricingRecord({ path: "/", finalPath: "/" });
        const blog = pricingRecord({ path: "/blog", finalPath: "/blog" });
        const result = diffSnapshots(snapshot([pricingRecord(), home]), snapshot([home, blog]), []);
        expect(result.failed).toBe(true);
        expect(result.differences).toEqual([
            { path: "/pricing", field: "page", allowed: false, before: "crawled", after: "missing" },
            { path: "/blog", field: "page", allowed: false, before: "missing", after: "crawled" },
        ]);
    });

    it("reports sitemap and robots.txt changes", () => {
        const before = snapshot([pricingRecord()], ["/", "/pricing"]);
        const after = { ...snapshot([pricingRecord()], ["/", "/new-page"]), robotsTxt: "User-agent: *\nDisallow: /" };
        const result = diffSnapshots(before, after, []);
        expect(result.differences).toEqual([
            {
                path: "/sitemap.xml",
                field: "sitemap",
                allowed: false,
                before: ["/", "/pricing"],
                after: ["/", "/new-page"],
            },
            {
                path: "/robots.txt",
                field: "robotsTxt",
                allowed: false,
                before: "User-agent: *\nAllow: /",
                after: "User-agent: *\nDisallow: /",
            },
        ]);
    });

    it("the committed allow-list lets the homepage change its copy and H1, and nothing else", () => {
        const home = pricingRecord({ path: "/", finalPath: "/", title: "AI Interior Design | Magic Room" });
        const result = diffSnapshots(
            snapshot([home]),
            snapshot([
                {
                    ...home,
                    h1: ["AI interior design. One room, every style."],
                    bodyText: "Brand new homepage copy",
                    title: "Changed title",
                },
            ]),
            committedAllowList
        );
        expect(result.differences.map((d) => [d.field, d.allowed])).toEqual([
            ["title", false],
            ["h1", true],
            ["bodyText", true],
        ]);
        expect(result.failed).toBe(true);
    });
});

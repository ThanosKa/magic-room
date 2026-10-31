// Pure logic for the SEO parity check: turn a fetched page into a record,
// and diff two snapshots of records. No network or file access here, so it
// can be tested directly (tests/seo-parity/seo-parity.test.ts).
import { JSDOM } from "jsdom";

// Origins whose links count as internal, besides the server being crawled.
const SITE_ORIGINS = ["https://magic-room.dev", "https://www.magic-room.dev"];

// Elements whose text is never visible.
const INVISIBLE = "script, style, noscript, template";

function clean(text) {
    return (text ?? "").replace(/\s+/g, " ").trim();
}

/**
 * @param {{
 *   path: string,
 *   baseOrigin: string,
 *   hops: { url: string, status: number, location: string | null }[],
 *   headers: Record<string, string>,
 *   html: string,
 * }} input
 */
export function extractPageRecord({ path, baseOrigin, hops, headers, html }) {
    const doc = new JSDOM(html).window.document;
    const redirects = hops
        .filter((hop) => hop.location)
        .map((hop) => ({ status: hop.status, location: redirectTarget(hop.location, baseOrigin) }));
    const meta = (name) =>
        doc.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ?? null;

    return normaliseDeep({
        path,
        status: hops[0].status,
        redirects,
        finalPath: redirects.length ? redirects[redirects.length - 1].location : path,
        title: clean(doc.querySelector("title")?.textContent) || null,
        description: meta("description"),
        canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
        robotsMeta: meta("robots"),
        xRobotsTag: headers["x-robots-tag"] ?? null,
        h1: Array.from(doc.querySelectorAll("h1"), (el) => clean(el.textContent)),
        jsonLd: Array.from(doc.querySelectorAll('script[type="application/ld+json"]'), (el) =>
            JSON.parse(el.textContent ?? "null")
        ),
        internalLinks: internalLinks(doc, baseOrigin),
        bodyText: visibleText(doc.body),
    }, baseOrigin);
}

// Internal redirects keep path + query; external ones (e.g. Clerk sign-in)
// keep only origin + path, since their query echoes the crawled server.
function redirectTarget(location, baseOrigin) {
    const url = new URL(location, `${baseOrigin}/`);
    if (url.origin === baseOrigin) return url.pathname + url.search;
    return url.origin + url.pathname;
}

/**
 * Strip values that change between builds or servers but not for Google:
 * the crawled server's origin, hashed /_next/static asset names, build ids,
 * next/image size params, Vercel deployment ids and metadata-image hashes.
 * @param {string} value
 * @param {string} baseOrigin
 */
export function normaliseString(value, baseOrigin) {
    return value
        .split(baseOrigin).join("")
        .split(encodeURIComponent(baseOrigin)).join("")
        .replace(/\/_next\/static\/[^\s"'()<>]+/g, "/_next/static/[asset]")
        .replace(/\/_next\/data\/[^/\s"']+\//g, "/_next/data/[build]/")
        .replace(/(\/_next\/image\?url=[^&\s"']+)(?:&[^\s"']*)?/g, "$1")
        .replace(/[?&]dpl=[\w-]+/g, "")
        .replace(/\?[\w-]+\.[0-9a-f]{8,}\.\w+/g, "");
}

const PAGE_FIELDS = [
    "status",
    "redirects",
    "finalPath",
    "title",
    "description",
    "canonical",
    "robotsMeta",
    "xRobotsTag",
    "h1",
    "jsonLd",
    "internalLinks",
    "bodyText",
];

/**
 * @typedef {{ path: string, fields: string[], reason?: string }} AllowEntry
 * @param {{ sitemap: string[], robotsTxt: string, pages: Record<string, any> }} baseline
 * @param {{ sitemap: string[], robotsTxt: string, pages: Record<string, any> }} current
 * @param {AllowEntry[]} allowList
 */
export function diffSnapshots(baseline, current, allowList) {
    const differences = [];
    const report = (path, field, before, after) =>
        differences.push({ path, field, allowed: isAllowed(allowList, path, field), before, after });

    for (const [path, before] of Object.entries(baseline.pages)) {
        const after = current.pages[path];
        if (!after) {
            report(path, "page", "crawled", "missing");
            continue;
        }
        for (const field of PAGE_FIELDS) {
            if (!sameValue(field, before[field], after[field])) {
                report(path, field, before[field], after[field]);
            }
        }
    }
    for (const path of Object.keys(current.pages)) {
        if (!baseline.pages[path]) report(path, "page", "missing", "crawled");
    }
    if (JSON.stringify(baseline.sitemap) !== JSON.stringify(current.sitemap)) {
        report("/sitemap.xml", "sitemap", baseline.sitemap, current.sitemap);
    }
    if (baseline.robotsTxt !== current.robotsTxt) {
        report("/robots.txt", "robotsTxt", baseline.robotsTxt, current.robotsTxt);
    }
    return { differences, failed: differences.some((d) => !d.allowed) };
}

// Text fields compare without whitespace: a restyle that moves words between
// block and inline elements changes spacing, not what the page says.
const WHITESPACE_INSENSITIVE = new Set(["h1", "bodyText"]);

function sameValue(field, before, after) {
    const key = (value) => {
        const json = JSON.stringify(value) ?? "undefined";
        return WHITESPACE_INSENSITIVE.has(field) ? json.replace(/\s+/g, "") : json;
    };
    return key(before) === key(after);
}

function isAllowed(allowList, path, field) {
    return allowList.some((entry) => entry.path === path && entry.fields.includes(field));
}

function normaliseDeep(value, baseOrigin) {
    if (typeof value === "string") return normaliseString(value, baseOrigin);
    if (Array.isArray(value)) return value.map((item) => normaliseDeep(item, baseOrigin));
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, normaliseDeep(item, baseOrigin)])
        );
    }
    return value;
}

function internalLinks(doc, baseOrigin) {
    const internal = new Set([baseOrigin, ...SITE_ORIGINS]);
    const paths = new Set();
    for (const a of doc.querySelectorAll("a[href]")) {
        let url;
        try {
            url = new URL(a.getAttribute("href"), `${baseOrigin}/`);
        } catch {
            continue;
        }
        if (!internal.has(url.origin)) continue;
        paths.add(url.pathname + url.search);
    }
    return [...paths].sort();
}

// Text nodes joined with spaces, so the result does not depend on whether a
// restyle wraps words in block or inline elements.
function visibleText(body) {
    if (!body) return "";
    const root = body.cloneNode(true);
    for (const el of root.querySelectorAll(INVISIBLE)) el.remove();
    const walker = root.ownerDocument.createTreeWalker(root, 4 /* SHOW_TEXT */);
    const parts = [];
    while (walker.nextNode()) parts.push(walker.currentNode.nodeValue);
    return clean(parts.join(" "));
}

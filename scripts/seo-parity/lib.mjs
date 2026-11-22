import { JSDOM } from "jsdom";

const SITE_ORIGINS = ["https://magic-room.dev", "https://www.magic-room.dev"];

const INVISIBLE = "script, style, noscript, template";

function clean(text) {
    return (text ?? "").replace(/\s+/g, " ").trim();
}

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

function redirectTarget(location, baseOrigin) {
    const url = new URL(location, `${baseOrigin}/`);
    if (url.origin === baseOrigin) return url.pathname + url.search;
    return url.origin + url.pathname;
}

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

const QUERY_INSENSITIVE_PATHS = new Set(["/generate"]);

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
        const keepQuery = !QUERY_INSENSITIVE_PATHS.has(url.pathname);
        paths.add(url.pathname + (keepQuery ? url.search : ""));
    }
    return [...paths].sort();
}

function visibleText(body) {
    if (!body) return "";
    const root = body.cloneNode(true);
    for (const el of root.querySelectorAll(INVISIBLE)) el.remove();
    const walker = root.ownerDocument.createTreeWalker(root, 4);
    const parts = [];
    while (walker.nextNode()) parts.push(walker.currentNode.nodeValue);
    return clean(parts.join(" "));
}

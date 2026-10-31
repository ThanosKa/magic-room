#!/usr/bin/env node
// SEO parity check. See scripts/seo-parity/README.md.
//
//   node scripts/seo-parity/seo-parity.mjs baseline <dir> <baseUrl>
//   node scripts/seo-parity/seo-parity.mjs diff <dir> <baseUrl> [--allow-list <file>] [--out <dir>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { diffSnapshots, extractPageRecord, normaliseString } from "./lib.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_FILE = "snapshot.json";
const USER_AGENT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const MAX_HOPS = 5;
const CONCURRENCY = 6;

function usage(message) {
    if (message) console.error(`Error: ${message}\n`);
    console.error(
        "Usage:\n" +
            "  node scripts/seo-parity/seo-parity.mjs baseline <dir> <baseUrl>\n" +
            "  node scripts/seo-parity/seo-parity.mjs diff <dir> <baseUrl> [--allow-list <file>] [--out <dir>]"
    );
    process.exit(2);
}

function parseArgs(argv) {
    const [mode, dir, baseUrl, ...rest] = argv;
    if (mode !== "baseline" && mode !== "diff") usage("mode must be 'baseline' or 'diff'");
    if (!dir || !baseUrl) usage("baseline dir and base URL are required");
    const options = { allowList: path.join(HERE, "allow-list.json"), out: null };
    for (let i = 0; i < rest.length; i += 2) {
        if (rest[i] === "--allow-list") options.allowList = rest[i + 1];
        else if (rest[i] === "--out") options.out = rest[i + 1];
        else usage(`unknown option ${rest[i]}`);
    }
    return { mode, dir: path.resolve(dir), baseOrigin: new URL(baseUrl).origin, ...options };
}

async function get(url) {
    return fetch(url, {
        redirect: "manual",
        // Not "text/html": with the dev Clerk keys in .env.local, Clerk answers
        // document requests with a 307 "dev-browser" handshake on every page.
        headers: { "User-Agent": USER_AGENT, Accept: "*/*" },
    });
}

async function sitemapPaths(baseOrigin) {
    const response = await get(`${baseOrigin}/sitemap.xml`);
    if (!response.ok) throw new Error(`sitemap.xml returned ${response.status}`);
    const xml = await response.text();
    const paths = Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g), (m) => {
        const url = new URL(m[1]);
        return url.pathname + url.search;
    });
    return paths.sort();
}

function extraPaths() {
    const extra = JSON.parse(fs.readFileSync(path.join(HERE, "extra-urls.json"), "utf8"));
    return Object.entries(extra)
        .filter(([key]) => !key.startsWith("_"))
        .flatMap(([, paths]) => paths);
}

// Follows same-origin redirects only; an external Location is recorded, not fetched.
async function crawlPage(baseOrigin, pagePath) {
    const hops = [];
    let url = new URL(pagePath, baseOrigin);
    for (;;) {
        const response = await get(url);
        const location = response.headers.get("location");
        hops.push({ url: url.pathname + url.search, status: response.status, location });
        if (!location || hops.length > MAX_HOPS) {
            const isHtml = (response.headers.get("content-type") ?? "").includes("text/html");
            const html = isHtml ? await response.text() : "";
            const headers = Object.fromEntries(response.headers.entries());
            return extractPageRecord({ path: pagePath, baseOrigin, hops, headers, html });
        }
        await response.body?.cancel();
        const next = new URL(location, url);
        if (next.origin !== baseOrigin) {
            return extractPageRecord({ path: pagePath, baseOrigin, hops, headers: {}, html: "" });
        }
        url = next;
    }
}

async function crawl(baseOrigin, paths) {
    const pages = {};
    const queue = [...paths];
    let done = 0;
    async function worker() {
        while (queue.length) {
            const pagePath = queue.shift();
            pages[pagePath] = await crawlPage(baseOrigin, pagePath);
            done += 1;
            if (done % 25 === 0) console.error(`  crawled ${done}/${paths.length}`);
        }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    // Stable key order so snapshot files diff cleanly.
    return Object.fromEntries(Object.keys(pages).sort().map((key) => [key, pages[key]]));
}

async function takeSnapshot(baseOrigin, knownPaths) {
    const sitemap = await sitemapPaths(baseOrigin);
    const robots = await get(`${baseOrigin}/robots.txt`);
    const robotsTxt = normaliseString(await robots.text(), baseOrigin);
    const paths = [...new Set([...sitemap, ...extraPaths(), ...knownPaths])];
    console.error(`Crawling ${paths.length} URLs on ${baseOrigin}`);
    return { sitemap, robotsTxt, pages: await crawl(baseOrigin, paths) };
}

function writeSnapshot(dir, snapshot, baseOrigin) {
    fs.mkdirSync(dir, { recursive: true });
    const meta = { takenAt: new Date().toISOString(), baseOrigin, urlCount: Object.keys(snapshot.pages).length };
    fs.writeFileSync(path.join(dir, SNAPSHOT_FILE), JSON.stringify({ meta, ...snapshot }, null, 2) + "\n");
}

// ---------- reporting ----------

function excerpt(text, at) {
    const start = Math.max(0, at - 60);
    return `${start > 0 ? "…" : ""}${text.slice(start, at + 100)}${at + 100 < text.length ? "…" : ""}`;
}

function describeChange(before, after) {
    if (Array.isArray(before) && Array.isArray(after) && before.every((v) => typeof v === "string")) {
        const removed = before.filter((v) => !after.includes(v));
        const added = after.filter((v) => !before.includes(v));
        if (removed.length || added.length) {
            return [...removed.map((v) => `      - ${v}`), ...added.map((v) => `      + ${v}`)].join("\n");
        }
    }
    if (typeof before === "string" && typeof after === "string" && (before.length > 200 || after.length > 200)) {
        let at = 0;
        while (at < before.length && before[at] === after[at]) at += 1;
        return `      - ${excerpt(before, at)}\n      + ${excerpt(after, at)}`;
    }
    return `      - ${JSON.stringify(before)}\n      + ${JSON.stringify(after)}`;
}

function printReport({ differences, failed }) {
    if (!differences.length) {
        console.log("SEO parity: 0 differences.");
        return;
    }
    const byPath = Map.groupBy(differences, (d) => d.path);
    for (const [pagePath, items] of byPath) {
        console.log(`\n${pagePath}`);
        for (const d of items) {
            console.log(`  ${d.allowed ? "[allowed]" : "[FAIL]   "} ${d.field}`);
            console.log(describeChange(d.before, d.after));
        }
    }
    const blocking = differences.filter((d) => !d.allowed).length;
    console.log(
        `\nSEO parity: ${differences.length} difference(s) on ${byPath.size} URL(s), ` +
            `${blocking} not on the allow-list. ${failed ? "FAIL" : "PASS"}`
    );
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.mode === "baseline") {
        const snapshot = await takeSnapshot(args.baseOrigin, []);
        writeSnapshot(args.dir, snapshot, args.baseOrigin);
        console.log(`Baseline: ${Object.keys(snapshot.pages).length} URLs written to ${path.join(args.dir, SNAPSHOT_FILE)}`);
        return;
    }
    const baseline = JSON.parse(fs.readFileSync(path.join(args.dir, SNAPSHOT_FILE), "utf8"));
    const allowList = JSON.parse(fs.readFileSync(args.allowList, "utf8"));
    const current = await takeSnapshot(args.baseOrigin, Object.keys(baseline.pages));
    if (args.out) writeSnapshot(args.out, current, args.baseOrigin);
    const result = diffSnapshots(baseline, current, allowList);
    printReport(result);
    process.exitCode = result.failed ? 1 : 0;
}

main().catch((error) => {
    console.error(error);
    process.exit(2);
});

// Submit every URL in the live sitemap to IndexNow (Bing, Yandex, etc.).
// Run AFTER deploying (the key file must be live at KEY_LOCATION):
//   node scripts/indexnow.mjs
// Add --dry-run to print the payload without sending it.

const HOST = "magic-room.dev";
const KEY = "95416de7529decbbd49cb024f7eab69a";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function getSitemapUrls() {
    const response = await fetch(SITEMAP_URL);
    if (!response.ok) {
        throw new Error(`Sitemap fetch failed: ${response.status}`);
    }
    const xml = await response.text();
    return Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g), (match) => match[1]);
}

async function main() {
    const urlList = await getSitemapUrls();
    if (urlList.length === 0) {
        throw new Error("No URLs found in sitemap");
    }

    const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

    if (process.argv.includes("--dry-run")) {
        console.log(JSON.stringify(payload, null, 2));
        return;
    }

    const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
    });
    console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${response.status}`);
    if (!response.ok && response.status !== 202) {
        console.log(await response.text());
        process.exitCode = 1;
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

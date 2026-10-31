# SEO parity check

Proves a change did not alter what Google sees. It crawls a production build,
records the SEO surface of every URL, and diffs that against a saved baseline.

## Run it

```sh
pnpm build && pnpm start -p 3101          # any port; use your own
# 1. Baseline (once, from the reference build):
node scripts/seo-parity/seo-parity.mjs baseline <baseline-dir> http://localhost:3101
# 2. Later, on your branch's build:
node scripts/seo-parity/seo-parity.mjs diff <baseline-dir> http://localhost:31NN \
  [--allow-list scripts/seo-parity/allow-list.json] [--out <dir-to-save-current-snapshot>]
```

Diff mode prints each changed URL and field, and exits `1` if any difference is
not on the allow-list (`0` = parity, `2` = usage or crawl error).
The baseline is one file, `<baseline-dir>/snapshot.json`.

## What is crawled

- Every `<loc>` in `/sitemap.xml`, plus `robots.txt`.
- `extra-urls.json`: all noindex design combos, the pruned design pages
  (`lib/seo/pruned.ts`, `PRUNED.md`), the `/vs` 308 redirects, `/generate` and
  a missing page (404).
- In diff mode also every URL in the baseline, so a page that vanished is reported.

Same-origin redirects are followed; external ones (Clerk sign-in) are recorded, not followed.

## What is recorded per URL

First status, redirect chain, final path, `<title>`, meta description,
canonical, robots meta, `X-Robots-Tag` header, H1 text, every JSON-LD block
(parsed), internal links (sorted, unique, `<a href>` on this server or
magic-room.dev, fragment dropped) and visible body text (text nodes of
`<body>` without `script`, `style`, `noscript`, `template`).
Also the sitemap URL list and the robots.txt text.

## What is normalised (so builds and servers compare equal)

- The crawled server's origin (`http://localhost:31NN`, also URL-encoded) is removed,
  so baselines from one port diff cleanly against another.
- `/_next/static/...` (hashed chunks, CSS, fonts, media) becomes `/_next/static/[asset]`.
- `/_next/data/<buildId>/` becomes `/_next/data/[build]/`.
- `/_next/image?url=X&w=..&q=..` keeps only `url=X`.
- `?dpl=...` (Vercel deployment id) and metadata-image hashes (`/icon.png?icon.8e2e57ee.png`) are dropped.
- External redirect targets keep origin + path only (Clerk's query echoes the server URL).
- Script tags (Next RSC payload, Clerk, analytics) are never recorded, except JSON-LD.
- H1 and body text compare with whitespace removed, so rewrapping words in new
  markup is not a difference; any change to the words is.
- Sitemap URLs are compared as a sorted list; `lastmod` is not compared.

Requests send `Accept: */*` with a Googlebot user agent: with the dev Clerk keys
in `.env.local`, an `Accept: text/html` request gets a Clerk "dev-browser" 307 on every page.

## Allow-list

`allow-list.json` lists `{ path, fields, reason }` entries that may differ.
It starts with only the homepage's `h1` and `bodyText` (spec: new homepage copy,
H1 still contains "AI interior design"). Field names: `status`, `redirects`,
`finalPath`, `title`, `description`, `canonical`, `robotsMeta`, `xRobotsTag`,
`h1`, `jsonLd`, `internalLinks`, `bodyText`, `page` (URL appeared/vanished);
site level: path `/sitemap.xml` field `sitemap`, path `/robots.txt` field `robotsTxt`.
Add an entry only for a change the spec allows, with the reason.

Logic and tests: `lib.mjs`, `tests/seo-parity/seo-parity.test.ts`.

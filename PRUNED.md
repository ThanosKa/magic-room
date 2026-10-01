# PRUNED.md - magic-room SEO pass, 2026-10-01 (branch seo-2026-10)

Everything below is driven by one typed list: `lib/seo/pruned.ts`. Reverting = deleting entries from that list (and re-running the build).
GSC columns are clicks / impressions: "Oct" = `gsc-2026-10-01/magic-room/performance/Pages.csv`, "Jul" = July export.
Keep thresholds applied: never prune a URL with >=1 click in either export or >=30 impressions in the Oct export.

## What the list drives
1. `X-Robots-Tag: noindex, follow` header, from `next.config.ts` `headers()` (one rule per noindex path).
2. Sitemap exclusion: `PRIORITY_DESIGN_SLUGS` (lib/seo/priority-pages.ts) now filters out pruned slugs, so `app/sitemap.ts` drops them. The page-level `robots: noindex` meta also follows from this (belt and braces with the header).
3. 308 redirects (`permanent: true`) from `next.config.ts` `redirects()`. `VS_SLUGS` (lib/seo/competitor-data.ts) filters out redirected slugs, so they leave the sitemap and `generateStaticParams`.
4. Hub and internal-link pools (`/design` hub, sibling blocks, comparison blocks, blog related designs, gallery cards) only use the filtered lists.

## A1. Design pages: indexable (sitemapped) -> noindex, follow, removed from sitemap (29)
State change for each: `200, indexable, in sitemap` -> `200, X-Robots-Tag noindex+follow, not in sitemap, not linked from hub`.
Reason: below keep threshold (0 clicks in both exports, <30 Oct impressions); heavily templated (theme x room).

| Path | Oct clicks / imps | Jul clicks / imps |
|---|---|---|
| /design/minimalist-living-room | 0 / 0 | 0 / 0 |
| /design/modern-bedroom | 0 / 0 | 0 / 0 |
| /design/bohemian-bedroom | 0 / 0 | 0 / 0 |
| /design/modern-kitchen | 0 / 0 | 0 / 0 |
| /design/luxury-bathroom | 0 / 0 | 0 / 0 |
| /design/japandi-living-room | 0 / 0 | 0 / 0 |
| /design/art-deco-living-room | 0 / 0 | 0 / 0 |
| /design/industrial-kitchen | 0 / 0 | 0 / 0 |
| /design/minimalist-bedroom | 0 / 24 | 0 / 5 |
| /design/farmhouse-home-theater | 0 / 9 | 0 / 23 |
| /design/farmhouse-bathroom | 0 / 0 | 0 / 13 |
| /design/farmhouse-bedroom | 0 / 0 | 0 / 1 |
| /design/farmhouse-dining-room | 0 / 0 | 0 / 4 |
| /design/coastal-bedroom | 0 / 10 | 0 / 12 |
| /design/coastal-walk-in-closet | 0 / 18 | 0 / 5 |
| /design/art-deco-sunroom | 0 / 5 | 0 / 9 |
| /design/art-deco-dining-room | 0 / 0 | 0 / 0 |
| /design/japandi-bedroom | 0 / 0 | 0 / 0 |
| /design/japandi-mudroom | 0 / 0 | 0 / 0 |
| /design/modern-home-theater | 0 / 0 | 0 / 0 |
| /design/mediterranean-living-room | 0 / 0 | 0 / 0 |
| /design/bohemian-living-room | 0 / 0 | 0 / 0 |
| /design/luxury-living-room | 0 / 0 | 0 / 0 |
| /design/luxury-bedroom | 0 / 0 | 0 / 0 |
| /design/industrial-living-room | 0 / 0 | 0 / 0 |
| /design/vintage-bedroom | 0 / 0 | 0 / 0 |
| /design/modern-office | 0 / 0 | 0 / 0 |
| /design/industrial-office | 0 / 0 | 0 / 0 |
| /design/scandinavian-office | 0 / 0 | 0 / 0 |

Kept indexable (9, clear the threshold): modern-sunroom, coastal-living-room, farmhouse-gaming-room, art-deco-bedroom, scandinavian-living-room, modern-living-room, modern-bathroom, scandinavian-bedroom, farmhouse-kitchen.
Revert: delete the entry's `designPrune(...)` line in lib/seo/pruned.ts.

## A2. /vs -> /alternatives (3 redirects, HTTP 308)
| Old | New | Oct clicks / imps | Jul clicks / imps | Reason |
|---|---|---|---|---|
| /vs/roomgpt | /alternatives/roomgpt | 0 / 0 | 0 / 0 | duplicate of the alternatives page (33-36% shared sentences) |
| /vs/decorai | /alternatives/decorai | 0 / 5 | 0 / 11 | same |
| /vs/interior-ai | /alternatives/interior-ai | 0 / 0 | 0 / 0 | same |

/vs/reimaginehome is kept (1 click in each export; 30 Oct impressions).
Internal links updated so nothing links to a redirect: footer (removed the vs/roomgpt link; /alternatives/roomgpt already there), home COMPARE_LINKS (removed the vs/roomgpt card), /alternatives hub cards, alternative page "head-to-head" chips, vs page sibling block, rotated comparison blocks (design + blog pages). Those blocks now only emit /vs links when `hasVsPage(slug)`, i.e. only /vs/reimaginehome.
Revert: delete the three `vsRedirect(...)` lines.

**Not done (merge risk):** `public/llms.txt` (lines 62-65) and `public/llms-full.txt` (line 146) still list /vs/roomgpt, /vs/interior-ai, /vs/decorai. They resolve through the 308, so nothing breaks. After the AI-model changes ship, repoint them to /alternatives/{slug}. Also fix the "Next.js 15" -> 16 error on llms.txt:28 at the same time.

## A3. /design hub
- The hub now renders cards only for indexable design pages (9 links, down from ~196 combos; whole page ~51 anchors including nav/footer, was ~224 links to design pages).
- Styles with no indexable page keep their heading, tagline and description (content preserved) and show a single link "Try {Style} on your own room photo" -> /generate.
- Chosen option (least invasive): the noindex combos are NOT linked anywhere. They stay live by direct URL (no 404s, nothing breaks for old links or shared URLs), and the product itself (/generate) lets users choose any style x room, so no user capability is lost. Sibling blocks on design pages were already restricted to indexable pages and still are.
- Other internal links that pointed to pruned combos were repointed or filtered: gallery cards for non-indexable combos still show the before/after image but no longer link (including 15+ combos that were already noindex before this pass), gallery chip list, gallery ItemList JSON-LD, home "Popular AI Design Ideas" grid (12 -> 8 kept pages), footer (Industrial kitchen -> Art Deco bedroom), virtual-staging chips (Minimalist living room -> Scandinavian living room), blog "Try these designs" lists (filtered to indexable).
- Revert: restore the `themePages` filter in app/design/page.tsx to `p.theme === theme`.

## A4. robots.txt
Added `Disallow: /api/` to each named bot group (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot, Applebot, Bytespider, CCBot). All bots remain `Allow: /`. /generate comment untouched.

## A5. HowTo JSON-LD removed
`howToSchema` deleted from lib/seo/schema.ts and from app/page.tsx, app/virtual-staging/page.tsx, app/design/[slug]/page.tsx. Organization, WebSite, SoftwareApplication, BreadcrumbList, BlogPosting, FAQPage kept.

## A6. Sitemap lastmod (app/sitemap.ts)
- Legal (/privacy, /terms): 2024-12-01 (verified: both pages say "Last Updated: December 2024").
- 2026-10-01: home, /virtual-staging, /gallery, /design hub, the 9 indexable design pages, /alternatives hub and 4 alternatives, /vs/reimaginehome (all edited in this pass).
- 2026-07-29: /pricing, /about, /blog hub. Blog posts keep their own dates.
- Sitemap URL count: 69 -> 37 (-29 design, -3 vs).

## A7. IndexNow (POST-DEPLOY USER STEP)
- Key file: `public/95416de7529decbbd49cb024f7eab69a.txt` (contains the key). Script: `scripts/indexnow.mjs` (fetches the live sitemap, POSTs host/key/keyLocation/urlList to https://api.indexnow.org/indexnow). NOT run.
- After deploy: confirm https://magic-room.dev/95416de7529decbbd49cb024f7eab69a.txt returns the key, then `node scripts/indexnow.mjs` (add `--dry-run` to preview).
- Note: the URLs IndexNow submits are the 37 live sitemap URLs. It does not tell Bing about the pruned URLs; they drop out via the noindex header on recrawl.

## Merge-risk files touched (modified in the original tree)
- `app/page.tsx`: 3 small hunks (remove howToSchema import, the HOME_HOWTO const, and its use in JsonLd).
No other file from the merge-risk list was touched. `.env.local` was copied into the worktree for the build and is not committed.

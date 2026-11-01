# Backlog

Keyword map last rebuilt: 2026-11-01
Ordered by expected sign-ups per hour of work. Take the top item that is not blocked. When you finish one, move it to `log.md` and delete it here. Items marked **[sonnet]** are small and mechanical: hand them to a Sonnet subagent (see `AUTOPILOT.md`, "Model use").

## Now

1. **Indexing: 10 sitemap URLs are not in Google.** (GSC URL inspection, 2026-11-01)
   - "URL is unknown to Google": `/virtual-staging`, `/terms`, and 7 blog posts (`how-to-redesign-living-room-with-ai`, `virtual-staging-real-estate-guide`, `modern-vs-minimalist-interior-design`, `ai-interior-design-tools-how-they-work`, `scandinavian-design-small-spaces`, `interior-design-on-a-budget-ai`, `industrial-kitchen-design-ideas`).
   - "Discovered, not indexed": `/gallery`, `/privacy`, `/alternatives/roomgpt`, `/blog/bedroom-redesign-with-ai`. "Crawled, not indexed": `/blog/ai-home-staging-before-selling`.
   - All return 200, self-canonical, index/follow, in the sitemap, and linked from other pages (crawl 2026-11-01). Pages have existed since February-March 2026, so this is Google not spending crawl on the site, not a block.
   - Owner action (the API cannot do it): Search Console → URL inspection → "Request indexing" for `/virtual-staging` first, then `/alternatives/roomgpt` and the blog posts.
   - Our action: link `/virtual-staging` and the unindexed posts from the homepage body (not only nav/footer) with descriptive anchor text; re-inspect next weekly run.
2. **[sonnet] "Google Gemini" is no longer the whole model story.** Since e537000, Ultra runs `openai/gpt-5.4-image-2`. Sentences that describe the product as a whole as "Google Gemini" are now incomplete. Change them to "Google Gemini and OpenAI image models" (or drop the vendor) in: `lib/seo/metadata.ts` (home description), `app/page.tsx`, `app/design/page.tsx`, `app/about/page.tsx` (person schema), `components/home/home-faq.ts` (lines 14, 19, 39; line 44 is already right), `components/home/home-content.tsx`, `components/seo/about-content.tsx`, `components/seo/feature-comparison-table.tsx`, `components/seo/vs-page-content.tsx`, `components/seo/alternative-page-content.tsx`, `app/alternatives/page.tsx`, `lib/seo/competitor-data.ts` (advantages and FAQs), `lib/seo/blog-data.ts` (Magic Room sentences only; leave general statements about Gemini as a model type). Leave `app/privacy/page.tsx` alone unless it is wrong. Also fix the stale model in `README.md` line 130 and `AGENTS.md` lines 10 and 47 (repo docs, public on GitHub).
3. **Unsourced competitor claims on comparison pages.** Site copy says RoomGPT and Interior AI use "diffusion" models and that RoomGPT, Reimagine Home and DecorAI "retain/store photos on servers". None has a source in the repo. For each: read the vendor's privacy policy and docs; keep the claim with a source and "as of" date if it holds, otherwise remove it. Files: `lib/seo/competitor-data.ts`, `components/seo/feature-comparison-table.tsx`, `components/seo/vs-page-content.tsx`, `app/alternatives/page.tsx`, `lib/seo/blog-data.ts` (best-ai-interior-design-tools-2026). `public/pricing.md` and `public/llms-full.txt` were already cleaned on 2026-11-01.
4. **Competitor pricing mechanics, Interior AI and Reimagine Home.** `lib/seo/competitor-data.ts` `pricingModel` for Interior AI says "Subscription / credits"; interiorai.com/pricing shows $49/$99/$199 a month or $29/$49/$99 yearly (2026-11-01). Reimagine Home: re-check per-plan allowance. Keep the file's rule: mechanics, not figures, plus the vendor link.

## Next

5. **New page: `/alternatives/genroom`** (query "genroom alternative", gap). GenRoom is the closest model to ours: one-time packs €9.99/36, €19.99/100, €39.99/300 credits, 2 credits per design, credits last 180 days (genroom.io/pricing, 2026-11-01). Be fair: GenRoom gives more designs per euro at the top pack; ours never expire and photos are never stored. Add the competitor in `lib/seo/competitor-data.ts`; it flows to the route, sitemap and hub. 3+ internal links on ship day.
6. **Page 3 → page 1: `/design/art-deco-bedroom`** (526 impressions in 90 days, position ~24-34 for "art deco bedroom ideas/design") and **`/design/scandinavian-living-room`** (555 impressions, ~31-37). Open the top 3 for each query, find what they cover that we don't, add it. Answer the query in the first paragraph.
7. **`/alternatives/reimaginehome`** at 8.2 for "reimagine home alternative" (426 impressions in 90 days, 0 clicks). Meta description rewritten 2026-11-01; next: compare the top 3 results and add what is missing.
8. **Commercial rights mismatch (owner question).** Pricing FAQ: free-credit output is personal use only. Terms §5.2: personal or commercial, no carve-out. Ask the owner; then make every page say the same thing.
9. **Sitemap date for the DecorAI page.** Its content changed on 2026-11-01 but all alternative pages share `PASS_2026_10_LAST_UPDATED` in `app/sitemap.ts`. Add a per-slug override when the next alternatives change ships.
10. **New pages: `/alternatives/visualizee`, `/alternatives/homedesigns-ai`.** Both rank for our category queries (web search 2026-11-01). Only if a search for "<name> alternative" shows real demand.

## Later

11. **Free tool: "What's my interior design style?" quiz** at `/tools/style-quiz`, mapping answers to our 14 styles and linking to the matching `/design/*` page and the generator. Works without sign-up. Search the query first.
12. **Homepage for "ai interior design" / "ai room design".** Not ranking in GSC. Compare with decorai.io, visualizee.ai, architectgpt.io pages that rank.
13. **"How much does AI interior design cost?"** No page answers it directly (gap). Candidate: a short section on `/pricing` with the per-quality cost table, or a blog post comparing per-design cost across tools with sources.
14. **Directories**: see `directories.md`. Owner submits.

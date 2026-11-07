# SEO and site copy

## Where things live

- Metadata `lib/seo/metadata.ts`; JSON-LD `lib/seo/schema.ts`; internal link blocks `lib/seo/internal-links.ts`.
- Blog posts `lib/seo/blog-data.ts`; design pages `lib/seo/design-data.ts` and `lib/seo/priority-pages.ts`; competitor pages `lib/seo/competitor-data.ts`.
- AI fact files `public/llms.txt`, `public/llms-full.txt`, `public/pricing.md`.
- Audience and voice `.agents/product-marketing-context.md`. Its product facts are out of date (old credit counts, Gemini only): take audience and wording from it, facts from the code.

## Product facts

The code wins over any page or doc: prices, credits, tiers and models come from `lib/constants.ts`. When a tier, pack or model changes, update `public/pricing.md`, `public/llms.txt`, `public/llms-full.txt`, the pricing and home FAQs and `lib/seo/` in the same change.

Copy has to keep saying what these earlier fixes settled:

- One redesign per run, in 30 to 60 seconds; Ultra takes about 2 minutes.
- Photos are processed in memory and never stored.
- 1 free credit at sign-up, once; there is no daily reset. Credits never expire.
- Every design, free credit included, carries full commercial rights.
- All sales are final (terms 4.2 and 4.3). Credits returned after a failed generation are not a monetary refund (terms 4.4).

## Crawling and indexing

- `robots.txt` is the static `public/robots.txt`: a dynamic `app/robots.ts` failed on Vercel cold starts and Google reported it unreachable.
- `proxy.ts` falls through with `NextResponse.next()` when Clerk errors, so `robots.txt` and `sitemap.xml` stay reachable. Keep that `try/catch`.
- `app/sitemap.ts` uses hand-set per-surface dates: bump only the surface you changed, and never use `new Date()`. The rules at the top of that file say which URLs may be listed.

## Pruning and redirects

`lib/seo/pruned.ts` drives noindex headers, sitemap exclusion and `/vs` redirects through `next.config.ts`. Read `PRUNED.md` first; it records what was pruned, the keep thresholds and how to revert an entry.

## Checks

- `scripts/seo-parity/README.md`: prove a change did not alter what Google sees, by comparing a production build with a baseline.
- `node scripts/indexnow.mjs` runs after a deploy to the Worker; list it for the owner.

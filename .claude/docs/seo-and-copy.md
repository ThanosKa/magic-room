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
- `app/sitemap.ts` uses hand-set per-surface dates: bump only the surface you changed, and never use `new Date()`. Every URL it lists must:
  1. render (no 404): derive slugs from the same data modules the routes use, never from a hand-kept copy;
  2. be indexable (no `robots: { index: false }` on the route);
  3. self-canonical to exactly this absolute, non-trailing-slash URL (the homepage is the exception: its `<loc>` is `https://magic-room.dev/`, matching the Search Console Pages report and `createMetadata({ path: "" })`);
  4. be reachable by at least one internal link.
- Left out on purpose: `/generate` (noindex, behind auth), `/design/<non-priority>` (the combos outside `PRIORITY_DESIGN_SLUGS` are noindex), `/design/<pruned>` (noindex via `lib/seo/pruned.ts`), `/vs/<redirected>` (308 to `/alternatives/<slug>`), `/api/*` (disallowed in `robots.txt`), 404 and error routes.
- Duplicate `<loc>` values make Google ignore a sitemap; `app/sitemap.ts` drops them, so a slug in both `PRIORITY_DESIGN_SLUGS` tiers is harmless.

- Design page meta descriptions come from the rotated templates in `lib/seo/design-data.ts`, never from the intro's first sentence: that reads like an encyclopedia entry and gives searchers no reason to click.
- A page-level `robots` replaces the root layout's `robots` object, it is not merged, so `createMetadata` repeats the `googleBot` directives (`max-image-preview:large`, `max-snippet:-1`).
- The footer's column order, headings and link text are part of every page's visible text and internal links, and the SEO parity check compares them: change them only on purpose.
- The `SoftwareApplication` JSON-LD has no `aggregateRating`, because there are no collected reviews; an invented rating breaks Google's structured-data policy.

## Pruning and redirects

`lib/seo/pruned.ts` drives noindex headers, sitemap exclusion and `/vs` redirects through `next.config.ts`. Read `PRUNED.md` first; it records what was pruned, the keep thresholds and how to revert an entry.

## Checks

- `scripts/seo-parity/README.md`: prove a change did not alter what Google sees, by comparing a production build with a baseline.
- `node scripts/indexnow.mjs` runs after a deploy to the Worker; list it for the owner.

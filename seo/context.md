# Magic Room: product context

Built 2026-11-01 from the code on `dev` (49 commits ahead of `main`, not yet live) and the live site. Every fact names its source. If a page and this file disagree with the code, the code wins: update this file.

## What it is

One-line: an AI interior design web app. You upload one photo of a real room, pick a room type and a style, and get one redesign of that same room back in 30 to 60 seconds (about 2 minutes at Ultra quality). Walls, windows and layout stay; finishes and furniture change.

- Flow: photo is turned into base64 in the browser and posted to `/api/generate`; the API checks Clerk auth, an Upstash rate limit (100/hour per user), and the credit balance, then calls OpenRouter synchronously. Source: `app/api/generate/route.ts`, `lib/openrouter.ts`, `lib/constants.ts` (`RATE_LIMIT`).
- One image per run. Source: `AGENTS.md`, commit 25fddb7 "say one redesign per run everywhere, not 4-8".
- Photos are never stored: no bucket, no image column, not used for training. Source: `AGENTS.md` (Privacy Guarantees), `app/privacy/page.tsx`.
- Failed run: credits refunded automatically. Source: `app/api/generate/route.ts` (`refundCredits`).
- Images accepted: JPEG, PNG, WebP up to 10 MB. Source: `lib/constants.ts` (`MAX_IMAGE_SIZE`, `ACCEPTED_IMAGE_FORMATS`).
- Optional note up to 500 characters. Source: `lib/constants.ts` (`NOTE_MAX_LENGTH`).
- 14 room types and 14 styles, all selectable in the generator. Source: `lib/constants.ts` (`ROOM_TYPES`, `THEMES`), `components/generate/option-pickers.tsx`.
  - Rooms: living room, bedroom, kitchen, bathroom, dining room, office, gaming room, nursery, laundry room, basement, sunroom, home theater, mudroom, walk-in closet.
  - Styles: Modern, Minimalist, Scandinavian, Industrial, Tropical, Bohemian, Vintage, Luxury, Japandi, Art Deco, Coastal, Farmhouse, Mediterranean, Transitional.
- Does not do: exterior, landscape, floor plans, furniture shopping lists, stored generation history. Source: `public/llms-full.txt` (limitations), no such code paths.

## Quality tiers (since commit e537000, 2026-11-01)

Source: `lib/constants.ts` `QUALITY_OPTIONS`.

| Name | Id in code | Credits | Model (OpenRouter) | Wait |
|---|---|---|---|---|
| Quick | standard | 1 | google/gemini-nano-banana-2.1 | 30-60 s |
| Pro | premium | 2 | google/gemini-3-pro-image | 30-60 s |
| Ultra | ultra | 3 | openai/gpt-5.4-image-2 | about 2 min |

Old facts that must not appear anywhere: "Standard / Premium quality", `gemini-3.1-flash-image`, "Gemini only".

## Prices

Source: `lib/constants.ts` `CREDIT_PACKAGES`, `components/pricing-content.tsx`. One-time Stripe payments, no subscription, credits never expire.

| Pack | Price | Credits | Per Quick design | Extras on pricing page |
|---|---|---|---|---|
| Free | €0 | 1 on signup, no card | - | full commercial rights, same as paid |
| Starter | €9.99 | 20 | €0.50 | - |
| Growth | €19.99 | 60 | €0.33 | Priority support |
| Premium | €29.99 | 120 | €0.25 | 24/7 priority support |

Old packs (30 / 90 / 200, before 2026-11-01) must not appear anywhere. The home hero says "from €0.25 a design" (`components/home/home-hero.tsx`).

Commercial rights: every design, including the free signup credit, carries full commercial rights (owner decision 2026-11-01). Pricing FAQ, home FAQ, `public/pricing.md`, `public/llms*.txt` and `app/terms/page.tsx` §5.2 all say this; the terms no longer forbid commercial use in §3.2.

## Buyer

- Homeowners and renters planning a redesign who want to see their own room in a style before spending money. One-off use, a few rooms a year, so one-time credits beat subscriptions.
- Real estate agents and Airbnb hosts staging listing photos (`/virtual-staging`).
- Interior designers making quick client mockups.
- Conversion: sign-up (Clerk) → free Quick design → credit pack purchase (Stripe). `/generate` is behind auth; a signed-out browser is redirected to `accounts.magic-room.dev/sign-in` (checked 2026-11-01), bots get a 404 by design (`public/robots.txt` comment).

## Site and how it is built

- Next.js 16 App Router (`package.json`), pnpm, Tailwind v4. Live at https://magic-room.dev, Vercel. `main` is production; work happens on `dev`.
- Titles, descriptions, canonicals: `lib/seo/metadata.ts` (`createMetadata`, per-page helpers). Site constants: `lib/seo/config.ts`.
- Structured data: `lib/seo/schema.ts`, rendered by `components/seo/json-ld.tsx`.
- Sitemap: `app/sitemap.ts`, hand-set per-surface dates (never `new Date()`); blog dates come from each post's `updatedDate`/`publishedDate`.
- robots: `public/robots.txt` (static). AI fact files: `public/llms.txt`, `public/llms-full.txt`, `public/pricing.md`.
- Blog posts: objects in `lib/seo/blog-data.ts` (rendered by `app/blog/[slug]/page.tsx` + `components/seo/blog-post-content.tsx`).
- Design idea pages: `lib/seo/design-data.ts`; only `PRIORITY_DESIGN_SLUGS` (`lib/seo/priority-pages.ts`) are indexable and in the sitemap.
- Competitor pages: `lib/seo/competitor-data.ts` → `/alternatives/[competitor]`, `/vs/[competitor]` (only `reimaginehome` keeps a /vs page).
- Pruning, noindex and redirects: `lib/seo/pruned.ts`, applied in `next.config.ts`; history in `PRUNED.md`.
- Internal link blocks: `lib/seo/internal-links.ts`.
- Checks: `scripts/seo-parity/` (sitemap/canonical parity), `scripts/indexnow.mjs` (submit sitemap to Bing/Yandex after deploy).
- Design system rules for any UI change: `AGENTS.md` (Design System section).

## Competitors

Researched 2026-11-01 with web search and each vendor's pricing page. Sitemap snapshots in `seo/competitors/`.

| Name | Domain | Billing (source, as of 2026-11-01) | Notes |
|---|---|---|---|
| RoomGPT | roomgpt.io | Credit purchases; prices not shown (roomgpt.io/buy-credits) | No sitemap. We have /alternatives/roomgpt. |
| DecorAI | decorai.io | $24/mo, $120/half-year, $240/yr, unlimited images; 1-day trial, 3 designs, card required (decorai.io/pricing) | Was wrongly listed as decorai.com until 2026-11-01. |
| Reimagine Home | reimaginehome.ai | Subscription, $14-$99/mo per page title; credit allowance per month (reimaginehome.ai/pricing, per-plan prices not verified) | Huge content play (~3,900 URLs). |
| Interior AI | interiorai.com | $49/$99/$199 a month, or $29/$49/$99 a month yearly (interiorai.com/pricing) | Programmatic /styles pages. |
| GenRoom | genroom.io | One-time packs: €9.99/36, €19.99/100, €39.99/300 credits, credits last 180 days, 2 credits per design (genroom.io/pricing) | Closest model to ours. No page yet. |
| Visualizee | visualizee.ai | $20/$40/$80 a month (visualizee.ai/pricing) | Has 18 /comparison pages. No page yet. |
| HomeDesigns AI | homedesigns.ai | Subscriptions $22-$37/mo, partly verified (homedesigns.ai/pricing) | Ranks for "virtual staging ai", "redesign my room ai". |
| ArchitectGPT | architectgpt.io | Not verified (Cloudflare 403) | Blog ranks for many generic queries. |

## Search Console baseline

Property `https://magic-room.dev/` (service account, read-only). 28 days 2026-10-02 to 2026-10-29: 24 clicks, 743 impressions (previous 28 days: 19 / 625). Almost all clicks are brand ("magicroom", "magic room"). Source: `node seo/gsc.mjs compare`, run 2026-11-01.

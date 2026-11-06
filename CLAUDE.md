# Magic Room

AI interior design web app: upload one room photo, pick a room type and a style, get one redesign of that room back. Sold on one-time credit packs. Next.js App Router on Vercel, live at magic-room.dev. This repo is public.

## Navigation

- `lib/constants.ts`: the single source for quality tiers (credits, OpenRouter model, wait time), credit packs, room types, styles and the rate limit.
- `lib/supabase.ts`: service-role client plus every user and credit query.
- `proxy.ts`: Clerk protection for pages (`/generate`). It lets `/api/*` through, so each API route authenticates itself.
- `lib/seo/`: data and helpers behind the marketing pages, which live in `app/` and `components/seo/`.
- `tests/`: mirrors the source tree. Vitest collects only `tests/**/*.test.{ts,tsx}`.

**Generate**: browser shrinks the photo to base64 (`lib/room-photo.ts`) → `POST /api/generate` (synchronous, up to 300 s: auth, validate, credit check, rate limit, deduct, OpenRouter) → one image comes back as a base64 data URL; any failure returns the credits. No polling, no job table.
**Purchase**: `/api/checkout` → Stripe Checkout → `/api/webhooks/stripe` adds the credits.
**Sign-up**: Clerk → `/api/webhooks/clerk` creates the Supabase row with 1 free credit; `ensureUserExists` creates it if the webhook never arrived.

## Commands

- pnpm only (version pinned by `packageManager`). Scripts are in `package.json`.
- Run tests once with `pnpm test:run`; `pnpm test` is watch mode.
- `pnpm test:coverage` fails today: `@vitest/coverage-v8` is not installed.
- A `pnpm type-check` error that points only into `.next/types/` is a stale generated file: run `pnpm build`, then type-check again.
- Leave to the developer: `scripts/generate-design-images.mjs` and `scripts/test-image-gen.mjs` (spend OpenRouter money, overwrite `public/images/designs`), `scripts/indexnow.mjs` (submits the live sitemap, after a deploy reaches `main`).

## Before working on

- Any code (writing, editing or reviewing a diff) → read `CODING_STANDARDS.md`
- Credits, the generate route, prompts, model slugs, Stripe or Clerk webhooks, the rate limit, database schema or migrations → read `.claude/docs/credits-and-webhooks.md`
- UI, styling or animation → read `.claude/docs/design-system.md`
- Site copy, metadata, SEO pages, the sitemap, redirects or pruning, `public/llms*.txt`, `public/pricing.md` → read `.claude/docs/seo-and-copy.md`

## Git

- `main` is production; `dev` collects work and is released by a PR `dev` → `main` titled `release: ...`.
- Branch from `dev` as `<type>/<slug>` (`fix/header-scope-selector`, `seo/model-facts`) and open the PR against `dev`.
- The scheduled SEO autopilot is the exception: its runbook lives in the private `ThanosKa/seo-hub` repo and it opens `autopilot/seo-YYYY-MM-DD` PRs against `main`.
- Commits are Conventional Commits with a scope, lowercase and imperative: `fix(copy): ...`, `feat(generate): ...`. Types in use: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `seo`.
- PR bodies say what changed and why, with the evidence for each change.
- CI (lint, type-check, `test:run`, build) runs on PRs into `main` and `dev` and on pushes to `main`.
- If your change makes a line in these docs false, fix that line in the same PR.
- The owner merges.

## Hard guardrails

- Room photos and generated images stay in memory: no bucket upload, no database column, no image data in logs (log sizes). The site promises this to every user.
- Secrets stay server-side: `lib/supabase.ts`, `lib/stripe.ts`, `lib/redis.ts` and `lib/openrouter.ts` are imported only by server code, and client code reads only `NEXT_PUBLIC_*`. Never commit `.env*`; `.env.example` holds placeholders.
- The repo is public: never write user, revenue or sign-up numbers into any file, commit or PR. Search Console aggregates are fine.
- Add a dependency only with the owner's approval. A package with a build script must also be listed in `allowBuilds` in `pnpm-workspace.yaml`, or `pnpm install` fails.

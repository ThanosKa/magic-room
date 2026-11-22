# Credits, generation and webhooks

Money and credit rules. Each one exists to keep a user from being charged twice, or charged for nothing.

## Tiers and packs

- Costs, model slugs and wait times come from `QUALITY_OPTIONS`; packs come from `CREDIT_PACKAGES` (both in `lib/constants.ts`). Read them from there, never as literals.
- Internal ids differ from display names, and ids stay as they are for old data: quality `standard` = Quick, `premium` = Pro, `ultra` = Ultra; packs are `starter`, `growth`, `premium`. `premium` names both a quality and a pack.

## The generate route (`app/api/generate/route.ts`)

- Order: auth → Zod → `ensureUserExists` → balance check (402) → `checkRateLimit` (429) → `spendCredits` (`deductCreditsWithUsage` → OpenRouter).
- The route charges and refunds only through `spendCredits` in the credit ledger (`lib/credit-ledger.ts`), handing it the prompt and the OpenRouter call as the work, and has no Refund code of its own. The Charge and its `usage` row are written together or not at all: if either fails, the ledger answers `not-charged` (500 "Failed to deduct credits") and the Design never starts. After the Charge, the ledger gives every failure, a thrown error included, exactly one Refund. It answers `not-charged`, `delivered`, `refunded` or `refund-failed`, and the route maps each kind to its response.
- The ledger's Refund adds the credits through `addCredits`, then writes a `refund` transaction. It answers `refunded` only when the credits were added, so the route never claims a refund that did not happen. `refund-failed` does not carry the Refund's error, so the route logs that line without it.
- A 500 body with `success: false` is the client's signal that the credits came back (`components/generate/tool-messages.tsx`). Send it only on `refunded`.
- Retrying a generation is the user's choice: an automatic retry spends credits or OpenRouter money a second time.
- There is no `maxDuration`: Workers ignore it, and a request runs as long as the client stays connected. `generateDesign` gives up after `OPENROUTER_TIMEOUT_MS` (280 s), which ends in the refund. A wait over 100 s with OpenRouter has not been proven on the Worker.
- A closed tab must not keep the credits. `POST` hands the whole request to `keepAliveUntilSettled` (`lib/keep-alive.ts`, `after` from `next/server`, which is `waitUntil` on Workers and gives about 30 s past a disconnect), and passes `request.signal` to `generateDesign`, so a disconnect aborts the OpenRouter call at once and the normal refund runs. `request.signal` fires on Workers only with the `enable_request_signal` flag in `cloudflare.config.ts`.

## Balance writes

- Change a balance only through a SQL function: `deductCreditsWithUsage` (`006`), `addCredits` (`005`) or `grantPurchaseCredits` (`004`). Each changes it in one database call, so requests landing together cannot overwrite each other. Never write a balance computed in app code.
- Every usage, refund and purchase also writes a `transactions` row.
- `tests/supabase/credit-functions.test.ts` runs these SQL functions for real on in-memory Postgres (PGlite, a dev dependency): it applies every file in `supabase/migrations/` in order after creating the Supabase roles and `auth.uid()` stand-ins. Add a new migration's function there. It cannot test two connections at once; the row lock guards that.
- Migration `006_charge_with_usage_row.sql` adds `deduct_credits_with_usage`, which subtracts the amount and writes the `usage` row in one transaction (both or nothing). The ledger charges only through it. `deduct_credits` (`005`) stays in the database with no caller in the code, so rolling the code back needs no migration.

## Stripe webhook (`app/api/webhooks/stripe/route.ts`)

- Verify first: `receiveStripeEvent` (`lib/webhook-intake.ts`) reads the raw body and awaits `parseWebhookEvent`; a missing or bad signature returns its 401 response unchanged. It uses `constructEventAsync`, because the sync `constructEvent` throws on Workers and every real event would look like a bad signature.
- Grant only through `grantPurchase` in `lib/credit-ledger.ts`, which calls the `grant_purchase_credits` SQL function (`supabase/migrations/004_atomic_purchase_grant.sql`) via `grantPurchaseCredits` in `lib/supabase.ts`. It writes the transaction and adds the credits together, and a unique index allows one purchase row per payment. This is what stops double grants.
- A failed grant returns 500 so Stripe redelivers. `isWebhookProcessed({ webhookType: "stripe", eventId })` before any work and `markWebhookProcessed` after the grant only save work: the Redis key lasts 24 hours and a Redis error fails open.
- Grant credits only when `payment_status` is `paid` or `no_payment_required`, and only from `metadata.packageId` looked up in `CREDIT_PACKAGES`.
- Resolve the user from `metadata.userId` or `client_reference_id`: Supabase UUID first, then Clerk id.
- Store `payment_intent` as `stripe_payment_id`, or `session.id` when there is none.
- Purchase and welcome emails are sent after the webhook answers, through `keepAliveUntilSettled` (`waitUntil` on Workers, about 30 s), so a slow Resend cannot delay the 200. A failed or timed-out email (10 s) is logged with `logger.error` and never fails the webhook. Purchase emails name the pack and credits only: a price would be wrong once a promotion code applies.

## Clerk webhook (`app/api/webhooks/clerk/route.ts`)

- `receiveClerkEvent` (`lib/webhook-intake.ts`) reads the raw body and verifies it with `svix`; the route switches on the typed event it returns. After each successful outcome the route calls `markWebhookProcessed({ webhookType: "clerk", eventId: svixId })`; nothing reads that key, so deliveries are not de-duplicated and the handlers' idempotency is what protects against redelivery.
- Handlers are idempotent: an existing row on `user.created` or a missing row on `user.deleted` returns 200 with no change.
- `getUserByClerkId` and `getUserById` return `null` only when the User does not exist (PGRST116); any other database error is logged and thrown, so a database failure is never read as "no such User". `ensureUserExists` lets that throw reach its caller (no Clerk call, no creation) and still creates a missing User. Every caller's existing catch answers 500: generate, checkout and the user endpoint "Internal server error", Clerk `user.created` "Error creating user", `user.updated` "Error updating user", `user.deleted` "Error deleting user", the Stripe webhook "Webhook error" (the event stays unprocessed, so the retry is handled in full).
- Return 500 on a database failure so Clerk redelivers, and 200 for event types the route ignores.
- Clerk once auto-disabled this endpoint and sign-ups stopped reaching Supabase. `ensureUserExists` is the fallback and the `clerk_user_id` unique constraint settles a race with the webhook, so a user gets the free credit once.

## Rate limit (`lib/redis.ts`)

`checkRateLimit` allows `RATE_LIMIT` generations per `RATE_LIMIT_WINDOW` per user. It always passes when `NODE_ENV` is `development`, so a limit change is testable only with mocks or outside dev. It fails closed: on a Redis error it throws, and the generate route answers 500 before charging. The webhook dedup helpers still fail open, which is safe because the SQL functions stop double grants.

## Models and prompts (`lib/room-designer.ts`, `lib/openrouter.ts`)

- The generate route reaches the model only through the room designer (`designRoom` in `lib/room-designer.ts`), which builds the prompt, calls `generateDesign` and returns the images or a tagged failure. A provider, model or fallback change happens behind it; the route never imports the prompt builder or `generateDesign`. `designRoom` stays out of `lib/openrouter.ts` on purpose: calls inside one module do not pass through `vi.mock`, so it would call the real `generateDesign` and `buildDesignPrompt` and hide the mocked ones from the route tests and the prompt-baseline test.
- OpenRouter retires model slugs. A swap touches `QUALITY_OPTIONS`, `tests/lib/openrouter.test.ts`, `tests/app/api/generate/route.test.ts`, `public/pricing.md`, `public/llms.txt` and `public/llms-full.txt`.
- `tests/app/api/generate/prompt-baseline.test.ts` locks every prompt to the character. A failure means generation output changed for an existing option: change the prompt back. Its fixture stays as recorded. Options added since then are covered by `tests/app/api/generate/all-options.test.ts`.

## Database

- Tables in use: `users`, `transactions`. `generations` was dropped in `003`. `credit_packages` and `supabase/seed.sql` are unused and out of date; `CREDIT_PACKAGES` is what the app reads.
- The row-level security policies in `001` compare `auth.uid()` with the Clerk id and do not apply to the service-role client.
- Add a migration as the next `supabase/migrations/NNN_description.sql`, leaving earlier files as they are. There is no Supabase CLI config: the owner applies migrations by hand, `006` included.

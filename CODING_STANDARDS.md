# Coding Standards

The rules every diff in this repo is checked against. Writing code: every rule that touches the files you change holds before you finish. Reviewing: check the diff against every rule in turn. `any` and `@ts-ignore` are already lint errors, so they are not repeated here; `pnpm lint` stays at zero warnings.

## API routes

- Open every route with `await auth()` from Clerk and return 401 when `userId` is missing; `proxy.ts` does not cover `/api/*`. Webhook routes authenticate by signature instead.
- Resolve the user with `ensureUserExists(clerkUserId)`, which survives a missed Clerk webhook. `getUserByClerkId` alone left new users stuck on "User not found" in production.
- Scope every query on a user's rows by that resolved user: the service-role client bypasses row-level security, so app code is the only access check.
- Parse every request body with a Zod schema via `safeParse` and return 400 with `{ error: "Invalid input", issues }`.
- Answer with the matching status: 400, 401, 402 (not enough credits), 404, 429, 500, and a body of `{ error: string }`. A 500 says `"Internal server error"`; the real error goes to the log.
- Webhook routes read the raw body with `request.text()` before verifying the signature.

## Logging and errors

- Log through `logger` (`lib/logger.ts`, Pino) as `logger.error({ err, ...context }, "message")`; `console.*` stays out of `app/`, `components/`, `lib/`, `hooks/` and `stores/`.
- Leave secrets and image data out of log context.
- Show every failure to the user as a plain-language message. Generate tool messages live in `components/generate/tool-messages.tsx`; elsewhere use a `sonner` toast.

## TypeScript

- Import internal modules through `@/*`. Relative paths are only for CSS and test fixtures.
- Order imports external first, then internal.
- Use `interface` for object shapes and `type` for unions and aliases.
- Give domain models in `types/index.ts`, `lib/seo/pruned.ts` and the `lib/seo/*-data.ts` files an `I` prefix (`IUser`, `IBlogPost`). Props, store shapes and file-local interfaces carry no prefix.
- Name components in PascalCase, functions in camelCase, module constants in UPPER_SNAKE_CASE, files in kebab-case.
- Narrow outside data with type guards or Zod; model mutually exclusive state as a discriminated union.

## React and state

- Read Clerk's user with `useHydratedUser` (`hooks/use-hydrated-user.ts`) for anything that changes rendered markup. Plain `useUser` reports the user on the first client render and causes hydration error #418.
- Keep one Zustand store per domain in `stores/`, as plain `create()` with no middleware. Persistent data lives in Supabase and component-only state in React hooks.

## Tests

- Put tests under `tests/`, mirroring the source path; a test elsewhere never runs.
- Mock external services (Supabase, Upstash, OpenRouter, Stripe, Clerk) with `vi.mock`.

# Coding Standards

The rules every diff in this repo is checked against. Writing code: every rule that touches the files you change holds before you finish. Reviewing: check the diff against every rule in turn. `@ts-ignore` is a lint error too. Lint enforces `any`, type assertions (`as const` aside), non-null `!`, `console`, exhaustive `switch`, positional parameters and comments: resolve each lint error in the code itself. `pnpm lint` stays at zero warnings.

## API routes

- Open every route with `await auth()` from Clerk and return 401 when `userId` is missing; `proxy.ts` does not cover `/api/*`. Webhook routes authenticate by signature instead.
- Resolve the user with `ensureUserExists(clerkUserId)`, which survives a missed Clerk webhook. `getUserByClerkId` alone left new users stuck on "User not found" in production.
- Scope every query on a user's rows by that resolved user: the service-role client bypasses row-level security, so app code is the only access check.
- Parse every request body with a Zod schema via `safeParse` and return 400 with `{ error: "Invalid input", issues }`.
- Answer with the matching status: 400, 401, 402 (not enough credits), 404, 429, 500, and a body of `{ error: string }`. A 500 says `"Internal server error"`; the real error goes to the log.
- Both webhook routes verify the raw body through `lib/webhook-intake.ts` (`receiveStripeEvent`, `receiveClerkEvent`) before parsing it.

## Logging and errors

- Log through `logger` (`lib/logger.ts`, Pino) as `logger.error({ err, ...context }, "message")`; `console.*` stays out of `app/`, `components/`, `lib/`, `hooks/` and `stores/`. The one exception is `lib/logger.ts`, which writes through the console on the Workers runtime.
- Leave secrets and image data out of log context.
- Show every failure to the user as a plain-language message. Generate tool messages live in `components/generate/tool-messages.tsx`; elsewhere use a `sonner` toast.

## TypeScript

- Import internal modules through `@/*`. Relative paths are only for CSS and test fixtures.
- Order imports external first, then internal.
- Use `interface` for object shapes and `type` for unions and aliases.
- Give domain models in `types/index.ts`, `lib/seo/pruned.ts` and the `lib/seo/*-data.ts` files an `I` prefix (`IUser`, `IBlogPost`). Props, store shapes and file-local interfaces carry no prefix.
- Name components in PascalCase, functions in camelCase, module constants in UPPER_SNAKE_CASE, files in kebab-case.
- External data (requests, storage, third-party responses) enters as `unknown`, is parsed once with Zod into a named domain type, and is trusted from there on. Hand-write a type guard only where no schema fits.
- A type guard, named `isX` or `hasX`, checks every property its return type claims.
- Narrow in this order: discriminant `switch`, then `in`, then `typeof` or `instanceof`, then a type guard.
- Model variants as a union on one literal discriminant field, so each state carries only its own fields: `{ kind: "loading" } | { kind: "success"; data: User } | { kind: "error"; error: string }`.
- Shape the type so the illegal value cannot be built: `[T, ...T[]]` for a non-empty list, `start` plus `duration` for a range. Keep `T[]` while every operation on it stays total; strengthen it only where the loose type would force `!`, a cast, or a "should never happen" throw.
- Brand primitives that must stay apart, such as IDs: `string & { readonly __brand: "UserId" }`. A brand comes from a verifying type guard (`input is UserId`).
- Build a new type from existing ones (`Pick`, `Omit`, `Parameters`, `ReturnType`, `Awaited`, `typeof`, `z.infer`) before declaring a new one.
- Check a literal against a type with `satisfies`, which keeps its literal types.
- A function you write with more than one parameter takes one object argument, so each call site names its values. Inline callbacks, framework signatures (route handlers, page and layout props) and hot paths (per-frame render, parsers) keep positional parameters.

## React and state

- Read Clerk's user with `useHydratedUser` (`hooks/use-hydrated-user.ts`) for anything that changes rendered markup. Plain `useUser` reports the user on the first client render and causes hydration error #418.
- Keep one Zustand store per domain in `stores/`, as plain `create()` with no middleware. Persistent data lives in Supabase and component-only state in React hooks.

## Tests

- Put tests under `tests/`, mirroring the source path; a test elsewhere never runs.
- Mock external services (Supabase, Upstash, OpenRouter, Stripe, Clerk) with `vi.mock`; run everything else for real: the framework's test primitives, a real or in-memory implementation, a running build for UI.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Magic Room is an AI-powered interior design assistant built with Next.js 15. Users upload room photos, select design themes, and receive AI-generated design variations from Google's Gemini Vision model via OpenRouter. The app uses a credit-based system with Stripe payments, Clerk authentication, and Supabase PostgreSQL database.

## Development Commands

### Essential Commands
- `pnpm dev` — Start development server on http://localhost:3000
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint (must pass before commits)
- `pnpm type-check` — Run TypeScript type checking (must pass before commits)
- `pnpm test` — Run tests in watch mode
- `pnpm test:run` — Run tests once
- `pnpm test:coverage` — Run tests with coverage report

### Quality Gates
Before committing, all of these must pass:
```bash
pnpm lint && pnpm type-check && pnpm test:run
```

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 15 App Router (Server Components by default)
- **Language**: TypeScript 5 (strict mode enabled)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **State**: Zustand for client state (user credits, generation status)
- **Database**: Supabase PostgreSQL with service role client
- **Auth**: Clerk (middleware-based session management)
- **AI**: OpenRouter API → Google Gemini 2.5 Flash/3 Pro models
- **Payments**: Stripe (checkout + webhooks)
- **Rate Limiting**: Upstash Redis (100 generations/hour per user)
- **Logging**: Pino structured logging

### Data Flow Architecture

**Image Generation Flow** (synchronous, no job queue):
1. Client uploads image → converted to base64 in browser
2. POST to `/api/generate` with base64 image + room type + theme
3. API validates: auth → rate limit (Redis) → credit balance (Supabase)
4. Sends to OpenRouter with Google Gemini Vision model
5. OpenRouter returns generated image(s) as base64 (30-60 seconds)
6. Deducts 1 credit atomically from user balance
7. Returns result to client immediately
8. **Privacy**: Images processed in-memory only, NEVER stored

**Credit Purchase Flow**:
1. Client clicks "Buy Credits" → POST to `/api/checkout`
2. Creates Stripe checkout session with price ID
3. User completes payment on Stripe
4. Stripe webhook (`/api/webhooks/stripe`) confirms payment
5. Credits added to user account in Supabase
6. User redirected to success page

**User Creation Flow**:
1. User signs up via Clerk
2. Clerk webhook (`/api/webhooks/clerk`) fires on `user.created`
3. Creates user record in Supabase with 1 free credit
4. Links Clerk user ID to Supabase user ID

### Database Schema

**users table** (Supabase):
- `id` (uuid, primary key)
- `clerk_user_id` (text, unique) — links to Clerk
- `email` (text)
- `credits` (integer, default 1)
- `created_at`, `updated_at` (timestamps)

**generations table** — REMOVED in migration 003
- Generations are NOT persisted (privacy-first design)
- No history tracking in database

### Key API Routes

| Route | Method | Purpose | Auth | Rate Limited |
|-------|--------|---------|------|--------------|
| `/api/generate` | POST | Generate design (synchronous) | Required | Yes (100/hr) |
| `/api/checkout` | POST | Create Stripe checkout | Required | No |
| `/api/webhooks/clerk` | POST | User creation webhook | Webhook signature | No |
| `/api/webhooks/stripe` | POST | Payment confirmation | Webhook signature | No |
| `/api/user` | GET | Get current user data | Required | No |

### File Structure Conventions

```
app/
├── api/                      # API routes
│   ├── generate/             # AI generation endpoint
│   ├── checkout/             # Stripe checkout
│   ├── webhooks/             # External service webhooks
│   └── user/                 # User data endpoints
├── generate/                 # Main generation page
├── pricing/                  # Pricing page
└── layout.tsx                # Root layout with Clerk provider

components/
├── ui/                       # shadcn/ui components (DO NOT EDIT)
├── generate-content.tsx      # Main generation UI logic
├── results-viewer.tsx        # Before/after comparison
├── header.tsx                # Navigation with credit display
└── pricing-content.tsx       # Pricing cards

lib/
├── supabase.ts              # Database client + user CRUD
├── openrouter.ts            # AI model integration
├── stripe.ts                # Payment processing
├── redis.ts                 # Rate limiting logic
├── constants.ts             # App-wide constants
└── logger.ts                # Pino logger instance

stores/
├── user-store.ts            # Zustand: credits, userId
└── generation-store.ts      # Zustand: generation state

supabase/
└── migrations/              # Database schema versions
    ├── 001_initial_schema.sql
    ├── 002_add_user_metadata.sql
    └── 003_drop_generations_table.sql
```

## Code Style Guidelines (from .cursor/rules/)

### TypeScript Standards
- **NO `any` types** — use explicit types or `unknown` + type guards
- **Strict mode required** — all code must pass TypeScript strict checks
- **Zod validation** — use for all API request bodies and external data
- **Absolute imports** — use `@/*` path alias, never relative imports

### Naming Conventions
- Components: `PascalCase` (e.g., `RoomUploader`)
- Functions: `camelCase` (e.g., `generateDesign`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_IMAGE_SIZE`)
- Files: `kebab-case` for utils (e.g., `prompt-builder.ts`)
- Interfaces: `PascalCase` with `I` prefix (e.g., `IDesignOptions`)

### API Route Pattern
```typescript
// 1. Zod schema at top
const RequestSchema = z.object({
  imageUrl: z.string().url(),
  theme: z.enum(['modern', 'minimalist']),
});

export async function POST(request: Request) {
  // 2. Validate auth
  const { userId } = auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // 3. Validate input
  const body = await request.json();
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  // 4. Business logic
  // ...

  return Response.json({ success: true });
}
```

### Component Structure
```typescript
// 1. Imports (external → internal)
import React from "react";
import { useStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";

// 2. Type definitions
interface Props {
  onComplete?: () => void;
}

// 3. Component
export const MyComponent: React.FC<Props> = ({ onComplete }) => {
  // hooks, state, handlers
  return <div>...</div>;
};
```

### Styling Standards
- **Tailwind first** — prefer utility classes over custom CSS
- **Dark mode** — always include `dark:` variants
- **Purple theme** — primary color `#8B5CF6` (CSS variable `--primary`)
- **Responsive** — mobile-first (`sm:`, `md:`, `lg:`)

### Error Handling
- User-facing errors must have friendly messages
- Use structured logging with Pino (never `console.log`)
- API errors return proper HTTP status codes (400, 401, 403, 429, 500)
- Generation failures trigger automatic credit refunds

## Critical Implementation Notes

### Authentication
- Clerk middleware runs on ALL routes except `/`, `/pricing`, public assets
- Use `auth()` from `@clerk/nextjs` in API routes
- Webhooks validate signatures (Clerk: Svix, Stripe: stripe.webhooks.constructEvent)

### Credit System
- Credits are atomic operations in Supabase (prevent race conditions)
- Each generation costs 1 credit (deducted BEFORE AI call)
- Failed generations must refund credits immediately
- Credits never expire

### Rate Limiting
- Implemented in `lib/redis.ts` using Upstash Redis
- 100 generations per hour per user ID
- Returns 429 status if exceeded
- Key format: `ratelimit:generate:{userId}`

### Privacy Guarantees
- Images are base64-encoded client-side
- Sent to OpenRouter API in-memory only
- NEVER written to disk or Supabase Storage
- No generation history stored (table dropped in migration 003)

### OpenRouter Integration
- Standard model: `google/gemini-2.5-flash-image`
- Premium model: `google/gemini-3-pro-image-preview`
- Synchronous calls (30-60 second response time)
- Returns base64 data URLs for generated images
- See `lib/openrouter.ts` for prompt construction

### Stripe Integration
- Test mode: Use `STRIPE_SECRET_KEY` starting with `sk_test_`
- Live mode: Use `sk_live_` keys
- Webhook endpoint must be registered in Stripe dashboard
- Price IDs configured in environment variables
- Always verify webhook signatures

## Environment Variables

Required variables (see `.env.example` for full list):
```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://*.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
SUPABASE_ANON_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://*.upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing

- Tests live in `tests/` directory
- Use Vitest with jsdom environment
- Mock external services (Supabase, OpenRouter, Stripe, Redis)
- Test utilities in `lib/test-utils.ts`
- Coverage should be >80% for new code
- Run `pnpm test:coverage` to check coverage

## Deployment

**Vercel (recommended)**:
1. Push to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy automatically on push to main

**Production checklist**:
- [ ] Configure production environment variables
- [ ] Set up Supabase connection pooling
- [ ] Configure Clerk production instance + webhooks
- [ ] Enable Stripe live mode + register webhook endpoints
- [ ] Set up Upstash Redis production instance
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Test all payment flows end-to-end

## AI Persona (from .cursor/rules/tech-lead.mdc)

When working in this codebase:
- Act as a Staff Engineer expert in React, Next.js, TypeScript
- Give concise, thoughtful answers; prioritize correctness
- Think step-by-step before coding; outline plans
- Ship complete solutions — no TODOs or placeholders
- Say "don't know" instead of guessing
- **Never install new dependencies without explicit approval**

## Common Tasks

**Adding a new design theme**:
1. Add theme enum to Zod schema in `/api/generate/route.ts`
2. Update theme selector in `components/generate-content.tsx`
3. Update prompt builder in `lib/openrouter.ts`

**Modifying credit packages**:
1. Update Stripe products/prices in dashboard
2. Update price IDs in `.env.local`
3. Update pricing display in `components/pricing-content.tsx`

**Database schema changes**:
1. Create new migration file in `supabase/migrations/`
2. Name format: `00X_description.sql`
3. Test locally before applying to production
4. Update TypeScript types to match schema

**Running single test**:
```bash
pnpm test -- tests/specific-file.test.ts
```

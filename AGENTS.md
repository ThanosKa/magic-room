# Magic Room - AI Interior Design Assistant

## Tech Stack Overview

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: Zustand (user credits, generation status)
- **Database**: Supabase PostgreSQL
- **Authentication**: Clerk
- **AI Model**: OpenRouter (google/gemini-3.1-flash-image)
- **Payments**: Stripe (checkout + webhooks)
- **Rate Limiting**: Upstash Redis
- **Hosting**: Vercel (Next.js API routes)

## Data Flow

1. **Upload Phase**: User selects room image → converted to base64 client-side
2. **Design Configuration**: User selects room type, theme, optional custom prompt
3. **Processing Phase**:
   - API validates auth + rate limits + credits
   - Calls OpenRouter with base64 image + prompt (synchronous)
   - Deducts 1 credit from user balance
4. **Generation Phase**: OpenRouter processes image → returns results immediately (no polling)
5. **Results Display**: Frontend displays the generated redesign (one image per run)
6. **Privacy**: Images processed in-memory only, never stored

## Key API Endpoints

| Endpoint               | Method | Purpose                        |
| ---------------------- | ------ | ------------------------------ |
| `/api/generate`        | POST   | Generate design (synchronous)  |
| `/api/generate/[id]`   | GET    | Get cached generation status   |
| `/api/checkout`        | POST   | Create Stripe checkout session |
| `/api/webhooks/clerk`  | POST   | Sync user creation to Supabase |
| `/api/webhooks/stripe` | POST   | Credit purchase confirmation   |

## Privacy Guarantees

- **No Image Storage**: Images are sent as base64, processed in-memory only
- **Ephemeral Processing**: No bucket uploads, images never touch servers
- **Secure Transit**: All data transmitted over encrypted HTTPS
- **User Data**: Only email + credit balance retained
- **No Training**: Your images are not used to train AI models

## Design Model Details

**Model**: `google/gemini-3.1-flash-image` via OpenRouter

- **Speed**: Synchronous response (~30-60 seconds)
- **Quality**: Google Gemini multimodal output
- **Input**: Base64 image + text prompt
- **Output**: Generated image(s) as base64 data URLs
- **Provider**: OpenRouter API

## Core User Flows

### Sign Up & Free Trial

1. User clicks "Sign Up" → Clerk OAuth
2. Webhook syncs user to Supabase with 1 free credit
3. User redirected to `/generate` page

### Design Generation

1. Select image via drag-and-drop (converted to base64)
2. Select room type + design theme
3. Optional: Add custom details in prompt box
4. Click "Generate Designs" (requires ≥1 credit)
5. Wait 30-60 seconds for AI processing
6. Results display with before/after slider

### Credit Purchase

1. Click "Buy Credits" in header
2. Select package (Starter/Pro/Ultimate)
3. Stripe checkout → redirect to success page
4. Webhook confirms payment → adds credits to account

## Rate Limiting

- **All Users**: 100 generations per hour (abuse prevention)
- **Enforcement**: Upstash Redis key-value store (per user ID)
- **Response**: 429 Too Many Requests if exceeded

## Error Handling

- Invalid image format → User-friendly toast
- Insufficient credits → Prompt to purchase
- Rate limit exceeded → Backoff with retry suggestion
- Generation failure → Automatic credit refund + error notification
- Network timeout → Error notification

## Design System

- The look is defined once in `app/globals.css` (tokens mapped into Tailwind) and `app/motion.css` (keyframes, reveal-on-scroll, compare slider). Use the token utilities: `bg-paper`, `bg-paper-2`, `text-ink`, `text-ink-2`, `text-ink-3`, `border-line`, `bg-night`, `text-cream`, `text-cream-2`, `accent` (purple), plus the shadcn names (`bg-background`, `text-muted-foreground`, `border-border`, ...). Headlines: `font-serif` (Instrument Serif); body stays Geist (`font-sans`).
- No raw `slate-*` / `gray-*` / `purple-*` classes and no `dark:` classes. The site has one light theme.
- Purple (`accent`) is for small accents only: focus ring, dots, credit pill, timers, small highlights. Primary buttons are ink (`<Button>`); on night bands use `<Button variant="cream">`.
- Interaction rules: hover styles only apply on `(hover: hover) and (pointer: fine)` (built into Tailwind's `hover:` here), buttons and pressable cards scale on `:active` (`active:scale-[0.97]`), every interactive element keeps a visible focus ring, and every animation has a `prefers-reduced-motion` fallback (`motion-reduce:`).

### Animation rule

CSS by default; Motion (the `motion` / framer-motion library) only where CSS can't do it well: drag or swipe with physics (springs, momentum, snap back), exit animations (an element that must animate before it is removed), layout animations (items sliding to new positions when a list reorders or filters), and shared-element transitions (a thumbnail growing into full screen). Everything else (hover, press, fades, scroll reveals, menus and dialogs opening, image wipes, spinners) is CSS.

## Code Style & Stack

- See `.cursor/rules/general.mdc` for full coding conventions

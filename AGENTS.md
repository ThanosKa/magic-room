# Magic Room - AI Interior Design Assistant

## Tech Stack Overview

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: Zustand (user credits, generation status)
- **Database**: Supabase PostgreSQL + Storage
- **Authentication**: Clerk (Google OAuth)
- **AI Model**: Replicate (rocketdigitalai/interior-design-sdxl-lightning)
- **Payments**: Stripe (checkout + webhooks)
- **Rate Limiting**: Upstash Redis
- **Hosting**: Vercel (Next.js API routes, Edge Functions)

## Data Flow

1. **Upload Phase**: User uploads room image → Supabase Storage (`room-images` bucket)
2. **Design Configuration**: User selects room type, theme, optional custom prompt
3. **Processing Phase**:
   - API validates auth + rate limits + credits
   - Calls Replicate with dynamic prompt
   - Deducts 1 credit from user balance
4. **Generation Phase**: Replicate processes image → sends webhook when complete
5. **Results Display**: Frontend polls status → displays 4-8 design variations
6. **Privacy Cleanup**: Original image auto-deleted from Storage (2hr lifecycle)

## Key API Endpoints

| Endpoint                  | Method | Purpose                        |
| ------------------------- | ------ | ------------------------------ |
| `/api/generate`           | POST   | Start new generation job       |
| `/api/generate/[id]`      | GET    | Poll generation status         |
| `/api/checkout`           | POST   | Create Stripe checkout session |
| `/api/webhooks/clerk`     | POST   | Sync user creation to Supabase |
| `/api/webhooks/stripe`    | POST   | Credit purchase confirmation   |
| `/api/webhooks/replicate` | POST   | Generation completion/failure  |

## Privacy Guarantees

- **Ephemeral Processing**: Uploaded images stored max 2 hours
- **Automatic Cleanup**: Storage lifecycle policy + webhook-triggered deletion
- **Replicate Output**: URLs expire after 48 hours (Replicate default)
- **User Data**: Only email + credit balance retained post-generation
- **No Logs**: Processing metadata deleted after webhook confirmation

## Design Model Details

**Model**: `rocketdigitalai/interior-design-sdxl-lightning`

- **Speed**: ~30-60 seconds per generation (lightning variant)
- **Variations**: Generates 4-8 unique design variations per prompt
- **Quality**: SDXL-based photorealistic output
- **Layout Preservation**: Built-in ControlNet maintains room structure
- **Input**: Room image + text prompt
- **Output**: 4-8 PNG/JPEG URLs (public, 48hr expiry)

## Core User Flows

### Sign Up & Free Trial

1. User clicks "Sign Up" → Clerk OAuth
2. Webhook syncs user to Supabase with 1 free credit
3. User redirected to `/generate` page

### Design Generation

1. Upload image (10MB max) via drag-and-drop
2. Select room type + design theme
3. Optional: Add custom details in prompt box
4. Click "Generate Designs" (requires ≥1 credit)
5. Real-time polling shows generation progress
6. Results display with before/after slider + grid

### Credit Purchase

1. Click "Buy Credits" in header
2. Select package (Starter/Pro/Ultimate)
3. Stripe checkout → redirect to success page
4. Webhook confirms payment → adds credits to account

## Rate Limiting

- **Free Users**: 5 generations per hour
- **Paid Users**: 50 generations per hour
- **Enforcement**: Upstash Redis key-value store (per IP + user ID)
- **Response**: 429 Too Many Requests if exceeded

## Error Handling

- Invalid image format → User-friendly toast
- Insufficient credits → Prompt to purchase
- Rate limit exceeded → Backoff with retry suggestion
- Generation failure → Refund credit + error notification
- Network timeout → Retry with exponential backoff

## File Structure

```
app/
  layout.tsx           # Root layout with providers
  page.tsx             # Landing page
  generate/
    page.tsx           # Generation interface
  purchase/
    page.tsx           # Credits store
  api/
    generate/
      route.ts         # Start generation
      [id]/route.ts    # Poll status
    checkout/
      route.ts         # Stripe checkout
    webhooks/
      clerk/route.ts   # User sync
      stripe/route.ts  # Payment confirmation
      replicate/route.ts # Generation updates
components/
  room-uploader.tsx    # Upload + crop component
  design-options.tsx   # Room type/theme selector
  results-viewer.tsx   # Before/after + grid display
  credits-badge.tsx    # Header credits counter
  theme-provider.tsx   # Light/dark mode
  header.tsx           # Navigation
  footer.tsx           # Links & attribution
lib/
  supabase.ts          # Server-side client
  supabase-client.ts   # Client-side client
  replicate.ts         # API wrapper
  redis.ts             # Rate limiter
  stripe.ts            # Checkout session
  prompt-builder.ts    # Dynamic prompt generation
  constants.ts         # Room types, themes, packages
stores/
  user-store.ts        # Zustand: credits, user info
  generation-store.ts  # Zustand: active generation state
types/
  index.ts             # TypeScript interfaces
```

---

**Last Updated**: December 2025
**Target Completion**: Full stack privacy-first SaaS within 2-week sprint

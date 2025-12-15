# Magic Room - AI Interior Design Assistant

## Tech Stack Overview

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: Zustand (user credits, generation status)
- **Database**: Supabase PostgreSQL
- **Authentication**: Clerk
- **AI Model**: OpenRouter (google/gemini-2.5-flash-image)
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
5. **Results Display**: Frontend displays generated design variations
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

**Model**: `google/gemini-2.5-flash-image` via OpenRouter

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

## Code Style & Stack

- See `.cursor/rules/general.mdc` for full coding conventions

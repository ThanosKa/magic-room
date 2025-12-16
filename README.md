# Magic Room - AI Interior Design Generator

A privacy-first, AI-powered interior design web application that transforms room photos into beautiful design variations in seconds. Upload a photo, select your style preferences, and get unique design options instantly.

## Features

- **AI-Powered Design Generation** - Uses Google Gemini AI for stunning results
- **Privacy First** - Images processed in-memory only, never stored
- **Fast Generation** - Get design variations in 30-60 seconds
- **Flexible Credits System** - Buy what you need, use anytime
- **Light Theme** - Beautiful purple-themed UI
- **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 16+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui, Framer Motion
- **Authentication**: Clerk (Google OAuth)
- **Database**: Supabase (PostgreSQL)
- **AI Generation**: OpenRouter (google/gemini-2.5-flash-image)
- **Payments**: Stripe (credit packages)
- **Rate Limiting**: Upstash Redis
- **State Management**: Zustand
- **Validation**: Zod
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ (we recommend using `nvm`)
- pnpm (install with `npm install -g pnpm`)
- Accounts for:
  - [Clerk](https://dashboard.clerk.com)
  - [Supabase](https://supabase.com)
  - [OpenRouter](https://openrouter.ai)
  - [Stripe](https://dashboard.stripe.com)
  - [Upstash](https://upstash.com)

### Setup Instructions

1. **Clone and install dependencies**

```bash
git clone <repository-url>
cd magic-room
pnpm install
```

2. **Set up environment variables**

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

- **Clerk**

  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Public key from Clerk dashboard
  - `CLERK_SECRET_KEY` - Secret key from Clerk dashboard
  - `CLERK_WEBHOOK_SECRET` - From Clerk webhooks page

- **Supabase**

  - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon/public key
  - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep secret!)

- **OpenRouter**

  - `OPENROUTER_API_KEY` - Your API key from https://openrouter.ai/settings/keys

- **Stripe**

  - `STRIPE_SECRET_KEY` - Secret API key
  - `STRIPE_WEBHOOK_SECRET` - Signing secret for webhooks
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Publishable key

- **Upstash Redis**

  - `UPSTASH_REDIS_REST_URL` - REST endpoint
  - `UPSTASH_REDIS_REST_TOKEN` - Authentication token

- **App Config**
  - `NEXT_PUBLIC_APP_URL` - App URL (http://localhost:3000 for local dev)

3. **Set up Supabase**

Create the database schema:

```bash
# In Supabase dashboard, run the SQL from supabase/migrations/001_initial_schema.sql
# Then seed the credit packages data from supabase/seed.sql
```

4. **Configure Webhooks**

- **Clerk**: Point to `https://yourdomain.com/api/webhooks/clerk`
- **Stripe**: Point to `https://yourdomain.com/api/webhooks/stripe`

For local development, use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks.

5. **Start development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Commands

```bash
# Start dev server with hot reload
pnpm dev

# Type checking
pnpm type-check

# Linting
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
magic-room/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes and webhooks
│   ├── generate/             # Design generation page
│   ├── purchase/             # Credit purchase page
│   ├── privacy/              # Privacy policy
│   ├── terms/                # Terms of service
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── header.tsx            # Navigation header
│   ├── footer.tsx            # Footer
│   ├── auth-guard.tsx        # Protected route wrapper
│   ├── room-uploader.tsx     # Image selection (base64)
│   ├── design-options.tsx    # Style selector
│   ├── results-viewer.tsx    # Results display
│   └── generation-loading.tsx # Loading states
├── lib/                      # Utility functions
│   ├── supabase.ts           # Server-side Supabase
│   ├── supabase-client.ts    # Client-side utilities
│   ├── openrouter.ts         # OpenRouter AI client
│   ├── redis.ts              # Rate limiting
│   ├── stripe.ts             # Stripe client
│   ├── constants.ts          # App constants
│   └── utils.ts              # Helper functions
├── stores/                   # Zustand state management
│   ├── user-store.ts         # User state (credits, auth)
│   └── generation-store.ts   # Generation state
├── types/                    # TypeScript types
│   └── index.ts              # All type definitions
├── supabase/                 # Database scripts
│   ├── migrations/           # Database migrations
│   └── seed.sql              # Seed data
├── components.json           # shadcn/ui config
├── tsconfig.json             # TypeScript config
├── next.config.ts            # Next.js config
└── package.json              # Dependencies
```

## How It Works

1. **User Signs Up** - Google OAuth via Clerk, receives 1 free credit
2. **Selects Room Photo** - Drag-and-drop, converted to base64 locally
3. **Selects Design Preferences** - Room type, theme, optional custom prompt
4. **Generates Designs** - 1 credit deducted, image sent to OpenRouter/Gemini AI
5. **Views Results** - Design variation(s) displayed instantly
6. **Downloads or Generates Again** - Full-res images available for download
7. **Privacy Preserved** - Images never stored, processed in-memory only

## Credit Packages

- **Free Trial**: 1 credit (on first signup)
- **Starter Pack**: 30 credits for $9.99
- **Pro Pack**: 150 credits for $19.99
- **Ultimate Pack**: 300 credits for $29.99

Each generation uses 1 credit.

## Privacy & Security

- Images never stored (processed in-memory as base64)
- No personal data collection beyond what Clerk stores
- Rate limiting prevents abuse
- Stripe never has access to uploaded images
- Clerk/Stripe webhooks signature-verified

See [Privacy Policy](/privacy) and [Terms of Service](/terms) for details.

## Rate Limiting

- All users: 100 generations per hour (abuse prevention)
- Rate limits reset using Upstash Redis with 1-hour windows.

## Error Handling

- User-friendly error messages for all failures
- Automatic credit refunds on generation failures
- Global error boundary with recovery options

## Testing Checklist

Before deploying:

- [ ] Auth flow works (sign up → free credit awarded)
- [ ] Image upload and preview works
- [ ] Generation completes with OpenRouter
- [ ] Results display after generation completes
- [ ] Download works for variations
- [ ] Credit packages appear on purchase page
- [ ] Stripe checkout flow completes
- [ ] Credits added after purchase
- [ ] Rate limiting prevents abuse

## Deployment

### Vercel (Recommended)

```bash
vercel
```

Set environment variables in Vercel dashboard.

### Other Platforms

Ensure:

- Node 18+ support
- Environment variables configured
- Webhooks point to production URLs
- Supabase in production mode
- Stripe in live mode (for production)

## Troubleshooting

**"Missing publishableKey" error**

- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in `.env.local`

**"Rate limit exceeded"**

- Wait 1 hour for Redis window to reset
- Check Redis URL and token in `.env.local`

**Stripe webhook not firing**

- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Verify webhook signing secret matches `STRIPE_WEBHOOK_SECRET`

**OpenRouter generation failing**

- Verify `OPENROUTER_API_KEY` is set correctly
- Check OpenRouter dashboard for API errors
- Ensure your account has credits

## License

MIT

## Support

- Email: kazakis.th@gmail.com
- Issues: GitHub Issues
- Discord: [link placeholder]

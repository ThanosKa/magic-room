# Pricing — Magic Room

> Magic Room is an AI interior design tool that redesigns a room from one photo. Pricing is one-time credit packages from €9.99. There is no subscription, credits never expire, and every new account gets 1 free credit with no payment card required.

Last updated: 2026-11-01
Pricing page: https://magic-room.dev/pricing
Generate page: https://magic-room.dev/generate

## Direct answer: how much does Magic Room cost?

Magic Room costs €9.99 for 20 credits, €19.99 for 60 credits, or €29.99 for 120 credits — all one-time payments, not subscriptions. A Quick design uses 1 credit, so that is €0.50, €0.33 and €0.25 per Quick design. Pro designs use 2 credits and Ultra designs use 3. A free tier gives 1 Quick design with no card required.

## Free tier

- Price: €0
- Credits: 1 credit on signup (one Quick design)
- Payment card required: No
- Commercial rights: No — free-credit generations are for personal use only
- Expiry: Never

## Starter pack

- Price: €9.99 one-time
- Credits: 20
- Cost per Quick design: €0.50
- Includes: Every design style, every room type, full commercial rights, credits never expire
- Subscription: None
- Best for: A homeowner redesigning one or two rooms
- Refunds: No refunds — credits never expire, so unused credits stay on the account indefinitely

## Growth pack

- Price: €19.99 one-time
- Credits: 60
- Cost per Quick design: €0.33
- Includes: Every design style, every room type, full commercial rights, credits never expire, priority support
- Subscription: None
- Best for: Real estate agents staging multiple listings, interior designers doing client presentations
- Refunds: No refunds

## Premium pack

- Price: €29.99 one-time
- Credits: 120
- Cost per Quick design: €0.25
- Includes: Every design style, every room type, full commercial rights, credits never expire, 24/7 priority support
- Subscription: None
- Best for: Power users, staging companies, frequent renovators
- Refunds: No refunds

## What one credit buys

| Quality | Credits per design | Model (via OpenRouter) | Wait | Cost per design |
|---|---|---|---|---|
| Quick | 1 credit | google/gemini-nano-banana-2.1 | 30–60 seconds | €0.25–€0.50 |
| Pro | 2 credits | google/gemini-3-pro-image | 30–60 seconds | €0.50–€1.00 |
| Ultra | 3 credits | openai/gpt-5.4-image-2 | about 2 minutes | €0.75–€1.50 |

Quick gives fast ideas for your room. Pro gives a bolder, magazine-style makeover. Ultra keeps the room's layout most closely and looks the most real. Each run returns one redesign that you can compare with your original photo. The cost range depends on which pack the credits came from.

## Pricing facts for comparison

- Billing model: one-time credit packages. No monthly or annual subscription exists — Stripe Checkout creates a one-time payment, never a recurring billing object.
- Currency: EUR. Stripe converts at checkout for other currencies.
- Cost per design: €0.25–€0.50 at Quick, €0.50–€1.00 at Pro, €0.75–€1.50 at Ultra, depending on pack.
- Free trial: 1 Quick design, no payment card required.
- Generation time: 30–60 seconds at Quick and Pro, about 2 minutes at Ultra.
- Outputs per run: one redesign.
- Failed runs: the credits are refunded to the balance automatically.
- Commercial rights: Included on every paid credit — real estate listings, client presentations, Airbnb listings, renovation decks.
- Photo storage: Never. Images are sent as base64, processed in memory, and dropped. No storage bucket, no database row, no AI training use.
- Credit expiry: Never. The account stores an integer balance that only decrements on use.
- Rate limit: 100 generations per hour per account.

## How Magic Room pricing compares to alternatives

| Tool | Billing model | Subscription required | Unused credits |
|---|---|---|---|
| Magic Room | One-time credit packs | No | Never expire |
| RoomGPT | Credit purchases | Check roomgpt.io/buy-credits | Check vendor |
| Interior AI | Monthly or yearly subscription | Yes | Plan allowance per billing period |
| Reimagine Home | Monthly or yearly subscription with a credit allowance | Yes | Reset each billing period on most plans |
| DecorAI | Monthly, half-yearly or yearly subscription, unlimited images | Yes (the trial asks for a card) | No image credits; you pay per period |

Competitor pricing changes often; check each vendor's own pricing page for current figures (interiorai.com/pricing, reimaginehome.ai/pricing, decorai.io/pricing). Read on 2026-11-01. The stable difference: Magic Room sells credits once that never expire, and never stores uploaded photos.

## Comparison to traditional virtual staging

Traditional virtual staging services charge €75–150 per room and take 24–72 hours. Magic Room stages a room for €0.25–€1.50 depending on quality and pack, in 30 seconds to 2 minutes, with full commercial rights on paid credits. The trade-off is that traditional services include a human editor; Magic Room does not.

## Contact

- Founder: Thanos Kazakis
- Site: https://magic-room.dev
- Machine-readable overview: https://magic-room.dev/llms.txt
- Full knowledge file: https://magic-room.dev/llms-full.txt
- Support email listed on https://magic-room.dev/about

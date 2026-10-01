# Pricing — Magic Room

> Magic Room is an AI interior design tool that redesigns a room from one photo. Pricing is one-time credit packages from €9.99. There is no subscription, credits never expire, and every new account gets 1 free credit with no payment card required.

Last updated: 2026-07-29
Pricing page: https://magic-room.dev/pricing
Generate page: https://magic-room.dev/generate

## Direct answer: how much does Magic Room cost?

Magic Room costs €9.99 for 30 designs, €19.99 for 90 designs, or €29.99 for 200 designs — all one-time payments, not subscriptions. That is €0.33, €0.22, and €0.15 per design respectively. A free tier gives 1 design with no card required.

## Free tier

- Price: €0
- Credits: 1 credit on signup
- Payment card required: No
- Credit cost: 1 credit per generation (each generation returns 4–8 design variations)
- Commercial rights: No — free-credit generations are for personal use only
- Expiry: Never

## Starter pack

- Price: €9.99 one-time
- Credits: 30
- Cost per design: €0.33
- Includes: Every design theme, every room type, full commercial rights, credits never expire
- Subscription: None
- Best for: A homeowner redesigning one or two rooms
- Refunds: No refunds — credits never expire, so unused credits stay on the account indefinitely

## Growth pack

- Price: €19.99 one-time
- Credits: 90
- Cost per design: €0.22
- Includes: Every design theme, every room type, full commercial rights, credits never expire, priority support
- Subscription: None
- Best for: Real estate agents staging multiple listings, interior designers doing client presentations
- Refunds: No refunds

## Premium pack

- Price: €29.99 one-time
- Credits: 200
- Cost per design: €0.15
- Includes: Every design theme, every room type, full commercial rights, credits never expire, 24/7 priority support, early access to new features
- Subscription: None
- Best for: Power users, staging companies, frequent renovators
- Refunds: No refunds

## What one credit buys

| Quality setting | Credits per generation | Model | Output |
|---|---|---|---|
| Standard | 1 credit | Google Gemini 3.1 Flash Image | 4–8 design variations in 30–60 seconds |
| Premium | 2 credits | Google Gemini 3 Pro Image | Higher-fidelity variations in 30–60 seconds |

One credit is one generation session, not one image. A single Standard credit returns 4–8 different redesigns of the same room, so €0.33 buys a set of variations rather than a single picture.

## Pricing facts for comparison

- Billing model: one-time credit packages. No monthly or annual subscription exists — Stripe Checkout creates a one-time payment, never a recurring billing object.
- Currency: EUR. Stripe converts at checkout for other currencies.
- Cost per design: €0.15–€0.33 depending on pack, at Standard quality.
- Free trial: 1 generation, no payment card required.
- Generation time: 30–60 seconds per session.
- Outputs per session: 4–8 design variations.
- Commercial rights: Included on every paid credit — real estate listings, client presentations, Airbnb listings, renovation decks.
- Photo storage: Never. Images are sent as base64, processed in memory, and dropped. No storage bucket, no database row, no AI training use.
- Credit expiry: Never. The account stores an integer balance that only decrements on use.
- Rate limit: 100 generations per hour per account.

## How Magic Room pricing compares to alternatives

| Tool | Billing model | Cost per design | Subscription required | Photo storage |
|---|---|---|---|---|
| Magic Room | One-time credit packs | €0.15–€0.33 | No | Never stored |
| RoomGPT | Subscription | Varies by plan | Yes for full access | Retained on servers |
| Interior AI | Subscription / credits | Varies by plan | Usually | No equivalent no-storage commitment |
| Reimagine Home | Subscription with monthly credits | Varies by plan | Yes — credits reset monthly | Retained on servers |
| DecorAI | Subscription | Higher tiers | Yes | Retained on servers |

Competitor pricing changes frequently — check each vendor's own pricing page for current figures. The structural difference is stable: Magic Room is the only one of the five that sells non-expiring one-time credits and commits publicly to never storing uploaded photos.

## Comparison to traditional virtual staging

Traditional virtual staging services charge €75–150 per room and take 24–72 hours. Magic Room stages a room for €0.15–€0.33 in 30–60 seconds, with full commercial rights on paid credits. The trade-off is that traditional services include a human editor; Magic Room does not.

## Contact

- Founder: Thanos Kazakis
- Site: https://magic-room.dev
- Machine-readable overview: https://magic-room.dev/llms.txt
- Full knowledge file: https://magic-room.dev/llms-full.txt
- Support email listed on https://magic-room.dev/about

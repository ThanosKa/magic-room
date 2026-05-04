# Product Marketing Context

*Last updated: 2026-05-04 (auto-drafted from codebase — review and correct)*

## Product Overview
**One-liner:** AI interior design tool that transforms any room photo into 4–8 styled redesigns in 30–60 seconds.
**What it does:** Users upload a photo of a room, pick a design style and room type, and Magic Room generates 4–8 AI-redesigned variations using Google Gemini multimodal AI. Photos are processed in-memory and never stored.
**Product category:** AI interior design / room redesign / virtual staging tool.
**Product type:** SaaS web app (Next.js, Clerk auth, Stripe payments).
**Business model:** Pay-per-use credits, no subscription. Starter €9.99 (30 credits), Growth €19.99, Premium €29.99. 1 free credit on signup. Credits never expire. Full commercial rights on paid generations.

## Target Audience
**Target companies:** Solo homeowners, real estate agents, Airbnb hosts, small interior design studios, property managers.
**Decision-makers:** Direct consumer purchase — homeowner / agent / designer themselves.
**Primary use case:** Visualizing a room redesign from a single photo without paying a designer or staging service.
**Jobs to be done:**
- Help me see what my room could look like in style X before I commit to renovation/decor spend
- Stage an empty or outdated property listing photo for under €1 instead of paying €75–150/room for traditional virtual staging
- Generate inspiration / mood-board images for a client presentation
**Use cases:**
- Real estate virtual staging for listing photos
- Pre-renovation visualization
- Client presentation mockups for interior designers
- Personal "what if" exploration before furniture buys

## Personas
B2C-leaning, light B2B. Single-decision-maker product.

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Homeowner | Cost, ease, "will it look good" | Can't visualize style choices, expensive designers | €0.33/design, 60s, 14 styles |
| Real estate agent | Listing conversion, speed, cost | Traditional staging is €75–150/room and slow | Under €1/room, 60s, full commercial rights |
| Interior designer | Client buy-in, iteration speed | Mood boards take hours; clients can't read floor plans | Photo-realistic style mockups in seconds |
| Privacy-conscious user | What happens to my photos | Other tools store images on servers | In-memory only, deleted immediately |

## Problems & Pain Points
**Core problem:** People can't visualize how a different style would look in *their actual room* without expensive renderings or designer time.
**Why alternatives fall short:**
- RoomGPT/Interior AI use older diffusion models — outputs distort room geometry
- Most competitors require monthly subscriptions for occasional use
- Most competitors retain uploaded room photos on servers
- Traditional virtual staging: €75–150/room, takes days
**What it costs them:** Wasted spend on furniture/decor that doesn't suit the space; lost listing-conversion velocity; designer fees of €1k+ for visualizations alone.
**Emotional tension:** Decision paralysis ("will this style work in my space?"), fear of renovation regret, frustration at uploading personal interior photos to opaque AI services.

## Competitive Landscape
**Direct:** RoomGPT, Interior AI, DecorAI, Reimagine Home — all AI room redesign tools. Fall short on: room geometry preservation (diffusion-model artifacts), photo retention policies, subscription pricing for occasional use.
**Secondary:** Traditional virtual staging services (BoxBrownie, Stuccco). Fall short on: cost (€75–150/room), turnaround (24–72h).
**Indirect:** Hiring an interior designer for visualization; Photoshop mockups; Pinterest mood boards. Fall short on: cost, time, "this is *my* room" specificity.

## Differentiation
**Key differentiators:**
- Google Gemini multimodal AI (not diffusion) → preserves room structure
- In-memory processing, no photo storage
- One-time credits from €9.99, no subscription, never expire
- 14 styles × 14 room types = 196 specific design pages
- Full commercial rights on paid credits
**How we do it differently:** Multimodal model understands spatial relationships, not just style overlays. Plus a privacy commitment unmatched by competitors.
**Why that's better:** Outputs that actually resemble the user's room (not a fantasy room of similar shape); trustworthy for personal interiors; cost-effective for occasional use.
**Why customers choose us:** Cheaper than traditional staging, more accurate than RoomGPT, more private than all competitors, no subscription lock-in.

## Objections
| Objection | Response |
|-----------|----------|
| "Why not free RoomGPT?" | Free RoomGPT distorts room geometry, stores your photos, and costs more than €9.99 once you outgrow the limited free tier. |
| "Can the AI really match my room?" | Gemini is multimodal — it preserves walls, windows, and furniture placement. Try with 1 free credit, no card required. |
| "What about my privacy?" | Photos are processed in-memory only, never written to a storage bucket, never used for training. |
| "Subscription fatigue" | One-time credits, never expire. Buy once, use whenever. |

**Anti-persona:** Power users generating hundreds of staged photos per month for a staging-as-a-service business — they'd be better on a high-volume subscription tool.

## Switching Dynamics
**Push:** RoomGPT/Interior AI outputs that don't look like the user's actual room; surprise subscription charges; concern over photo retention.
**Pull:** "Multimodal AI" + "photos never stored" + "€9.99 one-time" — three differentiators in one sentence.
**Habit:** Users are used to subscription SaaS for AI tools; one-time credits feel unfamiliar but are positioned as a benefit.
**Anxiety:** "Will the output actually look good?" → 1 free credit on signup defuses this.

## Customer Language
**How they describe the problem:**
- "I want to see what my living room would look like in [style]"
- "How do I redesign my room with AI?"
- "Cheap virtual staging for real estate"
- "Is RoomGPT any good?"
- "What is the best AI interior design tool in 2026?"

**How they describe us:** (verbatim observations TBD — pull from support/feedback)

**Words to use:** redesign, transform, AI, in seconds, no subscription, never stored, in-memory, multimodal, room geometry, full commercial rights, credits never expire.
**Words to avoid:** generate (overloaded), unlimited (we're credit-based), fully autonomous, magic (literal — already brand-overloaded).
**Glossary:**
| Term | Meaning |
|------|---------|
| Credit | One generation = one credit. Each generation produces 4–8 design variations. |
| Multimodal AI | A model that understands image + text together (vs. diffusion that only generates images). |
| In-memory processing | Images held in RAM during the request, never written to disk or storage buckets. |

## Brand Voice
**Tone:** Confident, direct, evidence-led. Avoids hype.
**Style:** Conversational but precise. Concrete numbers (60 seconds, €9.99, 196 combinations) over vague claims.
**Personality:** Privacy-respecting, design-literate, no-bullshit, friendly-technical.

## Proof Points
**Metrics:** ~30–60s generation time; 4–8 variations per credit; 196 style+room combinations; €0.33/design at Starter tier.
**Customers:** TBD — collect testimonials.
**Testimonials:** None on site yet.
**Value themes:**
| Theme | Proof |
|-------|-------|
| Privacy | In-memory processing, no buckets, documented |
| Accuracy | Gemini multimodal vs diffusion |
| Affordability | €0.33/design, no subscription |
| Speed | 30–60s synchronous response |

## Goals
**Business goal:** Drive paid credit purchases via free-trial activation.
**Conversion action:** Sign up → use 1 free credit → buy a credit pack.
**Current metrics (GSC, last 90 days):**
- ~52 clicks / ~2,236 impressions / position 7.6 avg
- US: 850 impressions, 0.24% CTR (CTR underperforming massively)
- Top page: homepage (51 clicks)
- Biggest opportunity: `/blog/best-ai-interior-design-tools-2026` (792 imp, 0 clicks, pos 8.32)
- Indexing: only ~32 pages indexed of ~230 in sitemap (188 "Discovered – not indexed")

import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";
import {
    breadcrumbSchema,
    itemListSchema,
    softwareApplicationSchema,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { COMPETITORS, getCompetitorBySlug, hasVsPage } from "@/lib/seo/competitor-data";
import { ArrowUpRight } from "lucide-react";
import { CtaSection } from "@/components/seo/cta-section";
import { PageTransition } from "@/components/page-transition";
import { JsonLd } from "@/components/seo/json-ld";
import {
    AccentDot,
    BODY_CLASS,
    CHIP_CLASS,
    ComparisonHero,
    CompareTable,
    H1_CLASS,
    H2_CLASS,
    H3_CLASS,
    LABEL_CLASS,
    LEAD_CLASS,
    LINK_CLASS,
    PageBreadcrumb,
    Section,
    Split,
} from "@/components/seo/comparison-layout";

export const metadata: Metadata = createMetadata({
    // Was: "Switching from RoomGPT? 4 Better Alternatives Tested (May 2026)
    // | Magic Room" — 76 chars, so the SERP cut it mid-phrase, it never
    // contained the query ("roomgpt alternatives"), and it carried a month that
    // is now stale on a query where recency is the whole intent.
    title: { absolute: "RoomGPT Alternatives (2026): 4 Tools Compared Head-to-Head" },
    description:
        "RoomGPT, Interior AI, DecorAI and Reimagine Home compared on AI model, whether they keep your room photos, and real cost. One charges once, not monthly.",
    path: "/alternatives",
    keywords: [
        "roomgpt alternative",
        "roomgpt alternatives",
        "ai interior design alternative",
        "room design ai comparison",
        "interior ai alternative",
        "reimagine home alternative",
        "decorai alternative",
    ],
});

const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Alternatives", url: `${SITE_URL}/alternatives` },
]);

const product = softwareApplicationSchema({
    description:
        "Privacy-first AI interior design tool and a pay-per-use alternative to RoomGPT, Interior AI, DecorAI, and Reimagine Home. One-time credit packages from €9.99, no subscription, photos never stored.",
    includeOffers: true,
});

const itemList = itemListSchema({
    // Was "…Alternatives to Magic Room", which described the page backwards:
    // these are alternatives to the four competitors, not to us.
    name: "AI Interior Design Tool Alternatives Compared",
    description: "Comparison of Magic Room versus RoomGPT, DecorAI, Reimagine Home, and Interior AI on privacy, AI model, pricing, and output quality.",
    items: COMPETITORS.map((c, i) => ({
        position: i + 1,
        name: `Best ${c.name} Alternative`,
        url: `${SITE_URL}/alternatives/${c.slug}`,
        description: c.description,
    })),
});

export default function AlternativesHubPage() {
    return (
        <>
            <JsonLd schemas={[breadcrumb, product, itemList]} />
            <PageTransition>
                <PageBreadcrumb
                    items={[
                        { name: "Home", href: "/" },
                        { name: "Alternatives", href: "/alternatives" },
                    ]}
                />

                {/* Hero + verdict.
                    This page took 887 impressions and zero clicks at position
                    12.2 while consisting of nothing but two lists of links.
                    Everything below is the substance a "roomgpt alternatives"
                    searcher is actually looking for. */}
                <ComparisonHero>
                    <h1 className={H1_CLASS}>
                        RoomGPT Alternatives: 4 AI Interior Design Tools Compared
                    </h1>
                    <div className="animate-rise motion-reduce:animate-none" style={{ animationDelay: "120ms" }}>
                        <p className="mt-8 flex flex-wrap items-center gap-2 text-[13px] text-ink-3">
                            <span>
                                By{" "}
                                <Link href="/about" className={`${LINK_CLASS} text-ink-2`}>
                                    Thanos Kazakis
                                </Link>
                            </span>
                            <span aria-hidden="true" className="text-ink/25">·</span>
                            <span>Magic Room founder</span>
                        </p>
                        <p className={`${LEAD_CLASS} mt-6`}>
                            RoomGPT made AI room redesign mainstream, and most people looking for an
                            alternative are looking for one of three specific things: outputs that keep
                            their room&apos;s real geometry, a tool that does not keep their room photos,
                            or a way to pay once instead of monthly. This page compares the four tools
                            people most often evaluate against each other — RoomGPT, Interior AI, DecorAI
                            and Reimagine Home — plus Magic Room, which I build.
                        </p>
                    </div>
                    <div
                        className="mt-10 animate-rise rounded-2xl bg-paper-2 p-6 motion-reduce:animate-none md:p-8"
                        style={{ animationDelay: "220ms" }}
                    >
                        <p className="font-serif text-[26px] leading-tight tracking-[-0.01em] text-ink md:text-[30px]">
                            The short version
                        </p>
                        <ul className="mt-4 border-b border-line text-[15px] leading-relaxed text-ink-2">
                            <li className="border-t border-line py-3.5">
                                <strong className="font-medium text-ink">
                                    Redesigning your own home, occasionally:
                                </strong>{" "}
                                a one-time credit tool beats any subscription. You will use it in
                                bursts and then not touch it for months.
                            </li>
                            <li className="border-t border-line py-3.5">
                                <strong className="font-medium text-ink">
                                    Staging listings as an agent:
                                </strong>{" "}
                                check commercial rights and output resolution before anything else —
                                that is where free tiers actually stop you.
                            </li>
                            <li className="border-t border-line py-3.5">
                                <strong className="font-medium text-ink">
                                    Exteriors, gardens or landscaping:
                                </strong>{" "}
                                Reimagine Home genuinely covers that and Magic Room does not. Use it.
                            </li>
                            <li className="border-t border-line py-3.5">
                                <strong className="font-medium text-ink">
                                    Uploading photos of a home you live in:
                                </strong>{" "}
                                read each tool&apos;s retention policy. They differ more than the
                                marketing suggests.
                            </li>
                        </ul>
                    </div>
                    <p className="mt-6 text-sm leading-relaxed text-ink-3">
                        Disclosure: I built Magic Room. That is a reason to check my claims, not to
                        discount them — every limitation below is stated where it applies, including
                        the cases where a competitor is the better tool.
                    </p>
                </ComparisonHero>

                {/* Why people leave */}
                <Section>
                    <Split
                        heading="Why people look for a RoomGPT alternative"
                        intro="The reasons cluster tightly, and they are worth naming because they determine which alternative is right for you."
                    >
                        <div className="border-b border-line">
                            {[
                                {
                                    title: "The room in the output is not their room",
                                    body: "This is the most common complaint about diffusion-based tools generally. The style is applied convincingly, but a window moves, a wall angle changes, or the room's proportions shift. That is fine for a mood board and useless as a planning reference — you cannot buy a sofa based on a room that is not the shape of your room.",
                                },
                                {
                                    title: "They did not expect a subscription",
                                    body: "Most AI design tools price for continuous professional use. A homeowner redesigning two rooms over a weekend pays for a month, or several, and uses a fraction of the allocation. Monthly credits that reset make this worse — you are paying for capacity you structurally cannot consume.",
                                },
                                {
                                    title: "They realised the photos are stored",
                                    body: "A photo of your living room shows your possessions, your layout, and often your family. Most tools upload it to a bucket and keep it. Retention policies vary a lot, and almost nobody reads them before uploading.",
                                },
                                {
                                    title: "The free tier ran out mid-evaluation",
                                    body: "Free tiers are typically sized to demonstrate the tool, not to finish a room. People hit the cap halfway through comparing styles and go looking for something with a less abrupt step up.",
                                },
                            ].map((item) => (
                                <div key={item.title} className="border-t border-line py-6">
                                    <h3 className={H3_CLASS}>{item.title}</h3>
                                    <p className={`${BODY_CLASS} mt-3`}>{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </Split>
                </Section>

                {/* Evaluation criteria */}
                <Section>
                    <Split
                        heading="What to actually compare"
                        intro="Feature lists on AI design tools are close to identical, because they all do the same thing. Six criteria genuinely separate them:"
                    >
                        <ol className="border-b border-line">
                            {[
                                {
                                    title: "Model architecture: multimodal or diffusion",
                                    body: "A diffusion model generates an image that matches a description. A multimodal model reads your image and your instruction together, so it can apply a style while holding the room's structure fixed. This single difference explains most of the variation in whether outputs look like your room.",
                                },
                                {
                                    title: "Photo retention",
                                    body: "Does the tool process in memory and discard, or upload and store? Ask specifically whether images are used for model training. In-memory processing means there is no bucket to breach and nothing to delete later.",
                                },
                                {
                                    title: "Billing shape, not headline price",
                                    body: "One-time credits versus recurring subscription. Then: do unused credits carry over? A €12/month plan you use twice a year costs €144/year for two redesigns.",
                                },
                                {
                                    title: "Commercial rights and watermarking",
                                    body: "If you are an agent or a designer, this is the criterion that matters most and the one most often buried in the tier table. Watermarks on a free tier are effectively a commercial-use block.",
                                },
                                {
                                    title: "Consistency between attempts",
                                    body: "Run the same photo and prompt three times. High variance means you burn several credits per usable output, which changes the real cost per design by a factor of three or more.",
                                },
                                {
                                    title: "Style specificity",
                                    body: "\"Modern\" as a preset label versus a style the model has actual design principles for. The difference shows up in whether a Scandinavian output has pale oak and layered textiles, or is just white and grey.",
                                },
                            ].map((item, i) => (
                                <li key={item.title} className="flex gap-5 border-t border-line py-6">
                                    <span className="w-8 shrink-0 font-serif text-[32px] leading-none text-ink-3">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h3 className="text-[17px] font-medium leading-snug tracking-[-0.015em] text-ink">
                                            {item.title}
                                        </h3>
                                        <p className={`${BODY_CLASS} mt-2`}>{item.body}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </Split>
                </Section>

                {/* Master comparison table */}
                <Section tone="band">
                    <h2 className={`${H2_CLASS} max-w-3xl`}>
                        RoomGPT alternatives compared at a glance
                    </h2>
                    <p className={`${BODY_CLASS} mb-10 mt-5 max-w-3xl`}>
                        Billing mechanics rather than euro figures, because vendor pricing changes
                        without notice and a stale number here would be worse than none. Each tool
                        links to its own pricing page below.
                    </p>
                    <CompareTable
                        minWidthClass="md:min-w-[820px]"
                        columns={[
                            { label: "Tool", mobileLabel: "Tool", className: "w-[16%]" },
                            { label: "Model approach", mobileLabel: "Model approach", className: "w-[20%]" },
                            { label: "Billing", mobileLabel: "Billing", className: "w-[26%]" },
                            { label: "Credits expire", mobileLabel: "Credits expire", className: "w-[19%]" },
                            { label: "Best for", mobileLabel: "Best for" },
                        ]}
                        rows={[
                            {
                                key: "magic-room",
                                highlight: true,
                                cells: [
                                    <span key="name" className="text-ink">
                                        <AccentDot />
                                        Magic Room
                                    </span>,
                                    "Google Gemini multimodal — reads image and instruction together",
                                    "One-time credits from €9.99 / 20 credits",
                                    "Never",
                                    "Homeowners redesigning in bursts; anyone who cares where their room photo goes",
                                ],
                            },
                            ...[
                                {
                                    slug: "roomgpt",
                                    model: "Diffusion — fast, geometry varies between attempts",
                                    best: "A quick free look at what a style could do, with no account setup",
                                },
                                {
                                    slug: "interior-ai",
                                    model: "Diffusion — large preset library, variable structure preservation",
                                    best: "Browsing an established catalogue of generated examples for inspiration",
                                },
                                {
                                    slug: "decorai",
                                    model: "Multiple modes including virtual staging output types",
                                    best: "Property professionals who need staging-specific output formats",
                                },
                                {
                                    slug: "reimaginehome",
                                    model: "Multiple rendering modes across interior, exterior and landscape",
                                    best: "Anyone who needs gardens, facades or exteriors as well as rooms",
                                },
                            ].flatMap((row) => {
                                const c = getCompetitorBySlug(row.slug);
                                if (!c) return [];
                                return [
                                    {
                                        key: row.slug,
                                        cells: [
                                            <Link
                                                key="name"
                                                href={`/alternatives/${c.slug}`}
                                                className={LINK_CLASS}
                                            >
                                                {c.name} alternative
                                            </Link>,
                                            row.model,
                                            c.pricingModel.billing,
                                            c.pricingModel.creditsExpire,
                                            row.best,
                                        ],
                                    },
                                ];
                            }),
                        ]}
                    />
                </Section>

                {/* Per-tool breakdown */}
                <Section rule={false}>
                    <h2 className={H2_CLASS}>Each tool in detail</h2>
                    <div className="mt-10 border-b border-line">
                        {COMPETITORS.map((competitor) => (
                            <article
                                key={competitor.slug}
                                className="grid gap-6 border-t border-line py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:gap-16"
                            >
                                <div>
                                    <h3 className="font-serif text-[clamp(30px,3vw,40px)] font-normal leading-[1.05] tracking-[-0.02em] text-ink">
                                        {competitor.name}
                                    </h3>
                                    <p className={`${BODY_CLASS} mt-4`}>{competitor.description}</p>
                                </div>
                                <div>
                                    <div className="grid gap-8 sm:grid-cols-2">
                                        <div>
                                            <h4 className={LABEL_CLASS}>Strengths</h4>
                                            <ul className="mt-3 border-b border-line text-[15px] leading-relaxed text-ink-2">
                                                {competitor.pros.map((pro, i) => (
                                                    <li key={i} className="border-t border-line py-2.5">
                                                        {pro}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className={LABEL_CLASS}>Limitations</h4>
                                            <ul className="mt-3 border-b border-line text-[15px] leading-relaxed text-ink-2">
                                                {competitor.cons.map((con, i) => (
                                                    <li key={i} className="border-t border-line py-2.5">
                                                        {con}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <p className="mt-6 text-[15px] leading-relaxed text-ink-2">
                                        <strong className="font-medium text-ink">Billing:</strong>{" "}
                                        {competitor.pricingModel.billing}{" "}
                                        <a
                                            href={competitor.pricingModel.officialPricingUrl}
                                            className={LINK_CLASS}
                                            rel="nofollow noopener"
                                            target="_blank"
                                        >
                                            Current {competitor.name} pricing
                                        </a>
                                        .
                                    </p>
                                    <p className="mt-5 flex flex-wrap gap-2.5">
                                        <Link href={`/alternatives/${competitor.slug}`} className={CHIP_CLASS}>
                                            {competitor.name} alternative — full breakdown
                                        </Link>
                                        {hasVsPage(competitor.slug) && (
                                            <Link href={`/vs/${competitor.slug}`} className={CHIP_CLASS}>
                                                Magic Room vs {competitor.name}
                                            </Link>
                                        )}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </Section>

                {/* Recommendation by use case */}
                <Section>
                    <h2 className={H2_CLASS}>Which alternative should you pick?</h2>
                    <div className="mt-10 grid gap-4 md:grid-cols-2">
                        {[
                            {
                                who: "You are redesigning your own home",
                                pick: "Magic Room. The economics decide it: you will redesign in a burst and then stop, and one-time credits that never expire match that pattern where a subscription does not. Start with a room type on the design catalogue — Art Deco bedroom ideas and Scandinavian living room ideas are the most-viewed starting points.",
                            },
                            {
                                who: "You are an estate agent staging listings",
                                pick: "Check commercial rights first, on every tool. Magic Room includes full commercial rights on every paid credit with no tier gate; most competitors restrict this to higher tiers. DecorAI is worth a look if you need staging-specific output formats rather than a redesign.",
                            },
                            {
                                who: "You need exteriors, gardens or landscaping",
                                pick: "Reimagine Home. Magic Room does interiors only, and pretending otherwise would waste your time. If you need both, the multi-purpose tool is genuinely the right call.",
                            },
                            {
                                who: "You want to browse a large library of examples first",
                                pick: "Interior AI. Its catalogue of previously generated rooms is larger than anything Magic Room offers, and browsing it costs nothing.",
                            },
                            {
                                who: "You just want a free look at one room",
                                pick: "RoomGPT's free tier, or Magic Room's free credit — both let you see output without paying. The difference is what happens next: Magic Room's step-up is €9.99 once, not a recurring plan.",
                            },
                            {
                                who: "Photo privacy is your deciding factor",
                                pick: "Magic Room. Images are held in memory for the duration of the request and never written to a storage bucket or used for training. No competitor in this comparison makes an equivalent commitment.",
                            },
                        ].map((row) => (
                            <div key={row.who} className="rounded-2xl bg-paper-2 p-6 md:p-7">
                                <h3 className="font-serif text-[24px] font-normal leading-tight tracking-[-0.01em] text-ink">
                                    {row.who}
                                </h3>
                                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{row.pick}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                {/* FAQ */}
                <Section>
                    <Split heading="RoomGPT alternatives: frequently asked questions">
                        <div className="border-b border-line">
                            {[
                                {
                                    q: "What is the best RoomGPT alternative in 2026?",
                                    a: "It depends on what pushed you off RoomGPT. For structural accuracy and photo privacy, a multimodal tool like Magic Room is the closest replacement for the same upload-a-photo workflow. For exteriors and landscaping, Reimagine Home covers ground Magic Room does not. For a large browsable library of examples, Interior AI. For staging-specific output formats, DecorAI.",
                                },
                                {
                                    q: "Is there a free RoomGPT alternative?",
                                    a: "Every tool here has some free access. Magic Room gives 1 free credit on signup with no card, and one credit produces a full redesign, so you see real output on your own room before paying. The meaningful difference is the step up afterwards: Magic Room's is €9.99 once for 20 credits, where most competitors move you onto a recurring plan.",
                                },
                                {
                                    q: "Why do AI room redesigns not look like my actual room?",
                                    a: "Because most tools use diffusion models, which generate an image matching a description rather than editing the image you supplied. Walls move, windows relocate, proportions shift. Multimodal models read your photo and your instruction together, so the room's structure is a constraint rather than a suggestion. If your outputs keep coming back as a different room, that is the reason.",
                                },
                                {
                                    q: "Do these tools store my room photos?",
                                    a: "Most do. Uploaded images typically go to a storage bucket and remain there, and several tools reserve the right to use them for model improvement. Magic Room processes images in memory for the duration of the request only — nothing is written to storage and nothing is used for training. Check each tool's policy directly before uploading photos of a home you live in.",
                                },
                                {
                                    q: "Which AI interior design tool is cheapest?",
                                    a: "Cheapest depends entirely on how often you use it. For continuous professional use, a subscription with a large monthly allocation wins. For occasional use — which is most homeowners — one-time credits win, because a subscription charges you for months in which you redesign nothing. At €9.99 for 20 credits with no expiry, Magic Room works out at about €0.50 per Quick design regardless of how long you take to use them.",
                                },
                                {
                                    q: "Can I use AI interior design outputs commercially?",
                                    a: "Only if the tool grants commercial rights on your tier. This is the single most commonly missed detail for estate agents and designers, and free tiers usually exclude it or apply a watermark. Magic Room grants full commercial rights on every paid generation on every pack.",
                                },
                            ].map((item) => (
                                <div key={item.q} className="border-t border-line py-6">
                                    <h3 className="font-serif text-[22px] font-normal leading-tight tracking-[-0.01em] text-ink md:text-[24px]">
                                        {item.q}
                                    </h3>
                                    <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </Split>
                </Section>

                {/* Cross-links to other content sections */}
                <Section className="pb-0 md:pb-0">
                    <h2 className={H2_CLASS}>Explore more</h2>
                    <div className="mt-8 grid gap-x-10 sm:grid-cols-2">
                        {[
                            {
                                href: "/design",
                                title: "AI interior design ideas by style and room",
                                body: "196 combinations across 14 styles and 14 room types.",
                            },
                            {
                                href: "/blog/best-ai-interior-design-tools-2026",
                                title: "Best AI interior design tools 2026",
                                body: "The long-form tested write-up behind this comparison.",
                            },
                            {
                                href: "/virtual-staging",
                                title: "AI virtual staging for real estate",
                                body: "What AI staging replaces, and where it still falls short.",
                            },
                            {
                                href: "/gallery",
                                title: "AI room design gallery",
                                body: "Before-and-after examples from real room photos.",
                            },
                        ].map((card) => (
                            <Link
                                key={card.href}
                                href={card.href}
                                className="group flex flex-col border-t border-line py-5 pr-1"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-[17px] font-medium leading-snug tracking-[-0.015em] text-ink">
                                        {card.title}
                                    </h3>
                                    <ArrowUpRight
                                        aria-hidden="true"
                                        className="mt-0.5 size-[18px] shrink-0 text-ink-3 transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
                                    />
                                </div>
                                <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{card.body}</p>
                            </Link>
                        ))}
                    </div>
                </Section>

                <CtaSection
                    heading="See the difference yourself"
                    subtext="Try Magic Room with one free credit. No subscription, no hidden fees."
                />
            </PageTransition>
        </>
    );
}

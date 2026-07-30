import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";
import {
    breadcrumbSchema,
    itemListSchema,
    softwareApplicationSchema,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { COMPETITORS, getCompetitorBySlug } from "@/lib/seo/competitor-data";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
import { PageTransition } from "@/components/page-transition";
import { JsonLd } from "@/components/seo/json-ld";

// Cross-link card, repeated once per card in the grid below.
const RELATED_CARD_CLASS =
    "rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900";

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
                {/* Breadcrumb */}
                <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container px-4 md:px-6">
                        <BreadcrumbNav
                            items={[
                                { name: "Home", href: "/" },
                                { name: "Alternatives", href: "/alternatives" },
                            ]}
                        />
                    </div>
                </div>

                {/* Hero + verdict.
                    This page took 887 impressions and zero clicks at position
                    12.2 while consisting of nothing but two lists of links.
                    Everything below is the substance a "roomgpt alternatives"
                    searcher is actually looking for. */}
                <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                                RoomGPT Alternatives: 4 AI Interior Design Tools Compared
                            </h1>
                            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span>
                                    By{" "}
                                    <Link href="/about" className="hover:text-primary hover:underline">
                                        Thanos Kazakis
                                    </Link>
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>Magic Room founder</span>
                            </p>
                            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                                RoomGPT made AI room redesign mainstream, and most people looking for an
                                alternative are looking for one of three specific things: outputs that keep
                                their room&apos;s real geometry, a tool that does not keep their room photos,
                                or a way to pay once instead of monthly. This page compares the four tools
                                people most often evaluate against each other — RoomGPT, Interior AI, DecorAI
                                and Reimagine Home — plus Magic Room, which I build.
                            </p>
                            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    The short version
                                </p>
                                <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>
                                        <strong className="text-slate-900 dark:text-white">
                                            Redesigning your own home, occasionally:
                                        </strong>{" "}
                                        a one-time credit tool beats any subscription. You will use it in
                                        bursts and then not touch it for months.
                                    </li>
                                    <li>
                                        <strong className="text-slate-900 dark:text-white">
                                            Staging listings as an agent:
                                        </strong>{" "}
                                        check commercial rights and output resolution before anything else —
                                        that is where free tiers actually stop you.
                                    </li>
                                    <li>
                                        <strong className="text-slate-900 dark:text-white">
                                            Exteriors, gardens or landscaping:
                                        </strong>{" "}
                                        Reimagine Home genuinely covers that and Magic Room does not. Use it.
                                    </li>
                                    <li>
                                        <strong className="text-slate-900 dark:text-white">
                                            Uploading photos of a home you live in:
                                        </strong>{" "}
                                        read each tool&apos;s retention policy. They differ more than the
                                        marketing suggests.
                                    </li>
                                </ul>
                            </div>
                            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                                Disclosure: I built Magic Room. That is a reason to check my claims, not to
                                discount them — every limitation below is stated where it applies, including
                                the cases where a competitor is the better tool.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why people leave */}
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                                Why people look for a RoomGPT alternative
                            </h2>
                            <p className="mb-6 text-slate-600 dark:text-slate-400">
                                The reasons cluster tightly, and they are worth naming because they determine
                                which alternative is right for you.
                            </p>
                            <div className="space-y-5">
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
                                    <div key={item.title}>
                                        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">{item.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Evaluation criteria */}
                <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                                What to actually compare
                            </h2>
                            <p className="mb-6 text-slate-600 dark:text-slate-400">
                                Feature lists on AI design tools are close to identical, because they all do
                                the same thing. Six criteria genuinely separate them:
                            </p>
                            <ol className="space-y-5">
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
                                    <li key={item.title} className="flex gap-4">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                                            {i + 1}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 text-slate-600 dark:text-slate-400">
                                                {item.body}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </section>

                {/* Master comparison table */}
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-5xl">
                            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                                RoomGPT alternatives compared at a glance
                            </h2>
                            <p className="mb-6 text-slate-600 dark:text-slate-400">
                                Billing mechanics rather than euro figures, because vendor pricing changes
                                without notice and a stale number here would be worse than none. Each tool
                                links to its own pricing page below.
                            </p>
                            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                                <table className="w-full min-w-[820px] text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                                                Tool
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                                                Model approach
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                                                Billing
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                                                Credits expire
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                                                Best for
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-slate-100 bg-primary/5 dark:border-slate-800/50 dark:bg-primary/10">
                                            <td className="px-4 py-3 font-medium text-primary">
                                                Magic Room
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                Google Gemini multimodal — reads image and instruction together
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                One-time credits from €9.99 / 30 designs
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                Never
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                Homeowners redesigning in bursts; anyone who cares where their
                                                room photo goes
                                            </td>
                                        </tr>
                                        {[
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
                                        ].map((row) => {
                                            const c = getCompetitorBySlug(row.slug);
                                            if (!c) return null;
                                            return (
                                                <tr
                                                    key={row.slug}
                                                    className="border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50 dark:border-slate-800/50 dark:odd:bg-slate-950 dark:even:bg-slate-900"
                                                >
                                                    <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                                                        <Link
                                                            href={`/alternatives/${c.slug}`}
                                                            className="text-primary hover:underline"
                                                        >
                                                            {c.name} alternative
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {row.model}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {c.pricingModel.billing}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {c.pricingModel.creditsExpire}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                        {row.best}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Per-tool breakdown */}
                <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                                Each tool in detail
                            </h2>
                            <div className="space-y-10">
                                {COMPETITORS.map((competitor) => (
                                    <article
                                        key={competitor.slug}
                                        className="border-b border-slate-200 pb-10 last:border-0 dark:border-slate-800"
                                    >
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                            {competitor.name}
                                        </h3>
                                        <p className="mt-3 text-slate-600 dark:text-slate-400">
                                            {competitor.description}
                                        </p>
                                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                    Strengths
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                    {competitor.pros.map((pro, i) => (
                                                        <li key={i}>{pro}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                                    Limitations
                                                </h4>
                                                <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                                                    {competitor.cons.map((con, i) => (
                                                        <li key={i}>{con}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <p className="mt-5 text-sm text-slate-600 dark:text-slate-400">
                                            <strong className="text-slate-900 dark:text-white">
                                                Billing:
                                            </strong>{" "}
                                            {competitor.pricingModel.billing}{" "}
                                            <a
                                                href={competitor.pricingModel.officialPricingUrl}
                                                className="text-primary hover:underline"
                                                rel="nofollow noopener"
                                                target="_blank"
                                            >
                                                Current {competitor.name} pricing
                                            </a>
                                            .
                                        </p>
                                        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                                            <Link
                                                href={`/alternatives/${competitor.slug}`}
                                                className="text-primary hover:underline"
                                            >
                                                {competitor.name} alternative — full breakdown
                                            </Link>
                                            <Link
                                                href={`/vs/${competitor.slug}`}
                                                className="text-primary hover:underline"
                                            >
                                                Magic Room vs {competitor.name}
                                            </Link>
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recommendation by use case */}
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                                Which alternative should you pick?
                            </h2>
                            <div className="space-y-4">
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
                                    <div
                                        key={row.who}
                                        className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            {row.who}
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                            {row.pick}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                                RoomGPT alternatives: frequently asked questions
                            </h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        q: "What is the best RoomGPT alternative in 2026?",
                                        a: "It depends on what pushed you off RoomGPT. For structural accuracy and photo privacy, a multimodal tool like Magic Room is the closest replacement for the same upload-a-photo workflow. For exteriors and landscaping, Reimagine Home covers ground Magic Room does not. For a large browsable library of examples, Interior AI. For staging-specific output formats, DecorAI.",
                                    },
                                    {
                                        q: "Is there a free RoomGPT alternative?",
                                        a: "Every tool here has some free access. Magic Room gives 1 free credit on signup with no card, and one credit produces 4–8 variations, so you see real output on your own room before paying. The meaningful difference is the step up afterwards: Magic Room's is €9.99 once for 30 designs, where most competitors move you onto a recurring plan.",
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
                                        a: "Cheapest depends entirely on how often you use it. For continuous professional use, a subscription with a large monthly allocation wins. For occasional use — which is most homeowners — one-time credits win, because a subscription charges you for months in which you redesign nothing. At €9.99 for 30 designs with no expiry, Magic Room works out at about €0.33 per design regardless of how long you take to use them.",
                                    },
                                    {
                                        q: "Can I use AI interior design outputs commercially?",
                                        a: "Only if the tool grants commercial rights on your tier. This is the single most commonly missed detail for estate agents and designers, and free tiers usually exclude it or apply a watermark. Magic Room grants full commercial rights on every paid generation on every pack.",
                                    },
                                ].map((item) => (
                                    <div key={item.q}>
                                        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            {item.q}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cross-links to other content sections */}
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Explore more
                            </h2>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <Link
                                    href="/design"
                                    className={RELATED_CARD_CLASS}
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        AI interior design ideas by style and room
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        196 combinations across 14 styles and 14 room types.
                                    </p>
                                </Link>
                                <Link
                                    href="/blog/best-ai-interior-design-tools-2026"
                                    className={RELATED_CARD_CLASS}
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        Best AI interior design tools 2026
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        The long-form tested write-up behind this comparison.
                                    </p>
                                </Link>
                                <Link
                                    href="/virtual-staging"
                                    className={RELATED_CARD_CLASS}
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        AI virtual staging for real estate
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        What AI staging replaces, and where it still falls short.
                                    </p>
                                </Link>
                                <Link
                                    href="/gallery"
                                    className={RELATED_CARD_CLASS}
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        AI room design gallery
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Before-and-after examples from real room photos.
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <CtaSection
                    heading="See the difference yourself"
                    subtext="Try Magic Room with one free credit. No subscription, no hidden fees."
                />
            </PageTransition>
        </>
    );
}

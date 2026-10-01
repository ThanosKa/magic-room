"use client";

import React from "react";
import Link from "next/link";
import { ICompetitorData } from "@/lib/seo/competitor-data";
import { IContextualLink } from "@/lib/seo/internal-links";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
import { FeatureComparisonTable } from "@/components/seo/feature-comparison-table";
import { RelatedLinks } from "@/components/seo/related-links";
import { PageTransition } from "@/components/page-transition";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// Anchor-chip class, repeated once per contextual link below.
const CHIP_CLASS =
    "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300";

interface AlternativePageContentProps {
    competitor: ICompetitorData;
    otherCompetitors?: ICompetitorData[];
    /** Competitors that still have a live (non-redirecting) /vs page, self included. */
    vsCompetitors?: ICompetitorData[];
    designLinks?: IContextualLink[];
    blogLinks?: IContextualLink[];
}

export function AlternativePageContent({
    competitor,
    otherCompetitors = [],
    vsCompetitors = [],
    designLinks = [],
    blogLinks = [],
}: AlternativePageContentProps) {
    const breadcrumbItems = [
        { name: "Home", href: "/" },
        { name: "Alternatives", href: "/alternatives" },
        { name: `${competitor.name} Alternative`, href: `/alternatives/${competitor.slug}` },
    ];

    return (
        <PageTransition>
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container px-4 md:px-6">
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
            </div>

            {/* Hero */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                            Best {competitor.name} Alternative
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                            Magic Room is the closest {competitor.name} alternative for anyone who wants the
                            same upload-a-photo workflow without the trade-offs. It runs Google Gemini
                            multimodal AI so your room&apos;s actual layout survives the redesign, never stores
                            your uploaded photo, and costs €9.99 one-time for 30 designs instead of a
                            subscription.
                        </p>
                        <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                            {competitor.description} Below is how the two tools compare on AI model, photo
                            privacy, pricing, and who each one suits.
                        </p>
                    </div>
                </div>
            </section>

            {/* About the competitor */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                            What is {competitor.name}?
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                                    What {competitor.name} does well
                                </h3>
                                <ul className="space-y-2">
                                    {competitor.pros.map((pro, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="mt-0.5 text-primary font-bold">+</span>
                                            {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                                    Where {competitor.name} falls short
                                </h3>
                                <ul className="space-y-2">
                                    {competitor.cons.map((con, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="mt-0.5 text-slate-400">-</span>
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Pricing
                            </p>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                {competitor.pricing}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why people look for an alternative — validates the searcher's
                reason for being here before pitching anything. */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                            Why people look for a {competitor.name} alternative
                        </h2>
                        <p className="mb-6 text-slate-600 dark:text-slate-400">
                            These are the reasons that come up repeatedly. Not all of them will apply to
                            you — if none of them do, {competitor.name} is probably fine and you can stop
                            reading here.
                        </p>
                        <ul className="space-y-3">
                            {competitor.whySwitch.map((reason, i) => (
                                <li
                                    key={i}
                                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                                >
                                    {reason}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Comparison table */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                            Feature comparison: Magic Room vs {competitor.name}
                        </h2>
                        <FeatureComparisonTable
                            competitorName={competitor.name}
                            competitorPricing={competitor.pricing}
                        />
                    </div>
                </div>
            </section>

            {/* Pricing mechanics.
                A large share of the impressions these pages already earn come
                from pricing queries — "reimagine home pricing 2026",
                "interior ai pricing 2026", "roomgpt pricing 2026" — which the
                page previously answered with a single vague sentence. */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                            {competitor.name} pricing vs Magic Room pricing: how you actually get charged
                        </h2>
                        <p className="mb-6 text-slate-600 dark:text-slate-400">
                            Headline prices on AI design tools change often, so the table below compares the
                            billing <em>mechanics</em> rather than quoting figures that go stale. These are the
                            parts that decide what you end up paying. For {competitor.name}&apos;s current rate,
                            check{" "}
                            <a
                                href={competitor.pricingModel.officialPricingUrl}
                                className="text-primary hover:underline"
                                rel="nofollow noopener"
                                target="_blank"
                            >
                                their own pricing page
                            </a>
                            .
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                        <th className="w-1/4 px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                                            What decides the cost
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-primary">
                                            Magic Room
                                        </th>
                                        <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                                            {competitor.name}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        {
                                            label: "How you are billed",
                                            magicRoom:
                                                "One-time credit packages: €9.99 for 30 designs, €19.99 and €29.99 for larger packs. No subscription exists to cancel.",
                                            competitor: competitor.pricingModel.billing,
                                        },
                                        {
                                            label: "Free tier",
                                            magicRoom:
                                                "1 free credit on signup, no card required. One credit produces 4–8 variations, so you see real output before paying.",
                                            competitor: competitor.pricingModel.freeTier,
                                        },
                                        {
                                            label: "Do unused credits expire?",
                                            magicRoom:
                                                "No. Credits never expire. Buy 30, use them across two years if that is how your renovation runs.",
                                            competitor: competitor.pricingModel.creditsExpire,
                                        },
                                        {
                                            label: "Commercial rights",
                                            magicRoom:
                                                "Full commercial rights on every paid generation, on every pack. No tier gate.",
                                            competitor: competitor.pricingModel.commercialRights,
                                        },
                                        {
                                            label: "If you stop paying",
                                            magicRoom:
                                                "Nothing changes — there is no recurring charge. Any credits you already bought stay on the account.",
                                            competitor: competitor.pricingModel.ifYouStopPaying,
                                        },
                                        {
                                            label: "Cost of 30 designs",
                                            magicRoom:
                                                "€9.99 total, about €0.33 per design, paid once.",
                                            competitor:
                                                "One or more billing periods at the plan rate, depending on the monthly allocation. Multiply the monthly price by the number of months needed to accumulate 30 generations.",
                                        },
                                    ].map((row, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50 dark:border-slate-800/50 dark:odd:bg-slate-950 dark:even:bg-slate-900"
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                                                {row.label}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                {row.magicRoom}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                                {row.competitor}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            The practical rule: recurring plans are better value if you redesign every month,
                            one-time credits are better value if you redesign in bursts. Most homeowners
                            redesign in bursts.{" "}
                            <Link href="/pricing" className="text-primary hover:underline">
                                See Magic Room credit pack pricing
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Magic Room */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                            Why choose Magic Room over {competitor.name}?
                        </h2>
                        <p className="mb-6 text-slate-600 dark:text-slate-400">
                            Three differences decide it for most people: Magic Room never stores your room
                            photo, it charges one-time credits from €9.99 rather than a subscription, and it
                            uses a multimodal model that preserves your room&apos;s real geometry. In detail:
                        </p>
                        <ul className="space-y-4">
                            {competitor.magicRoomAdvantages.map((advantage, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                        {i + 1}
                                    </span>
                                    <p className="text-slate-600 dark:text-slate-400">{advantage}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Who is it for */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                            Should you switch from {competitor.name} to Magic Room?
                        </h2>
                        <p className="mb-8 text-slate-600 dark:text-slate-400">
                            Switch if photo privacy, one-time pricing, or accurate room geometry matter to
                            you. There is nothing to migrate — Magic Room works from the same room photo, so
                            you can test it on one image with the free credit before deciding. Stay on{" "}
                            {competitor.name} if you need features it has and Magic Room does not.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 dark:bg-primary/10">
                                <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                                    Choose Magic Room if you:
                                </h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>Want privacy guarantees around your room photos</li>
                                    <li>Prefer a one-time credit purchase over a subscription</li>
                                    <li>Want outputs that preserve your room&apos;s physical structure accurately</li>
                                    <li>Need consistent results without multiple regeneration attempts</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                                    Consider {competitor.name} if you:
                                </h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>Already have an account and familiarity with the tool</li>
                                    <li>Specifically need features unique to {competitor.name}</li>
                                    <li>Want to browse a large library of previous generations for reference</li>
                                    <li>Have a use case outside of residential interior room redesign</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            {competitor.faqs.length > 0 && (
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                                {competitor.name} alternative: frequently asked questions
                            </h2>
                            <Accordion type="single" collapsible className="space-y-2">
                                {competitor.faqs.map((faq, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`faq-${index}`}
                                        className="rounded-lg border border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <AccordionTrigger className="text-left text-sm font-medium text-slate-900 hover:no-underline dark:text-white">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-sm text-slate-600 dark:text-slate-400">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </section>
            )}

            {/* Migration — what switching actually involves. */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                            How to switch from {competitor.name} to Magic Room
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">{competitor.migration}</p>
                        <ol className="mt-6 list-decimal space-y-3 pl-6 text-slate-600 dark:text-slate-400">
                            <li>
                                Create a Magic Room account. One free credit is added automatically — no card
                                required.
                            </li>
                            <li>
                                Upload the same room photo you last ran through {competitor.name}, so the
                                comparison is like for like.
                            </li>
                            <li>
                                Pick a room type and one of the 14 design themes, and add any specifics
                                (&ldquo;keep the fireplace&rdquo;, &ldquo;warm tones only&rdquo;) in the
                                optional prompt field.
                            </li>
                            <li>
                                Compare the two outputs on one question: does the redesign still show{" "}
                                <em>your</em> walls, windows and proportions? That is where the multimodal and
                                diffusion approaches diverge.
                            </li>
                            <li>
                                Only cancel your {competitor.name} plan once you have compared — and use any
                                credits you have already paid for first.
                            </li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* Also compare — anchors fixed.
                These links point at /alternatives/[slug] but previously used the
                anchor "Magic Room vs [name]", which is the /vs/[slug] page's
                query phrase. Anchor and target now match, and the head-to-head
                page gets its own link instead of none. */}
            {otherCompetitors.length > 0 && (
                <section className="bg-slate-50 py-10 dark:bg-slate-900/50">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                                Compare other AI interior design tools
                            </h2>
                            <ul className="flex flex-wrap gap-3">
                                {otherCompetitors.map((c) => (
                                    <li key={c.slug}>
                                        <Link
                                            href={`/alternatives/${c.slug}`}
                                            className={CHIP_CLASS}
                                        >
                                            {c.name} alternative
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <h3 className="mb-4 mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                                {vsCompetitors.length > 0 ? "Head-to-head comparisons" : "More comparisons"}
                            </h3>
                            <ul className="flex flex-wrap gap-3">
                                {vsCompetitors.map((c) => (
                                    <li key={c.slug}>
                                        <Link
                                            href={`/vs/${c.slug}`}
                                            className={CHIP_CLASS}
                                        >
                                            Magic Room vs {c.name}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link
                                        href="/alternatives"
                                        className={CHIP_CLASS}
                                    >
                                        All RoomGPT alternatives compared
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            {/* Comparison cluster -> design catalogue. Previously the four
                comparison pages linked to no design page at all. */}
            <RelatedLinks
                heading="Try these styles on your own room"
                intro="Every design page shows the style applied to a real room and generates the same on a photo of yours."
                links={designLinks}
                className="bg-white py-12 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 md:py-16"
            />

            <RelatedLinks
                heading="Further reading on AI interior design"
                links={blogLinks}
                className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16"
            />

            {/* CTA */}
            <CtaSection
                heading="Try Magic Room for free"
                subtext="Upload a photo of your room and generate your first AI redesign. One free credit included with every account."
            />
        </PageTransition>
    );
}

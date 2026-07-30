"use client";

import React from "react";
import Link from "next/link";
import { ICompetitorData } from "@/lib/seo/competitor-data";
import { IContextualLink } from "@/lib/seo/internal-links";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
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

interface VsRow {
    feature: string;
    magicRoom: string;
    competitor: string;
}

const VS_ROWS: VsRow[] = [
    {
        feature: "AI model",
        magicRoom: "Google Gemini multimodal",
        competitor: "Diffusion-based model",
    },
    {
        feature: "Image storage",
        magicRoom: "Never stored — in-memory processing",
        competitor: "Images stored on servers",
    },
    {
        feature: "Credits expire",
        magicRoom: "No",
        competitor: "Monthly reset on most plans",
    },
    {
        feature: "Pricing",
        magicRoom: "One-time credit packages from EUR 9.99",
        competitor: "Subscription required for full access",
    },
    {
        feature: "Room structure preservation",
        magicRoom: "High — architectural geometry maintained",
        competitor: "Variable — can alter proportions inconsistently",
    },
    {
        feature: "Design themes",
        magicRoom: "14 themes (modern, scandinavian, industrial, bohemian, etc.)",
        competitor: "Style presets without design guidance",
    },
    {
        feature: "Free trial",
        magicRoom: "1 free credit with account signup",
        competitor: "Limited free tier available",
    },
];

interface VsPageContentProps {
    competitor: ICompetitorData;
    /** The other three competitors, for sibling /vs and /alternatives links. */
    otherCompetitors?: ICompetitorData[];
    designLinks?: IContextualLink[];
    blogLinks?: IContextualLink[];
}

export function VsPageContent({
    competitor,
    otherCompetitors = [],
    designLinks = [],
    blogLinks = [],
}: VsPageContentProps) {
    const breadcrumbItems = [
        { name: "Home", href: "/" },
        { name: "Alternatives", href: "/alternatives" },
        {
            name: `Magic Room vs ${competitor.name}`,
            href: `/vs/${competitor.slug}`,
        },
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
                            Magic Room vs {competitor.name}
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                            Magic Room and {competitor.name} both redesign a room from a single photo. They
                            differ in three ways that matter: the AI model behind them, whether your uploaded
                            photo is stored, and whether you pay once or every month.
                        </p>

                        {/* Direct answer block */}
                        <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Which is better, Magic Room or {competitor.name}?
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Magic Room is the better choice if photo privacy and one-time pricing matter to
                                you: it runs Google Gemini multimodal AI for architecturally accurate results,
                                never stores your uploaded photos, and sells one-time credits from €9.99 instead
                                of a subscription. {competitor.name} is the better choice if you need its
                                specific extra features or already have a workflow built around it.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison table */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                            Magic Room vs {competitor.name}: side-by-side comparison
                        </h2>
                        <p className="mb-8 text-slate-600 dark:text-slate-400">
                            The table below compares both tools on the seven factors people actually decide on.
                            Competitor plans change over time — check {competitor.name}&apos;s own pricing page
                            for their current figures.
                        </p>
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                                        <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300">
                                            Feature
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
                                    {VS_ROWS.map((row, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-slate-100 last:border-0 dark:border-slate-800/50 odd:bg-white even:bg-slate-50 dark:odd:bg-slate-950 dark:even:bg-slate-900"
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                                                {row.feature}
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
                    </div>
                </div>
            </section>

            {/* Who each is best for */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                            Who should use Magic Room and who should use {competitor.name}?
                        </h2>
                        <p className="mb-8 text-slate-600 dark:text-slate-400">
                            Pick Magic Room for interior rooms where privacy, one-time pricing, and preserving
                            the real layout matter. Pick {competitor.name} when you need something outside that
                            scope or are already committed to its platform.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 dark:bg-primary/10">
                                <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                                    Magic Room is best for:
                                </h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>Users who want privacy guarantees around uploaded room photos</li>
                                    <li>Anyone who prefers pay-as-you-go credits over a monthly subscription</li>
                                    <li>People who want results that preserve the physical structure of their room</li>
                                    <li>Homeowners redesigning one or several rooms without a recurring commitment</li>
                                </ul>
                            </div>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                                <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
                                    {competitor.name} is best for:
                                </h3>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>Users already familiar with the tool who do not want to switch platforms</li>
                                    <li>Anyone who wants to browse an established library of generated examples</li>
                                    <li>Users with use cases that extend beyond interior room redesign</li>
                                    <li>People who prefer a subscription model for predictable monthly access</li>
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
                                Common questions about Magic Room vs {competitor.name}
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

            {/* Pricing mechanics — the pricing query cluster ("reimagine home
                pricing 2026", "interior ai pricing 2026", "roomgpt pricing
                2026") lands on these pages and previously found nothing. */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
                            {competitor.name} pricing vs Magic Room pricing
                        </h2>
                        <p className="mb-6 text-slate-600 dark:text-slate-400">
                            Rates change; billing mechanics do not. These are the parts that decide what you
                            actually pay. For {competitor.name}&apos;s current rate, check{" "}
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
                        <dl className="space-y-4">
                            {[
                                {
                                    term: "How you are billed",
                                    magicRoom:
                                        "One-time credit packs from €9.99 for 30 designs. No subscription.",
                                    competitor: competitor.pricingModel.billing,
                                },
                                {
                                    term: "Free tier",
                                    magicRoom: "1 credit on signup, no card, 4–8 variations from it.",
                                    competitor: competitor.pricingModel.freeTier,
                                },
                                {
                                    term: "Do unused credits expire?",
                                    magicRoom: "No, never.",
                                    competitor: competitor.pricingModel.creditsExpire,
                                },
                                {
                                    term: "Commercial rights",
                                    magicRoom: "Included on every paid generation, every pack.",
                                    competitor: competitor.pricingModel.commercialRights,
                                },
                                {
                                    term: "If you stop paying",
                                    magicRoom: "Nothing changes — there is no recurring charge.",
                                    competitor: competitor.pricingModel.ifYouStopPaying,
                                },
                            ].map((row) => (
                                <div
                                    key={row.term}
                                    className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <dt className="font-semibold text-slate-900 dark:text-white">
                                        {row.term}
                                    </dt>
                                    <dd className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        <span className="font-medium text-primary">Magic Room: </span>
                                        {row.magicRoom}
                                    </dd>
                                    <dd className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {competitor.name}:{" "}
                                        </span>
                                        {row.competitor}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
                            Full detail on switching, including what carries over, is on the{" "}
                            <Link
                                href={`/alternatives/${competitor.slug}`}
                                className="text-primary hover:underline"
                            >
                                {competitor.name} alternative
                            </Link>{" "}
                            page, and Magic Room&apos;s own packs are listed on{" "}
                            <Link href="/pricing" className="text-primary hover:underline">
                                the credit pricing page
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>

            {/* Sibling comparison pages.
                /vs/decorai, /vs/interior-ai and /vs/reimaginehome each had
                exactly one inbound internal link — the /alternatives hub. The
                four head-to-head pages now form a closed cluster. */}
            <section className="bg-slate-50 py-10 dark:bg-slate-900/50">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                            Other head-to-head comparisons
                        </h2>
                        <ul className="flex flex-wrap gap-3">
                            {otherCompetitors.map((c) => (
                                <li key={`vs-${c.slug}`}>
                                    <Link
                                        href={`/vs/${c.slug}`}
                                        className={CHIP_CLASS}
                                    >
                                        Magic Room vs {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <h3 className="mb-4 mt-8 text-lg font-semibold text-slate-900 dark:text-white">
                            Looking for a straight replacement?
                        </h3>
                        <ul className="flex flex-wrap gap-3">
                            <li>
                                <Link
                                    href={`/alternatives/${competitor.slug}`}
                                    className={CHIP_CLASS}
                                >
                                    {competitor.name} alternative
                                </Link>
                            </li>
                            {otherCompetitors.map((c) => (
                                <li key={`alt-${c.slug}`}>
                                    <Link
                                        href={`/alternatives/${c.slug}`}
                                        className={CHIP_CLASS}
                                    >
                                        {c.name} alternative
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

            <RelatedLinks
                heading="Try these styles on your own room"
                links={designLinks}
                className="bg-white py-12 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 md:py-16"
            />

            <RelatedLinks
                heading="Further reading on AI interior design"
                links={blogLinks}
                className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16"
            />

            <CtaSection
                heading={`Try Magic Room free — see how it compares to ${competitor.name}`}
                subtext="Generate your first AI room redesign with one free credit. No subscription required."
            />
        </PageTransition>
    );
}

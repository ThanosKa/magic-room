"use client";

import React from "react";
import Link from "next/link";
import { ICompetitorData } from "@/lib/seo/competitor-data";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
import { PageTransition } from "@/components/page-transition";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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
        magicRoom: "8 themes (modern, scandinavian, industrial, bohemian, etc.)",
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
}

export function VsPageContent({ competitor }: VsPageContentProps) {
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
                            Both tools generate AI-powered room redesigns from a single photo. This comparison covers the
                            differences in AI approach, privacy, pricing, and output quality to help you decide which is
                            right for your situation.
                        </p>

                        {/* TL;DR */}
                        <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
                            <p className="font-semibold text-slate-900 dark:text-white">TL;DR</p>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                Magic Room uses Google Gemini multimodal AI for more architecturally accurate
                                results, does not store your uploaded photos, and charges by credit rather than
                                subscription. {competitor.name} has an established user base and a larger catalogue
                                of generated examples. If privacy and predictable pricing are priorities, Magic Room
                                is the better fit.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison table */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                            Side-by-side comparison
                        </h2>
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
                        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                            Who each tool is best for
                        </h2>
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

            {/* Cross-links */}
            <section className="bg-white py-8 dark:bg-slate-950">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Browse{" "}
                            <Link href="/design" className="text-primary hover:underline">
                                196 AI design combinations
                            </Link>{" "}
                            across 14 styles and 14 room types, or read the{" "}
                            <Link href="/blog" className="text-primary hover:underline">
                                interior design blog
                            </Link>{" "}
                            for practical guides on using AI for room redesign.
                        </p>
                    </div>
                </div>
            </section>

            <CtaSection
                heading={`Try Magic Room free — see how it compares to ${competitor.name}`}
                subtext="Generate your first AI room redesign with one free credit. No subscription required."
            />
        </PageTransition>
    );
}

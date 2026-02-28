"use client";

import React from "react";
import Link from "next/link";
import { ICompetitorData } from "@/lib/seo/competitor-data";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
import { FeatureComparisonTable } from "@/components/seo/feature-comparison-table";
import { PageTransition } from "@/components/page-transition";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface AlternativePageContentProps {
    competitor: ICompetitorData;
}

export function AlternativePageContent({ competitor }: AlternativePageContentProps) {
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
                            {competitor.description} If you are looking for an alternative, here is how
                            Magic Room compares and who each tool is best suited to.
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
                                    What it does well
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
                                    Common limitations
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

            {/* Comparison table */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                            Feature comparison: Magic Room vs {competitor.name}
                        </h2>
                        <FeatureComparisonTable competitorName={competitor.name} />
                    </div>
                </div>
            </section>

            {/* Why Magic Room */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                            Why choose Magic Room
                        </h2>
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
                        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                            Who should use which tool
                        </h2>
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
                                Frequently asked questions
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
                            Explore{" "}
                            <Link href="/design" className="text-primary hover:underline">
                                196 AI design combinations
                            </Link>{" "}
                            across 14 styles and 14 room types, or read our{" "}
                            <Link href="/blog" className="text-primary hover:underline">
                                interior design blog
                            </Link>{" "}
                            for practical room redesign guides.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <CtaSection
                heading="Try Magic Room for free"
                subtext="Upload a photo of your room and generate your first AI redesign. One free credit included with every account."
            />
        </PageTransition>
    );
}

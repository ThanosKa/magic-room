"use client";

import React from "react";
import Link from "next/link";
import { Upload, Palette, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HeroComparison } from "@/components/hero-comparison";
import { PageTransition } from "@/components/page-transition";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
import { IDesignPageData, IThemeData, IRoomData } from "@/lib/seo/design-data";

interface DesignPageContentProps {
    page: IDesignPageData;
    themeData: IThemeData;
    roomData: IRoomData;
}

const STEPS = [
    {
        icon: Upload,
        title: "Upload your photo",
        description:
            "Take a photo of your room in good daylight and upload it directly from your phone or computer. No account required to try.",
    },
    {
        icon: Palette,
        title: "Select style and room type",
        description:
            "Choose your design theme and confirm the room type. Add any specific details or requirements in the optional text field.",
    },
    {
        icon: Download,
        title: "Download your designs",
        description:
            "The AI generates your redesigned room in 30 to 60 seconds. Review the result, and download or share as needed.",
    },
];

export function DesignPageContent({ page, themeData, roomData }: DesignPageContentProps) {
    const breadcrumbItems = [
        { name: "Home", href: "/" },
        { name: "Design Ideas", href: "/design" },
        { name: `${page.themeName} ${page.roomName}`, href: `/design/${page.slug}` },
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
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                            {page.themeName} {page.roomName} Design Ideas
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                            {page.intro}
                        </p>
                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Link href="/generate">
                                <Button
                                    size="lg"
                                    className="h-12 bg-primary px-8 text-lg hover:bg-primary/90 text-white"
                                >
                                    Generate {page.themeName} {page.roomName} Design
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Before/After */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                            See the transformation
                        </h2>
                        <HeroComparison
                            beforeImage={`/images/designs/before-${page.roomType}.jpg`}
                            afterImage={`/images/designs/${page.slug}.jpg`}
                            beforeFallback="/images/room-before.png"
                            afterFallback="/images/room-after.png"
                        />
                        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                            AI-generated {page.themeName.toLowerCase()} {page.roomName.toLowerCase()} redesign from a single photo
                        </p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                            How to get {page.themeName} {page.roomName} designs
                        </h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            {STEPS.map((step, index) => (
                                <Card
                                    key={index}
                                    className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <step.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                                            {index + 1}. {step.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {step.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Theme Tips */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                            {page.themeName} design principles
                        </h2>
                        <p className="mb-8 text-slate-600 dark:text-slate-400">
                            {themeData.description}
                        </p>
                        <div className="space-y-6">
                            {themeData.tips.map((tip, index) => (
                                <div key={index}>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        {tip.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {tip.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Room Considerations */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                            {page.roomName} design considerations
                        </h2>
                        <p className="mb-8 text-slate-600 dark:text-slate-400">
                            {roomData.description}
                        </p>
                        <div className="space-y-6">
                            {roomData.considerations.map((consideration, index) => (
                                <div key={index}>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        {consideration.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {consideration.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            {page.faqs.length > 0 && (
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                                Frequently asked questions
                            </h2>
                            <Accordion type="single" collapsible className="space-y-2">
                                {page.faqs.map((faq, index) => (
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

            {/* Cross-links to blog and alternatives */}
            <section className="bg-white py-8 dark:bg-slate-950">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Want more design guidance?{" "}
                            <Link href="/blog" className="text-primary hover:underline">
                                Read our interior design blog
                            </Link>{" "}
                            for practical AI room design guides. Or{" "}
                            <Link href="/alternatives" className="text-primary hover:underline">
                                compare Magic Room to other AI design tools
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <CtaSection
                heading={`Ready to redesign your ${page.roomName.toLowerCase()}?`}
                subtext={`Generate ${page.themeName.toLowerCase()} ${page.roomName.toLowerCase()} design ideas from a single photo. No design experience required.`}
                primaryLabel={`Generate ${page.themeName} Design`}
                secondaryLabel="View Pricing"
                secondaryHref="/pricing"
            />
        </PageTransition>
    );
}

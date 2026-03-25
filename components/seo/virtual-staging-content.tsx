"use client";

import React from "react";
import Link from "next/link";
import { Upload, Palette, Download, DollarSign, Clock, TrendingUp, Home, CheckCircle } from "lucide-react";
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

const STEPS = [
    {
        icon: Upload,
        title: "Upload the listing photo",
        description:
            "Take or use an existing photo of the empty or lived-in room. JPG, PNG, or WEBP files work. No special equipment required.",
    },
    {
        icon: Palette,
        title: "Select a staging style",
        description:
            "Choose from modern, Scandinavian, traditional, and more. You can also type specific instructions — 'warm neutral tones, linen sofa, oak floors'.",
    },
    {
        icon: Download,
        title: "Download your staged photo",
        description:
            "The AI returns a professionally staged version of your room in 30 to 60 seconds. Download and drop straight into your MLS listing.",
    },
];

const BENEFITS = [
    {
        icon: DollarSign,
        title: "Under $1 per staged photo",
        description:
            "Traditional home staging runs $2,000 to $5,000 per property and requires furniture rentals, movers, and a staging consultant. Magic Room costs a fraction of one credit.",
    },
    {
        icon: Clock,
        title: "Same-day turnaround",
        description:
            "No scheduling, no waiting for furniture delivery. Stage an entire listing in under 10 minutes and have photos ready before your next client call.",
    },
    {
        icon: TrendingUp,
        title: "Listings sell faster and for more",
        description:
            "Staged homes sell 73% faster on average and command 1–5% higher sale prices according to the National Association of Realtors. AI staging delivers those same buyer psychology benefits.",
    },
    {
        icon: Home,
        title: "Stage empty or cluttered rooms",
        description:
            "Works on vacant properties, occupied homes, or outdated interiors. Show buyers the potential of any space without a single piece of physical furniture.",
    },
];

const FAQS = [
    {
        question: "What is AI virtual staging?",
        answer:
            "AI virtual staging uses generative AI to digitally furnish and decorate a room photo. You upload an image of an empty or unfurnished space and the AI returns a photo-realistic version with furniture, lighting, and decor appropriate to the style you selected. The result can be used directly in MLS listings, property websites, or marketing materials.",
    },
    {
        question: "How much does AI virtual staging cost compared to traditional staging?",
        answer:
            "Traditional professional staging typically costs $2,000 to $5,000 per property, covering a staging consultation, furniture rental, and moving fees. AI virtual staging with Magic Room costs less than $1 per photo. A pack of 10 credits covers ten staged images for a few dollars — a fraction of what you would pay a staging company even for a single room.",
    },
    {
        question: "Can I use the staged images in my MLS listing?",
        answer:
            "Yes. The images you generate are yours to use in MLS listings, property portals, social media, and print marketing. Most MLS systems require a disclosure that images are virtually staged — always check your local board requirements and add a 'virtually staged' label to stay compliant.",
    },
    {
        question: "Does Magic Room store or share my listing photos?",
        answer:
            "No. Images are converted to base64 in your browser, sent directly to the AI model, and processed entirely in memory. Nothing is written to a database or file store. Your listing photos never persist on our servers and are never used to train AI models.",
    },
    {
        question: "What types of properties and rooms does it work best for?",
        answer:
            "AI virtual staging works across all residential property types — single-family homes, condos, apartments, and vacation rentals. It performs best on living rooms, bedrooms, dining rooms, and home offices. For best results, use a photo taken in good natural light with a clear view of the entire room.",
    },
    {
        question: "How many photos can I stage per listing?",
        answer:
            "There is no per-listing limit. Each generation uses one credit. A typical listing might require 3 to 8 key room photos. You can buy credit packs that work out to well under $1 per staged image, making it practical to stage every important room in a property.",
    },
];

export function VirtualStagingContent() {
    const breadcrumbItems = [
        { name: "Home", href: "/" },
        { name: "Virtual Staging", href: "/virtual-staging" },
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
            <section className="bg-white py-12 dark:bg-slate-950 md:py-20">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            For real estate agents
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                            AI Virtual Staging for Real Estate
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                            Stage any listing photo in 60 seconds for under $1. Replace $2,000–$5,000 traditional staging
                            costs with AI that furnishes rooms photo-realistically — no furniture trucks, no scheduling, no waiting.
                        </p>
                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Link href="/generate">
                                <Button
                                    size="lg"
                                    className="h-12 bg-primary px-8 text-lg hover:bg-primary/90 text-white"
                                >
                                    Try Free Virtual Staging
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                            One free credit included — no credit card required
                        </p>
                    </div>
                </div>
            </section>

            {/* Pain point banner */}
            <section className="bg-slate-50 py-10 dark:bg-slate-900/50">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-4xl">
                        <div className="grid gap-4 sm:grid-cols-3 text-center">
                            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">$2,000–$5,000</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Traditional staging cost per property</p>
                            </div>
                            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 dark:bg-primary/10">
                                <p className="text-3xl font-bold text-primary">Under $1</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">AI virtual staging cost per photo</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">60 seconds</p>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Time to a staged photo with AI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Before / After */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                            See the difference AI staging makes
                        </h2>
                        <HeroComparison
                            beforeImage="/images/room-before.png"
                            afterImage="/images/room-after.png"
                            beforeAlt="Empty room before AI virtual staging"
                            afterAlt="Room after AI virtual staging — furnished and styled"
                        />
                        <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                            AI-generated staging from a single photo — no physical furniture required
                        </p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                            How AI home staging works
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

            {/* Benefits for agents */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-4xl">
                        <h2 className="mb-4 text-center text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                            Why real estate agents choose AI staging
                        </h2>
                        <p className="mb-10 text-center text-slate-600 dark:text-slate-400">
                            Professional results without the professional price tag or scheduling headaches.
                        </p>
                        <div className="grid gap-6 md:grid-cols-2">
                            {BENEFITS.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <benefit.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Who it is for */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                            Built for real estate professionals
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                "Independent agents and solo brokers who list multiple properties a month",
                                "Property managers preparing vacation rentals or long-term rentals for market",
                                "New construction developers selling units before physical staging is possible",
                                "Real estate photographers who offer staging as an add-on service",
                                "Sellers who want to maximise listing price without staging spend",
                                "Estate agents working with vacant or inherited properties",
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{item}</p>
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
                        <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                            Frequently asked questions
                        </h2>
                        <Accordion type="single" collapsible className="space-y-2">
                            {FAQS.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`faq-${index}`}
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-4 dark:border-slate-800 dark:bg-slate-900"
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

            {/* Related links */}
            <section className="bg-slate-50 py-10 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                            Explore design styles for staging
                        </h2>
                        <ul className="flex flex-wrap gap-3">
                            <li>
                                <Link href="/design/modern-living-room" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                    Modern Living Room
                                </Link>
                            </li>
                            <li>
                                <Link href="/design/scandinavian-bedroom" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                    Scandinavian Bedroom
                                </Link>
                            </li>
                            <li>
                                <Link href="/design/minimalist-living-room" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                    Minimalist Living Room
                                </Link>
                            </li>
                            <li>
                                <Link href="/design" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                                    View all design styles →
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <CtaSection
                heading="Try free AI virtual staging today"
                subtext="Upload a listing photo and get a professionally staged version in 60 seconds. One free credit included with every account — no credit card required."
                primaryLabel="Try Free Virtual Staging"
                primaryHref="/generate"
                secondaryLabel="View Pricing"
                secondaryHref="/pricing"
            />
        </PageTransition>
    );
}

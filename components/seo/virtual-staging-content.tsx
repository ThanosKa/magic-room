"use client";

import React from "react";
import Link from "next/link";
import { Upload, Palette, Download, DollarSign, Clock, TrendingUp, Home, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CompareSlider } from "@/components/compare-slider";
import { PageTransition } from "@/components/page-transition";
import { CtaSection } from "@/components/seo/cta-section";
import {
    BODY_CLASS,
    CHIP_CLASS,
    H1_CLASS,
    H2_CLASS,
    H3_CLASS,
    ComparisonHero,
    LEAD_CLASS,
    PageBreadcrumb,
    Section,
    Split,
} from "@/components/seo/comparison-layout";
import { cn } from "@/lib/utils";

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
            <PageBreadcrumb items={breadcrumbItems} />

            {/* Hero */}
            <ComparisonHero>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 text-sm text-ink-2">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                    For real estate agents
                </div>
                <h1 className={H1_CLASS}>AI Virtual Staging for Real Estate</h1>
                <p className={cn(LEAD_CLASS, "mt-6")}>
                    Stage any listing photo in 60 seconds for under $1. Replace $2,000–$5,000 traditional staging
                    costs with AI that furnishes rooms photo-realistically — no furniture trucks, no scheduling, no waiting.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg">
                        <Link href="/generate">Try Free Virtual Staging</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link href="/pricing">View Pricing</Link>
                    </Button>
                </div>
                <p className="mt-4 text-sm text-ink-3">
                    One free credit included — no credit card required
                </p>
            </ComparisonHero>

            {/* Pain point banner */}
            <Section>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-line p-6">
                        <p className="font-serif text-[34px] leading-none tracking-[-0.02em] text-ink">$2,000–$5,000</p>
                        <p className="mt-3 text-sm text-ink-2">Traditional staging cost per property</p>
                    </div>
                    <div className="rounded-xl border border-line bg-paper-2 p-6">
                        <p className="font-serif text-[34px] leading-none tracking-[-0.02em] text-ink">
                            <span aria-hidden="true" className="mr-2 inline-block size-1.5 -translate-y-1.5 rounded-full bg-accent align-middle" />
                            Under $1
                        </p>
                        <p className="mt-3 text-sm text-ink-2">AI virtual staging cost per photo</p>
                    </div>
                    <div className="rounded-xl border border-line p-6">
                        <p className="font-serif text-[34px] leading-none tracking-[-0.02em] text-ink">60 seconds</p>
                        <p className="mt-3 text-sm text-ink-2">Time to a staged photo with AI</p>
                    </div>
                </div>
            </Section>

            {/* Before / After */}
            <section className="pb-16 md:pb-24">
                <div className="container-page">
                    <div className="mx-auto max-w-5xl">
                        <h2 className={cn(H2_CLASS, "mb-8")}>See the difference AI staging makes</h2>
                        <CompareSlider
                            before={{ src: "/images/room-before.png", alt: "Empty room before AI virtual staging" }}
                            after={{
                                src: "/images/room-after.png",
                                alt: "Room after AI virtual staging — furnished and styled",
                            }}
                            sizes="(min-width: 1072px) 1024px, 100vw"
                            priority
                            className="rounded-3xl md:aspect-[16/10]"
                        />
                        <p className="mt-4 text-sm text-ink-3">
                            AI-generated staging from a single photo — no physical furniture required
                        </p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <Section tone="band">
                <h2 className={cn(H2_CLASS, "mb-10")}>How AI home staging works</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {STEPS.map((step, index) => (
                        <div key={index} className="rounded-xl border border-line bg-paper p-6">
                            <div className="mb-5 flex size-10 items-center justify-center rounded-full bg-ink/5">
                                <step.icon aria-hidden="true" className="size-5 text-ink" />
                            </div>
                            <h3 className={cn(H3_CLASS, "mb-2")}>
                                {index + 1}. {step.title}
                            </h3>
                            <p className="text-[15px] leading-relaxed text-ink-2">{step.description}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Benefits for agents */}
            <Section rule={false}>
                <Split
                    heading="Why real estate agents choose AI staging"
                    intro="Professional results without the professional price tag or scheduling headaches."
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        {BENEFITS.map((benefit, index) => (
                            <div key={index} className="rounded-xl border border-line p-6">
                                <benefit.icon aria-hidden="true" className="mb-4 size-5 text-ink" />
                                <h3 className={cn(H3_CLASS, "mb-2 !text-[22px]")}>{benefit.title}</h3>
                                <p className="text-[15px] leading-relaxed text-ink-2">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </Split>
            </Section>

            {/* Who it is for */}
            <Section>
                <Split heading="Built for real estate professionals">
                    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                        {[
                            "Independent agents and solo brokers who list multiple properties a month",
                            "Property managers preparing vacation rentals or long-term rentals for market",
                            "New construction developers selling units before physical staging is possible",
                            "Real estate photographers who offer staging as an add-on service",
                            "Sellers who want to maximise listing price without staging spend",
                            "Estate agents working with vacant or inherited properties",
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                                <p className={cn(BODY_CLASS, "text-[15px]")}>{item}</p>
                            </div>
                        ))}
                    </div>
                </Split>
            </Section>

            {/* FAQ */}
            <Section>
                <Split heading="Frequently asked questions">
                    <Accordion type="single" collapsible className="border-t border-line">
                        {FAQS.map((faq, index) => (
                            <AccordionItem key={index} value={`faq-${index}`}>
                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Split>
            </Section>

            {/* Related links */}
            <Section>
                <h2 className={cn(H3_CLASS, "mb-5")}>Explore design styles for staging</h2>
                <ul className="flex flex-wrap gap-3">
                    <li>
                        <Link href="/design/modern-living-room" className={CHIP_CLASS}>
                            Modern Living Room
                        </Link>
                    </li>
                    <li>
                        <Link href="/design/scandinavian-bedroom" className={CHIP_CLASS}>
                            Scandinavian Bedroom
                        </Link>
                    </li>
                    <li>
                        <Link href="/design/scandinavian-living-room" className={CHIP_CLASS}>
                            Scandinavian Living Room
                        </Link>
                    </li>
                    <li>
                        <Link href="/design/coastal-living-room" className={CHIP_CLASS}>
                            Coastal living room design ideas
                        </Link>
                    </li>
                    <li>
                        <Link href="/design/farmhouse-kitchen" className={CHIP_CLASS}>
                            Farmhouse kitchen design ideas
                        </Link>
                    </li>
                    <li>
                        <Link href="/design" className={CHIP_CLASS}>
                            All 196 AI interior design combinations
                        </Link>
                    </li>
                </ul>

                <h2 className={cn(H3_CLASS, "mb-5 mt-12")}>Compare staging and redesign tools</h2>
                <ul className="flex flex-wrap gap-3">
                    <li>
                        <Link href="/alternatives" className={CHIP_CLASS}>
                            RoomGPT alternatives compared
                        </Link>
                    </li>
                    <li>
                        <Link href="/alternatives/decorai" className={CHIP_CLASS}>
                            DecorAI alternative
                        </Link>
                    </li>
                    <li>
                        <Link href="/alternatives/reimaginehome" className={CHIP_CLASS}>
                            Reimagine Home alternative
                        </Link>
                    </li>
                    <li>
                        <Link href="/blog/virtual-staging-real-estate-guide" className={CHIP_CLASS}>
                            Virtual staging for real estate: worth it in 2026?
                        </Link>
                    </li>
                    <li>
                        <Link href="/blog/ai-home-staging-before-selling" className={CHIP_CLASS}>
                            AI home staging before selling
                        </Link>
                    </li>
                    <li>
                        <Link href="/gallery" className={CHIP_CLASS}>
                            AI room design gallery
                        </Link>
                    </li>
                </ul>
            </Section>

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

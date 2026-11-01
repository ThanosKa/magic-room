"use client";

import React from "react";
import Link from "next/link";
import { ICompetitorData } from "@/lib/seo/competitor-data";
import { IContextualLink } from "@/lib/seo/internal-links";
import { CtaSection } from "@/components/seo/cta-section";
import { RelatedLinks } from "@/components/seo/related-links";
import { PageTransition } from "@/components/page-transition";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    AccentDot,
    BODY_CLASS,
    CHIP_CLASS,
    ComparisonHero,
    CompareTable,
    H1_CLASS,
    H2_CLASS,
    H3_CLASS,
    LEAD_CLASS,
    LINK_CLASS,
    PageBreadcrumb,
    Rule,
    Section,
    Split,
} from "@/components/seo/comparison-layout";

interface VsRow {
    feature: string;
    magicRoom: string;
    competitor: string;
}

const VS_ROWS: VsRow[] = [
    {
        feature: "AI model",
        magicRoom: "Google Gemini and OpenAI multimodal",
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
    /** Subset of otherCompetitors that still have a live (non-redirecting) /vs page. */
    vsSiblings?: ICompetitorData[];
    designLinks?: IContextualLink[];
    blogLinks?: IContextualLink[];
}

export function VsPageContent({
    competitor,
    otherCompetitors = [],
    vsSiblings = [],
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
            <PageBreadcrumb items={breadcrumbItems} />

            {/* Hero */}
            <ComparisonHero>
                <h1 className={H1_CLASS}>Magic Room vs {competitor.name}</h1>
                <p
                    className={`${LEAD_CLASS} mt-8 animate-rise motion-reduce:animate-none`}
                    style={{ animationDelay: "120ms" }}
                >
                    Magic Room and {competitor.name} both redesign a room from a single photo. They
                    differ in three ways that matter: the AI model behind them, whether your uploaded
                    photo is stored, and whether you pay once or every month.
                </p>

                {/* Direct answer block */}
                <div
                    className="mt-10 animate-rise rounded-2xl bg-paper-2 p-6 motion-reduce:animate-none md:p-8"
                    style={{ animationDelay: "220ms" }}
                >
                    <h2 className="font-serif text-[26px] font-normal leading-tight tracking-[-0.01em] text-ink text-balance md:text-[30px]">
                        Which is better, Magic Room or {competitor.name}?
                    </h2>
                    <p className={`${BODY_CLASS} mt-3`}>
                        Magic Room is the better choice if photo privacy and one-time pricing matter to
                        you: it runs Google Gemini and OpenAI image models for architecturally accurate results,
                        never stores your uploaded photos, and sells one-time credits from €9.99 instead
                        of a subscription. {competitor.name} is the better choice if you need its
                        specific extra features or already have a workflow built around it.
                    </p>
                </div>
            </ComparisonHero>

            {/* Comparison table */}
            <Section tone="band">
                <h2 className={`${H2_CLASS} max-w-3xl`}>
                    Magic Room vs {competitor.name}: side-by-side comparison
                </h2>
                <p className={`${BODY_CLASS} mb-10 mt-5 max-w-3xl`}>
                    The table below compares both tools on the seven factors people actually decide on.
                    Competitor plans change over time — check {competitor.name}&apos;s own pricing page
                    for their current figures.
                </p>
                <CompareTable
                    columns={[
                        { label: "Feature", mobileLabel: "Feature", className: "w-[28%]" },
                        {
                            label: "Magic Room",
                            mobileLabel: "Magic Room",
                            highlight: true,
                            className: "w-[36%]",
                        },
                        { label: competitor.name, mobileLabel: competitor.name },
                    ]}
                    rows={VS_ROWS.map((row, index) => ({
                        key: String(index),
                        cells: [row.feature, row.magicRoom, row.competitor],
                    }))}
                />
            </Section>

            {/* Who each is best for */}
            <Section rule={false}>
                <h2 className={`${H2_CLASS} max-w-[24ch]`}>
                    Who should use Magic Room and who should use {competitor.name}?
                </h2>
                <p className={`${BODY_CLASS} mb-10 mt-5 max-w-3xl`}>
                    Pick Magic Room for interior rooms where privacy, one-time pricing, and preserving
                    the real layout matter. Pick {competitor.name} when you need something outside that
                    scope or are already committed to its platform.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-night p-7 text-cream md:p-8">
                        <h3 className="font-serif text-[26px] font-normal leading-tight tracking-[-0.01em] text-cream">
                            <AccentDot className="mr-3" />
                            Magic Room is best for:
                        </h3>
                        <ul className="mt-5 text-[15px] leading-relaxed text-cream-2">
                            <li className="border-t border-cream/15 py-3">Users who want privacy guarantees around uploaded room photos</li>
                            <li className="border-t border-cream/15 py-3">Anyone who prefers pay-as-you-go credits over a monthly subscription</li>
                            <li className="border-t border-cream/15 py-3">People who want results that preserve the physical structure of their room</li>
                            <li className="border-t border-cream/15 pt-3">Homeowners redesigning one or several rooms without a recurring commitment</li>
                        </ul>
                    </div>
                    <div className="rounded-2xl bg-paper-2 p-7 md:p-8">
                        <h3 className="font-serif text-[26px] font-normal leading-tight tracking-[-0.01em] text-ink">
                            {competitor.name} is best for:
                        </h3>
                        <ul className="mt-5 text-[15px] leading-relaxed text-ink-2">
                            <li className="border-t border-line py-3">Users already familiar with the tool who do not want to switch platforms</li>
                            <li className="border-t border-line py-3">Anyone who wants to browse an established library of generated examples</li>
                            <li className="border-t border-line py-3">Users with use cases that extend beyond interior room redesign</li>
                            <li className="border-t border-line pt-3">People who prefer a subscription model for predictable monthly access</li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* FAQ */}
            {competitor.faqs.length > 0 && (
                <Section>
                    <Split heading={<>Common questions about Magic Room vs {competitor.name}</>}>
                        <Accordion type="single" collapsible className="border-t border-line">
                            {competitor.faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`faq-${index}`}>
                                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                                    <AccordionContent>{faq.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </Split>
                </Section>
            )}

            {/* Pricing mechanics — the pricing query cluster ("reimagine home
                pricing 2026", "interior ai pricing 2026", "roomgpt pricing
                2026") lands on these pages and previously found nothing. */}
            <Section>
                <Split
                    heading={<>{competitor.name} pricing vs Magic Room pricing</>}
                    intro={
                        <>
                            Rates change; billing mechanics do not. These are the parts that decide what you
                            actually pay. For {competitor.name}&apos;s current rate, check{" "}
                            <a
                                href={competitor.pricingModel.officialPricingUrl}
                                className={LINK_CLASS}
                                rel="nofollow noopener"
                                target="_blank"
                            >
                                their own pricing page
                            </a>
                            .
                        </>
                    }
                >
                    <dl className="border-b border-line">
                        {[
                            {
                                term: "How you are billed",
                                magicRoom:
                                    "One-time credit packs from €9.99 for 20 credits. No subscription.",
                                competitor: competitor.pricingModel.billing,
                            },
                            {
                                term: "Free tier",
                                magicRoom: "1 credit on signup, no card, one redesign from it.",
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
                            <div key={row.term} className="border-t border-line py-6">
                                <dt className={H3_CLASS}>{row.term}</dt>
                                <dd className="mt-4 rounded-lg bg-paper-2 px-4 py-3 text-[15px] leading-relaxed text-ink">
                                    <span className="font-medium text-ink">
                                        <AccentDot />
                                        Magic Room:{" "}
                                    </span>
                                    {row.magicRoom}
                                </dd>
                                <dd className="mt-2 px-4 text-[15px] leading-relaxed text-ink-2">
                                    <span className="font-medium text-ink">{competitor.name}: </span>
                                    {row.competitor}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <p className={`${BODY_CLASS} mt-6 text-[15px]`}>
                        Full detail on switching, including what carries over, is on the{" "}
                        <Link href={`/alternatives/${competitor.slug}`} className={LINK_CLASS}>
                            {competitor.name} alternative
                        </Link>{" "}
                        page, and Magic Room&apos;s own packs are listed on{" "}
                        <Link href="/pricing" className={LINK_CLASS}>
                            the credit pricing page
                        </Link>
                        .
                    </p>
                </Split>
            </Section>

            {/* Sibling comparison pages.
                /vs/decorai, /vs/interior-ai and /vs/reimaginehome each had
                exactly one inbound internal link — the /alternatives hub. The
                four head-to-head pages now form a closed cluster. */}
            <Section>
                {vsSiblings.length > 0 && (
                    <>
                        <h2 className={H3_CLASS}>Other head-to-head comparisons</h2>
                        <ul className="mt-5 flex flex-wrap gap-2.5">
                            {vsSiblings.map((c) => (
                                <li key={`vs-${c.slug}`}>
                                    <Link href={`/vs/${c.slug}`} className={CHIP_CLASS}>
                                        Magic Room vs {c.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                <h2 className={`${H3_CLASS} mt-10 first:mt-0`}>Looking for a straight replacement?</h2>
                <ul className="mt-5 flex flex-wrap gap-2.5">
                    <li>
                        <Link href={`/alternatives/${competitor.slug}`} className={CHIP_CLASS}>
                            {competitor.name} alternative
                        </Link>
                    </li>
                    {otherCompetitors.map((c) => (
                        <li key={`alt-${c.slug}`}>
                            <Link href={`/alternatives/${c.slug}`} className={CHIP_CLASS}>
                                {c.name} alternative
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link href="/alternatives" className={CHIP_CLASS}>
                            All RoomGPT alternatives compared
                        </Link>
                    </li>
                </ul>
            </Section>

            {designLinks.length > 0 && <Rule />}
            <RelatedLinks
                heading="Try these styles on your own room"
                links={designLinks}
                className="py-16 md:py-24"
            />

            {blogLinks.length > 0 && <Rule />}
            <RelatedLinks
                heading="Further reading on AI interior design"
                links={blogLinks}
                className="pt-16 md:pt-24"
            />

            <CtaSection
                heading={`Try Magic Room free — see how it compares to ${competitor.name}`}
                subtext="Generate your first AI room redesign with one free credit. No subscription required."
            />
        </PageTransition>
    );
}

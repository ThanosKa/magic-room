"use client";

import React from "react";
import Link from "next/link";
import { ICompetitorData } from "@/lib/seo/competitor-data";
import { IContextualLink } from "@/lib/seo/internal-links";
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
    Rule,
    Section,
    Split,
} from "@/components/seo/comparison-layout";

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
            <PageBreadcrumb items={breadcrumbItems} />

            {/* Hero */}
            <ComparisonHero>
                <h1 className={H1_CLASS}>Best {competitor.name} Alternative</h1>
                <div className="animate-rise motion-reduce:animate-none" style={{ animationDelay: "120ms" }}>
                    <p className={`${LEAD_CLASS} mt-8`}>
                        Magic Room is the closest {competitor.name} alternative for anyone who wants the
                        same upload-a-photo workflow without the trade-offs. It runs Google Gemini and
                        OpenAI image models so your room&apos;s actual layout survives the redesign, never stores
                        your uploaded photo, and costs €9.99 one-time for 20 credits instead of a
                        subscription.
                    </p>
                    <p className={`${BODY_CLASS} mt-5`}>
                        {competitor.description} Below is how the two tools compare on AI model, photo
                        privacy, pricing, and who each one suits.
                    </p>
                </div>
            </ComparisonHero>

            {/* About the competitor */}
            <Section>
                <h2 className={H2_CLASS}>What is {competitor.name}?</h2>
                <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-12">
                    <div>
                        <h3 className={H3_CLASS}>What {competitor.name} does well</h3>
                        <ul className="mt-5 border-b border-line">
                            {competitor.pros.map((pro, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 border-t border-line py-3 text-[15px] leading-relaxed text-ink-2"
                                >
                                    <span className="w-3 shrink-0 font-medium text-accent">+</span>
                                    {pro}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className={H3_CLASS}>Where {competitor.name} falls short</h3>
                        <ul className="mt-5 border-b border-line">
                            {competitor.cons.map((con, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-3 border-t border-line py-3 text-[15px] leading-relaxed text-ink-2"
                                >
                                    <span className="w-3 shrink-0 text-ink-3">-</span>
                                    {con}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mt-10 rounded-2xl bg-paper-2 p-6 md:p-8">
                    <p className={LABEL_CLASS}>Pricing</p>
                    <p className={`${BODY_CLASS} mt-2 max-w-3xl`}>{competitor.pricing}</p>
                </div>
            </Section>

            {/* Why people look for an alternative — validates the searcher's
                reason for being here before pitching anything. */}
            <Section>
                <Split
                    heading={<>Why people look for a {competitor.name} alternative</>}
                    intro={
                        <>
                            These are the reasons that come up repeatedly. Not all of them will apply to
                            you — if none of them do, {competitor.name} is probably fine and you can stop
                            reading here.
                        </>
                    }
                >
                    <ul className="border-b border-line">
                        {competitor.whySwitch.map((reason, i) => (
                            <li
                                key={i}
                                className="border-t border-line py-5 text-[17px] leading-relaxed tracking-[-0.01em] text-ink"
                            >
                                {reason}
                            </li>
                        ))}
                    </ul>
                </Split>
            </Section>

            {/* Comparison table */}
            <Section>
                <h2 className={`${H2_CLASS} mb-10 max-w-3xl`}>
                    Feature comparison: Magic Room vs {competitor.name}
                </h2>
                <FeatureComparisonTable
                    competitorName={competitor.name}
                    competitorPricing={competitor.pricing}
                />
            </Section>

            {/* Pricing mechanics.
                A large share of the impressions these pages already earn come
                from pricing queries — "reimagine home pricing 2026",
                "interior ai pricing 2026", "roomgpt pricing 2026" — which the
                page previously answered with a single vague sentence. */}
            <Section tone="band">
                <h2 className={`${H2_CLASS} max-w-[26ch]`}>
                    {competitor.name} pricing vs Magic Room pricing: how you actually get charged
                </h2>
                <p className={`${BODY_CLASS} mb-10 mt-5 max-w-3xl`}>
                    Headline prices on AI design tools change often, so the table below compares the
                    billing <em>mechanics</em> rather than quoting figures that go stale. These are the
                    parts that decide what you end up paying. For {competitor.name}&apos;s current rate,
                    check{" "}
                    <a
                        href={competitor.pricingModel.officialPricingUrl}
                        className={LINK_CLASS}
                        rel="nofollow noopener"
                        target="_blank"
                    >
                        their own pricing page
                    </a>
                    .
                </p>
                <CompareTable
                    columns={[
                        {
                            label: "What decides the cost",
                            mobileLabel: "What decides the cost",
                            className: "w-1/4",
                        },
                        { label: "Magic Room", mobileLabel: "Magic Room", highlight: true },
                        { label: competitor.name, mobileLabel: competitor.name },
                    ]}
                    rows={[
                        {
                            label: "How you are billed",
                            magicRoom:
                                "One-time credit packages: €9.99 for 20 credits, €19.99 and €29.99 for larger packs. No subscription exists to cancel.",
                            competitor: competitor.pricingModel.billing,
                        },
                        {
                            label: "Free tier",
                            magicRoom:
                                "1 free credit on signup, no card required. One credit produces a full redesign, so you see real output before paying.",
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
                                "Full commercial rights on every design, free credit included. No tier gate.",
                            competitor: competitor.pricingModel.commercialRights,
                        },
                        {
                            label: "If you stop paying",
                            magicRoom:
                                "Nothing changes — there is no recurring charge. Any credits you already bought stay on the account.",
                            competitor: competitor.pricingModel.ifYouStopPaying,
                        },
                        {
                            label: "Cost of 20 designs",
                            magicRoom: "€9.99 total, about €0.50 per Quick design, paid once.",
                            competitor:
                                "One or more billing periods at the plan rate, depending on the monthly allocation. Multiply the monthly price by the number of months needed to accumulate 30 generations.",
                        },
                    ].map((row, index) => ({
                        key: String(index),
                        cells: [row.label, row.magicRoom, row.competitor],
                    }))}
                />
                <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink-2">
                    The practical rule: recurring plans are better value if you redesign every month,
                    one-time credits are better value if you redesign in bursts. Most homeowners
                    redesign in bursts.{" "}
                    <Link href="/pricing" className={LINK_CLASS}>
                        See Magic Room credit pack pricing
                    </Link>
                    .
                </p>
            </Section>

            {/* Why Magic Room */}
            <Section rule={false}>
                <Split
                    heading={<>Why choose Magic Room over {competitor.name}?</>}
                    intro={
                        <>
                            Three differences decide it for most people: Magic Room never stores your room
                            photo, it charges one-time credits from €9.99 rather than a subscription, and it
                            uses a multimodal model that preserves your room&apos;s real geometry. In detail:
                        </>
                    }
                >
                    <ul className="border-b border-line">
                        {competitor.magicRoomAdvantages.map((advantage, i) => (
                            <li key={i} className="flex items-baseline gap-5 border-t border-line py-5">
                                <span className="w-8 shrink-0 font-serif text-[32px] leading-none text-ink-3">
                                    {i + 1}
                                </span>
                                <p className="text-base leading-relaxed text-ink-2">{advantage}</p>
                            </li>
                        ))}
                    </ul>
                </Split>
            </Section>

            {/* Who is it for */}
            <Section>
                <h2 className={`${H2_CLASS} max-w-[24ch]`}>
                    Should you switch from {competitor.name} to Magic Room?
                </h2>
                <p className={`${BODY_CLASS} mb-10 mt-5 max-w-3xl`}>
                    Switch if photo privacy, one-time pricing, or accurate room geometry matter to
                    you. There is nothing to migrate — Magic Room works from the same room photo, so
                    you can test it on one image with the free credit before deciding. Stay on{" "}
                    {competitor.name} if you need features it has and Magic Room does not.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-night p-7 text-cream md:p-8">
                        <h3 className="font-serif text-[26px] font-normal leading-tight tracking-[-0.01em] text-cream">
                            <AccentDot className="mr-3" />
                            Choose Magic Room if you:
                        </h3>
                        <ul className="mt-5 text-[15px] leading-relaxed text-cream-2">
                            <li className="border-t border-cream/15 py-3">Want privacy guarantees around your room photos</li>
                            <li className="border-t border-cream/15 py-3">Prefer a one-time credit purchase over a subscription</li>
                            <li className="border-t border-cream/15 py-3">Want outputs that preserve your room&apos;s physical structure accurately</li>
                            <li className="border-t border-cream/15 pt-3">Need consistent results without multiple regeneration attempts</li>
                        </ul>
                    </div>
                    <div className="rounded-2xl bg-paper-2 p-7 md:p-8">
                        <h3 className="font-serif text-[26px] font-normal leading-tight tracking-[-0.01em] text-ink">
                            Consider {competitor.name} if you:
                        </h3>
                        <ul className="mt-5 text-[15px] leading-relaxed text-ink-2">
                            <li className="border-t border-line py-3">Already have an account and familiarity with the tool</li>
                            <li className="border-t border-line py-3">Specifically need features unique to {competitor.name}</li>
                            <li className="border-t border-line py-3">Want to browse a large library of previous generations for reference</li>
                            <li className="border-t border-line pt-3">Have a use case outside of residential interior room redesign</li>
                        </ul>
                    </div>
                </div>
            </Section>

            {/* FAQ */}
            {competitor.faqs.length > 0 && (
                <Section>
                    <Split heading={<>{competitor.name} alternative: frequently asked questions</>}>
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

            {/* Migration — what switching actually involves. */}
            <Section>
                <Split heading={<>How to switch from {competitor.name} to Magic Room</>}>
                    <p className={BODY_CLASS}>{competitor.migration}</p>
                    <ol className="mt-8 list-decimal space-y-4 pl-7 text-base leading-relaxed text-ink-2 marker:font-serif marker:text-[20px] marker:text-ink-3">
                        <li className="pl-2">
                            Create a Magic Room account. One free credit is added automatically — no card
                            required.
                        </li>
                        <li className="pl-2">
                            Upload the same room photo you last ran through {competitor.name}, so the
                            comparison is like for like.
                        </li>
                        <li className="pl-2">
                            Pick a room type and one of the 14 design themes, and add any specifics
                            (&ldquo;keep the fireplace&rdquo;, &ldquo;warm tones only&rdquo;) in the
                            optional prompt field.
                        </li>
                        <li className="pl-2">
                            Compare the two outputs on one question: does the redesign still show{" "}
                            <em>your</em> walls, windows and proportions? That is where the multimodal and
                            diffusion approaches diverge.
                        </li>
                        <li className="pl-2">
                            Only cancel your {competitor.name} plan once you have compared — and use any
                            credits you have already paid for first.
                        </li>
                    </ol>
                </Split>
            </Section>

            {/* Also compare — anchors fixed.
                These links point at /alternatives/[slug] but previously used the
                anchor "Magic Room vs [name]", which is the /vs/[slug] page's
                query phrase. Anchor and target now match, and the head-to-head
                page gets its own link instead of none. */}
            {otherCompetitors.length > 0 && (
                <Section>
                    <h2 className={H3_CLASS}>Compare other AI interior design tools</h2>
                    <ul className="mt-5 flex flex-wrap gap-2.5">
                        {otherCompetitors.map((c) => (
                            <li key={c.slug}>
                                <Link href={`/alternatives/${c.slug}`} className={CHIP_CLASS}>
                                    {c.name} alternative
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <h3 className={`${H3_CLASS} mt-10`}>
                        {vsCompetitors.length > 0 ? "Head-to-head comparisons" : "More comparisons"}
                    </h3>
                    <ul className="mt-5 flex flex-wrap gap-2.5">
                        {vsCompetitors.map((c) => (
                            <li key={c.slug}>
                                <Link href={`/vs/${c.slug}`} className={CHIP_CLASS}>
                                    Magic Room vs {c.name}
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
            )}

            {/* Comparison cluster -> design catalogue. Previously the four
                comparison pages linked to no design page at all. */}
            {designLinks.length > 0 && <Rule />}
            <RelatedLinks
                heading="Try these styles on your own room"
                intro="Every design page shows the style applied to a real room and generates the same on a photo of yours."
                links={designLinks}
                className="py-16 md:py-24"
            />

            {blogLinks.length > 0 && <Rule />}
            <RelatedLinks
                heading="Further reading on AI interior design"
                links={blogLinks}
                className="pt-16 md:pt-24"
            />

            {/* CTA */}
            <CtaSection
                heading="Try Magic Room for free"
                subtext="Upload a photo of your room and generate your first AI redesign. One free credit included with every account."
            />
        </PageTransition>
    );
}

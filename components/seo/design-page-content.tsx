import React from "react";
import Link from "next/link";
import { ArrowRight, Upload, Palette, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { CompareSlider } from "@/components/compare-slider";
import { PageTransition } from "@/components/page-transition";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
import { DesignTile } from "@/components/seo/design-tile";
import { RelatedLinks } from "@/components/seo/related-links";
import { IDesignPageData, IThemeData, IRoomData } from "@/lib/seo/design-data";
import { IContextualLink } from "@/lib/seo/internal-links";
import { generateHref } from "@/lib/design-selection";

interface DesignPageContentProps {
    page: IDesignPageData;
    themeData: IThemeData;
    roomData: IRoomData;
    otherThemes: IThemeData[];
    otherRooms: IRoomData[];
    relatedBlogLinks?: IContextualLink[];
    comparisonLinks?: IContextualLink[];
    /** Rotating chips into the indexable design pages with the fewest siblings. */
    moreDesignLinks?: IContextualLink[];
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

// Shared type for the section headings below the hero.
const H2 = "font-serif text-[clamp(34px,4vw,56px)] font-normal leading-none tracking-[-0.022em] text-ink text-balance";
// Long-form copy (design principles, deep dive): ink at 82% like the blog body.
const BODY_TEXT = "text-[17px] leading-[1.7] text-ink/[0.82]";
// Sibling tiles: 2 columns on phones, 3 from 640px (up to 1144px wide).
const TILE_SIZES = "(min-width: 1024px) 370px, (min-width: 640px) 31vw, 47vw";
const TEXT_LINK =
    "inline-flex min-h-11 items-center text-[15px] font-medium tracking-[-0.01em] text-ink underline decoration-ink/30 decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-ink motion-reduce:transition-none";

/**
 * Two-column editorial block: heading and lead paragraph on the left (sticky on
 * desktop), a hairline list of titled items on the right. Used for the style's
 * design principles and the room's considerations.
 */
function PrinciplesSection({
    heading,
    lead,
    items,
    divider = true,
}: {
    heading: string;
    lead: string;
    items: { title: string; description: string }[];
    /** Hairline above the block; off when it follows a band. */
    divider?: boolean;
}) {
    return (
        <section className="container-page">
            <div
                className={`mx-auto grid max-w-5xl items-start gap-8 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-[72px] ${divider ? "border-t border-line" : ""}`}
            >
                <div className="lg:sticky lg:top-28">
                    <h2 className={`${H2} max-w-[14ch]`}>{heading}</h2>
                    <p className="mt-6 max-w-[34rem] text-base leading-relaxed text-ink-2 text-pretty">{lead}</p>
                </div>
                <div className="border-t border-line lg:border-t-0">
                    {items.map((item, index) => (
                        <div key={index} className="border-b border-line py-7 first:pt-7 lg:first:pt-0">
                            <h3 className="font-serif text-[clamp(23px,2.2vw,28px)] font-normal leading-[1.15] tracking-[-0.015em] text-ink text-balance">
                                {item.title}
                            </h3>
                            <p className={`mt-3 max-w-[62ch] text-pretty ${BODY_TEXT}`}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function DesignPageContent({
    page,
    themeData,
    roomData,
    otherThemes,
    otherRooms,
    relatedBlogLinks = [],
    comparisonLinks = [],
    moreDesignLinks = [],
}: DesignPageContentProps) {
    const tryItHref = generateHref({ theme: page.theme, roomType: page.roomType });
    const breadcrumbItems = [
        { name: "Home", href: "/" },
        { name: "Design Ideas", href: "/design" },
        { name: `${page.themeName} ${page.roomName}`, href: `/design/${page.slug}` },
    ];

    return (
        <PageTransition>
            <div className="container-page">
                <div className="mx-auto max-w-5xl">
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
            </div>

            {/* Hero: copy left, the before/after slider right (stacked on phones). */}
            <section className="container-page pb-16 pt-6 md:pb-24 md:pt-10">
                <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
                    <div>
                        <h1 className="animate-rise font-serif text-[clamp(44px,5.2vw,80px)] font-normal leading-[0.96] tracking-[-0.025em] text-ink text-balance">
                            {page.themeName} {page.roomName} Design Ideas
                        </h1>
                        <p
                            className="mt-6 flex animate-rise flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] font-medium tracking-[0.01em] text-ink-3"
                            style={{ animationDelay: "60ms" }}
                        >
                            <span className="whitespace-nowrap">
                                By{" "}
                                <Link
                                    href="/about"
                                    className="text-ink-2 underline decoration-ink/25 underline-offset-4 transition-[color,text-decoration-color] duration-200 hover:text-ink hover:decoration-ink motion-reduce:transition-none"
                                >
                                    Thanos Kazakis
                                </Link>
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="whitespace-nowrap">Magic Room founder</span>
                            <span aria-hidden="true">·</span>
                            <span className="whitespace-nowrap">
                                Updated <time dateTime="2026-05-19">May 2026</time>
                            </span>
                        </p>
                        <p
                            className="mt-6 max-w-[36rem] animate-rise text-[17px] leading-[1.6] text-ink-2 text-pretty lg:text-base"
                            style={{ animationDelay: "120ms" }}
                        >
                            {page.intro}
                        </p>
                        <div className="mt-8 animate-rise" style={{ animationDelay: "180ms" }}>
                            {/* "Try it": opens the tool with this style and room chosen (ticket 14). */}
                            <Button asChild size="lg" className="group h-auto min-h-[52px] gap-4 whitespace-normal py-[7px] pl-7 pr-[7px] text-left">
                                <Link href={tryItHref}>
                                    Generate {page.themeName} {page.roomName} Design
                                    <span className="grid size-[38px] shrink-0 place-items-center rounded-full bg-cream text-ink">
                                        <ArrowRight
                                            aria-hidden="true"
                                            className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-[3px] motion-reduce:transition-none"
                                        />
                                    </span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="animate-frame-in" style={{ animationDelay: "120ms" }}>
                        <h2 className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-ink-3 before:h-px before:w-7 before:bg-current">
                            See the transformation
                        </h2>
                        <CompareSlider
                            before={{
                                src: `/images/designs/before-${page.roomType}.jpg`,
                                alt: `${page.themeName} ${page.roomName}: before AI redesign`,
                                fallback: "/images/room-before.png",
                            }}
                            after={{
                                src: `/images/designs/${page.slug}.jpg`,
                                alt: `${page.themeName} ${page.roomName}: after AI redesign`,
                                fallback: "/images/room-after.png",
                            }}
                            sizes="(min-width: 1024px) 590px, 100vw"
                            priority
                            className="rounded-3xl md:aspect-[16/10] lg:aspect-[4/3]"
                        />
                        <p className="mt-4 text-[13px] leading-snug text-ink-3">
                            AI-generated {page.themeName.toLowerCase()} {page.roomName.toLowerCase()} redesign from a single photo
                        </p>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="mx-3 rounded-3xl bg-paper-2 py-16 sm:mx-4 sm:rounded-4xl md:py-24">
                <div className="container-page">
                    <div className="mx-auto max-w-5xl">
                        <h2 className={`${H2} max-w-[18ch]`}>
                            How to get {page.themeName} {page.roomName} designs
                        </h2>
                        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3">
                            {STEPS.map((step, index) => (
                                <div key={index} className="border-t border-line pt-6 md:pt-7">
                                    <span className="grid size-11 place-items-center rounded-full bg-ink/5">
                                        <step.icon aria-hidden="true" className="size-[18px] text-ink" />
                                    </span>
                                    <h3 className="mb-3 mt-6 text-[20px] font-medium leading-snug tracking-[-0.015em] text-ink md:mt-8">
                                        {index + 1}. {step.title}
                                    </h3>
                                    <p className="max-w-[34ch] text-[15.5px] leading-relaxed text-ink-2">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Theme Tips */}
            <PrinciplesSection
                heading={`${page.themeName} design principles`}
                lead={themeData.description}
                items={themeData.tips}
                divider={false}
            />

            {/* Room Considerations */}
            <PrinciplesSection
                heading={`${page.roomName} design considerations`}
                lead={roomData.description}
                items={roomData.considerations}
            />

            {/* Deep dive — bespoke, page-specific depth for the combinations
                that already earn impressions but rank too low to earn clicks. */}
            {page.deepDive && page.deepDive.length > 0 && (
                <section className="container-page">
                    <div className="mx-auto max-w-5xl border-t border-line py-16 md:py-24">
                        <div className="max-w-[68ch] space-y-14">
                            {page.deepDive.map((section, index) => (
                                <div key={index}>
                                    <h2 className={`${H2} mb-6`}>{section.heading}</h2>
                                    {section.paragraphs?.map((paragraph, pIndex) => (
                                        <p key={pIndex} className={`mb-5 text-pretty ${BODY_TEXT}`}>
                                            {paragraph}
                                        </p>
                                    ))}
                                    {section.bullets && section.bullets.length > 0 && (
                                        <ul className={`mb-5 list-disc space-y-2.5 pl-6 marker:text-ink-3 ${BODY_TEXT}`}>
                                            {section.bullets.map((bullet, bIndex) => (
                                                <li key={bIndex} className="pl-1.5">
                                                    {bullet}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {section.table && (
                                        // Scrolls inside its own hairline box on narrow screens, never the page.
                                        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-background">
                                            <table className="w-full min-w-[560px] border-collapse text-left text-[15px] leading-snug">
                                                <thead className="bg-paper-2">
                                                    <tr>
                                                        {section.table.headers.map((header, hIndex) => (
                                                            <th
                                                                key={hIndex}
                                                                className="border-b border-line px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-3"
                                                            >
                                                                {header}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {section.table.rows.map((row, rIndex) => (
                                                        <tr key={rIndex} className="border-b border-line last:border-0">
                                                            {row.map((cell, cIndex) => (
                                                                <td
                                                                    key={cIndex}
                                                                    className={
                                                                        cIndex === 0
                                                                            ? "px-4 py-3 align-top font-medium text-ink"
                                                                            : "px-4 py-3 align-top text-ink-2"
                                                                    }
                                                                >
                                                                    {cell}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ, in the homepage FAQ layout (title left and sticky, list right). */}
            {page.faqs.length > 0 && (
                <section className="container-page">
                    <div className="mx-auto grid max-w-5xl items-start gap-8 border-t border-line py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-[72px]">
                        <h2 className={`${H2} max-w-[14ch] lg:sticky lg:top-28`}>Frequently asked questions</h2>
                        <Accordion type="single" collapsible className="w-full border-t border-line">
                            {page.faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`faq-${index}`}>
                                    <AccordionTrigger className="min-h-[72px] py-[18px] text-[clamp(20px,1.9vw,26px)] leading-[1.15]">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="max-w-[58ch] text-base leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>
            )}

            {/*
              Rendered only when there is something to render. Five priority
              slugs are the sole indexable page for their theme or room
              (vintage-bedroom, mediterranean-living-room, farmhouse-gaming-room,
              coastal-walk-in-closet, japandi-mudroom), so this list comes back
              empty for them. Shipping a heading above an empty grid is a
              thin-content signal on exactly the pages that can least afford one.
            */}
            {otherThemes.length > 0 && (
                <section className="container-page">
                    <div className="mx-auto max-w-5xl border-t border-line py-16 md:py-24">
                        <h2 className={`${H2} mb-10 md:mb-12`}>Other styles for your {roomData.name}</h2>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4">
                            {otherThemes.map((theme) => (
                                <DesignTile
                                    key={theme.slug}
                                    href={`/design/${theme.slug}-${roomData.slug}`}
                                    image={`/images/designs/${theme.slug}-${roomData.slug}.jpg`}
                                    title={`${theme.name} ${roomData.name} Design Ideas`}
                                    description={theme.tagline}
                                    sizes={TILE_SIZES}
                                    aspect="aspect-[4/3]"
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* More rooms for this theme */}
            <section className="container-page">
                <div className="mx-auto max-w-5xl border-t border-line py-16 md:py-24">
                    {otherRooms.length > 0 && (
                        <>
                            <h2 className={`${H2} mb-10 md:mb-12`}>More {themeData.name} room designs</h2>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4">
                                {otherRooms.map((room) => (
                                    <DesignTile
                                        key={room.slug}
                                        href={`/design/${themeData.slug}-${room.slug}`}
                                        image={`/images/designs/${themeData.slug}-${room.slug}.jpg`}
                                        title={`${themeData.name} ${room.name} Design Ideas`}
                                        description={`Apply the ${themeData.name.toLowerCase()} style to your ${room.name.toLowerCase()}.`}
                                        sizes={TILE_SIZES}
                                        aspect="aspect-[4/3]"
                                    />
                                ))}
                            </div>
                        </>
                    )}
                    <div
                        className={`flex flex-wrap items-center gap-x-8 gap-y-1 ${otherRooms.length > 0 ? "mt-12" : ""}`}
                    >
                        <Link href="/design" className={TEXT_LINK}>
                            Browse all 196 AI interior design combinations
                        </Link>
                        <Link href="/gallery" className={TEXT_LINK}>
                            See the AI room design gallery
                        </Link>
                        <Link href="/virtual-staging" className={`${TEXT_LINK} text-ink-2`}>
                            AI virtual staging for real estate listings
                        </Link>
                    </div>
                </div>
            </section>

            {/* Top-up links into the indexable design pages that have the
                fewest structural siblings — some are the only priority
                combination for their room type, so no sibling block can reach
                them. */}
            <RelatedLinks
                heading="More AI design ideas"
                links={moreDesignLinks}
                variant="inline"
                className="mx-3 rounded-3xl bg-paper-2 py-14 sm:mx-4 sm:rounded-4xl md:py-20"
            />

            {/* Contextual links out of the design cluster into the blog */}
            <RelatedLinks
                heading={`${page.themeName} ${page.roomName} guides worth reading`}
                intro={`Practical write-ups that go deeper than a single ${page.roomName.toLowerCase()} page — how to photograph the room, how to pick a style, and what AI redesign actually changes.`}
                links={relatedBlogLinks}
                className="py-16 md:py-24"
            />

            {/* Contextual links into the comparison cluster */}
            <RelatedLinks
                heading="Before you pick an AI interior design tool"
                intro="Magic Room is not the only way to generate these designs. Here is how it compares to the tools most people evaluate alongside it."
                links={comparisonLinks}
                className="py-16 md:py-24"
            />

            {/* CTA */}
            <CtaSection
                heading={`Ready to redesign your ${page.roomName.toLowerCase()}?`}
                subtext={`Generate ${page.themeName.toLowerCase()} ${page.roomName.toLowerCase()} design ideas from a single photo. No design experience required.`}
                primaryLabel={`Generate ${page.themeName} Design`}
                primaryHref={tryItHref}
                secondaryLabel="View Pricing"
                secondaryHref="/pricing"
            />
        </PageTransition>
    );
}

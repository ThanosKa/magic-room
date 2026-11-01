import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { DESIGN_PAGES, THEME_DATA, getDesignPageBySlug } from "@/lib/seo/design-data";
import { PRIORITY_DESIGN_SLUGS, isPriorityDesignSlug } from "@/lib/seo/priority-pages";
import { IContextualLink } from "@/lib/seo/internal-links";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { DesignTile } from "@/components/seo/design-tile";
import { RelatedLinks } from "@/components/seo/related-links";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { generateHref } from "@/lib/design-selection";

// Cross-links to the other content sections, as the shared hairline-row list
// (same h2 / h3 / description and anchors as the old hand-built cards).
const MORE_RESOURCES: IContextualLink[] = [
    {
        href: "/blog",
        label: "Interior Design Blog",
        description: "Practical guides on AI room design, styling tips, and redesigning on any budget.",
    },
    {
        href: "/alternatives",
        label: "RoomGPT alternatives compared",
        description: "How Magic Room compares to RoomGPT, Interior AI, DecorAI and Reimagine Home.",
    },
    {
        href: "/gallery",
        label: "AI room design gallery",
        description: "Before-and-after examples generated from real room photos.",
    },
    {
        href: "/virtual-staging",
        label: "AI virtual staging for real estate",
        description: "Staging listing photos with AI instead of paying €75–150 per room.",
    },
];

const HOW_IT_WORKS = [
    {
        title: "Upload a photo of your room",
        body: (
            <>
                Any smartphone photo works. Drag it onto the upload area — it stays on your device and is never
                stored on our servers.
            </>
        ),
    },
    {
        title: "Choose a room type and design style",
        body: (
            <>
                Pick from 14 room types and any of the 14 styles on this page. Add an optional custom note —
                &ldquo;keep the fireplace&rdquo;, &ldquo;warm tones only&rdquo; — for tighter control.
            </>
        ),
    },
    {
        title: "Get your AI-generated redesign in seconds",
        body: (
            <>
                Google Gemini or OpenAI image models process your photo and return a photorealistic redesign in 30–60 seconds. Compare
                before and after with the interactive slider, then try as many styles as you like.
            </>
        ),
    },
];

// Tiles: 2 columns on phones, 3 from 640px (the right column of each style row on desktop).
const TILE_SIZES = "(min-width: 1024px) 210px, (min-width: 640px) 31vw, 47vw";

export const metadata: Metadata = createMetadata({
    // "by Style and Room" described the page's filing system, not what the
    // searcher gets. The queries landing here ("ai room styles", "ai room
    // ideas") want to see styles applied to their own photo.
    title: { absolute: "AI Room Design Ideas — 14 Styles On Your Own Photo" },
    description:
        "Browse 14 interior design styles across 14 room types, then upload one photo and see any of them on your actual room in 60 seconds. 1 free credit, no card.",
    path: "/design",
    keywords: [
        "AI interior design ideas",
        "room design styles",
        "interior design inspiration",
        "AI room redesign",
        "design style guide",
    ],
});

const schema = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Design Ideas", url: `${SITE_URL}/design` },
]);

/**
 * ItemList for the design index — previously missing entirely, so Google had no
 * machine-readable statement of what this hub collects.
 *
 * Scoped to the indexable priority set only. Listing all 196 combinations here
 * would enumerate ~158 noindex URLs in structured data, contradicting the
 * robots directive on those pages and re-signalling the scaled-content pattern
 * the priority list exists to suppress.
 */
const designItemList = itemListSchema({
    name: "AI Interior Design Ideas by Style and Room",
    description:
        "Interior design style and room-type combinations you can generate from a single photo with Magic Room.",
    items: PRIORITY_DESIGN_SLUGS.map((slug, index) => {
        const page = getDesignPageBySlug(slug);
        return {
            position: index + 1,
            name: page ? `${page.themeName} ${page.roomName}` : slug,
            url: `${SITE_URL}/design/${slug}`,
            description: page?.metaDescription,
        };
    }),
});

export default function DesignHubPage() {
    const themeKeys = Object.keys(THEME_DATA);

    return (
        <>
            <JsonLd schemas={[schema, designItemList]} />
            <PageTransition>
                <div className="container-page">
                    <div className="mx-auto max-w-5xl">
                        <BreadcrumbNav
                            items={[
                                { name: "Home", href: "/" },
                                { name: "Design Ideas", href: "/design" },
                            ]}
                        />
                    </div>
                </div>

                {/* Hero */}
                <section className="container-page pb-14 pt-8 md:pb-20 md:pt-14">
                    <div className="mx-auto grid max-w-5xl items-end gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
                        <h1 className="max-w-[12ch] animate-rise font-serif text-[clamp(48px,6.4vw,96px)] font-normal leading-[0.95] tracking-[-0.025em] text-ink text-balance">
                            AI Interior Design Ideas
                        </h1>
                        <p
                            className="max-w-[34rem] animate-rise text-[17px] leading-[1.6] text-ink-2 text-pretty lg:justify-self-end"
                            style={{ animationDelay: "90ms" }}
                        >
                            Explore 196 AI-generated interior design styles across 14 room types — from modern and
                            minimalist to Japandi, Scandinavian, farmhouse, and beyond. Each combination applies
                            professional interior design principles through AI visualization, so you can browse
                            room design styles before committing to anything. Upload your own room photo to see any
                            style applied to your actual space in seconds.
                        </p>
                    </div>
                </section>

                {/* Themes: one gallery row per style */}
                {themeKeys.map((theme) => {
                    const themeData = THEME_DATA[theme];
                    // Link only to indexable pages. The other (theme, room) combos are
                    // noindex (see lib/seo/pruned.ts); listing them here spent crawl on
                    // pages we ask Google to drop. They stay reachable by direct URL.
                    const themePages = DESIGN_PAGES.filter(
                        (p) => p.theme === theme && isPriorityDesignSlug(p.slug)
                    );

                    return (
                        <section key={theme} className="container-page">
                            <div className="mx-auto grid max-w-5xl items-start gap-8 border-t border-line py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.75fr)] lg:gap-14">
                                <div className="lg:sticky lg:top-28">
                                    <div>
                                        <h2 className="font-serif text-[clamp(34px,3.4vw,46px)] font-normal leading-none tracking-[-0.022em] text-ink text-balance">
                                            {themeData.name} Interior Design
                                        </h2>
                                        <p className="mt-3 font-serif text-[20px] italic leading-snug text-ink-3 md:text-[22px]">
                                            {themeData.tagline}
                                        </p>
                                    </div>
                                    <p className="mt-5 max-w-[30rem] text-[15.5px] leading-relaxed text-ink-2 text-pretty">
                                        {themeData.description}
                                    </p>
                                </div>
                                <div>
                                    {themePages.length === 0 && (
                                        // No indexable page for this style: one landscape tile straight into the tool.
                                        <Link
                                            href={generateHref({ theme })}
                                            className="group relative flex aspect-[4/3] items-end overflow-hidden rounded-xl bg-night p-5 text-cream transition-transform duration-160 ease-out active:scale-[0.99] motion-reduce:transition-none sm:aspect-[16/9] md:p-8"
                                        >
                                            <Image
                                                src={`/images/designs/${theme}-living-room.jpg`}
                                                alt=""
                                                fill
                                                sizes="(min-width: 1024px) 640px, 100vw"
                                                className="object-cover opacity-75 transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                                            />
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/25 to-transparent"
                                            />
                                            <span className="relative flex w-full items-end justify-between gap-4">
                                                <span className="max-w-[20ch] font-serif text-[clamp(26px,2.8vw,36px)] leading-[1.05] tracking-[-0.02em] text-balance">
                                                    Try {themeData.name} on your own room photo
                                                </span>
                                                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream text-ink md:size-[52px]">
                                                    <ArrowRight
                                                        aria-hidden="true"
                                                        className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-[3px] motion-reduce:transition-none"
                                                    />
                                                </span>
                                            </span>
                                        </Link>
                                    )}
                                    {themePages.length > 0 && (
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4">
                                            {themePages.map((page) => (
                                                <DesignTile
                                                    key={page.slug}
                                                    href={`/design/${page.slug}`}
                                                    image={`/images/designs/${page.slug}.jpg`}
                                                    title={`${page.themeName} ${page.roomName}`}
                                                    description={`${page.metaDescription.slice(0, 80)}...`}
                                                    sizes={TILE_SIZES}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    );
                })}

                {/* How It Works */}
                <section className="mx-3 rounded-3xl bg-paper-2 py-20 sm:mx-4 sm:rounded-4xl md:py-28">
                    <div className="container-page">
                        <div className="mx-auto max-w-5xl">
                            <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
                                <h2 className="max-w-[16ch] font-serif text-[clamp(36px,4.3vw,62px)] font-normal leading-none tracking-[-0.022em] text-ink text-balance">
                                    How AI room redesign works
                                </h2>
                                <p className="max-w-[30rem] text-base leading-relaxed text-ink-2 text-pretty lg:justify-self-end">
                                    Seeing a design style applied to someone else&rsquo;s room is useful. Seeing it applied
                                    to your own room is transformative. Here&rsquo;s all it takes:
                                </p>
                            </div>
                            <ol className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3">
                                {HOW_IT_WORKS.map((step, index) => (
                                    <li key={step.title} className="border-t border-line pt-6 md:pt-7">
                                        <span className="block font-serif text-[56px] leading-[0.9] tracking-[-0.03em] text-ink-3">
                                            {index + 1}
                                        </span>
                                        <div>
                                            <h3 className="mb-3 mt-7 text-[20px] font-medium leading-snug tracking-[-0.015em] text-ink md:mt-9">
                                                {step.title}
                                            </h3>
                                            <p className="max-w-[34ch] text-[15.5px] leading-relaxed text-ink-2">
                                                {step.body}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                            <div className="mt-12 md:mt-16">
                                <Button asChild size="lg" className="group gap-4 pl-7 pr-[7px]">
                                    <Link href="/generate">
                                        Try it free — 1 credit included
                                        <span className="grid size-[38px] place-items-center rounded-full bg-cream text-ink">
                                            <ArrowRight
                                                aria-hidden="true"
                                                className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-[3px] motion-reduce:transition-none"
                                            />
                                        </span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cross-links to other content sections */}
                <RelatedLinks heading="More resources" links={MORE_RESOURCES} className="py-20 md:py-28" />
            </PageTransition>
        </>
    );
}

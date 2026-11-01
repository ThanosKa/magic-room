"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CompareSlider } from "@/components/compare-slider";
import { PageTransition } from "@/components/page-transition";
import { CtaSection } from "@/components/seo/cta-section";
import {
    BODY_CLASS,
    CHIP_CLASS,
    H1_CLASS,
    H2_CLASS,
    LABEL_CLASS,
    LEAD_CLASS,
    PageBreadcrumb,
    Rule,
} from "@/components/seo/comparison-layout";
import { cn } from "@/lib/utils";
import { isPriorityDesignSlug } from "@/lib/seo/priority-pages";

// Cross-link card, repeated once per card in the grid below.
const RELATED_CARD_CLASS =
    "group block rounded-xl border border-line p-5 transition-[border-color,background-color,transform] duration-200 ease-out hover:border-ink/30 hover:bg-paper-2 active:scale-[0.98] motion-reduce:transition-none";

interface GalleryItem {
    slug: string;
    theme: string;
    themeName: string;
    roomType: string;
    roomName: string;
}

const ALL_ITEMS: GalleryItem[] = [
    // Top priority items first
    { slug: "modern-living-room", theme: "modern", themeName: "Modern", roomType: "living-room", roomName: "Living Room" },
    { slug: "scandinavian-bedroom", theme: "scandinavian", themeName: "Scandinavian", roomType: "bedroom", roomName: "Bedroom" },
    { slug: "minimalist-living-room", theme: "minimalist", themeName: "Minimalist", roomType: "living-room", roomName: "Living Room" },
    { slug: "bohemian-bedroom", theme: "bohemian", themeName: "Bohemian", roomType: "bedroom", roomName: "Bedroom" },
    { slug: "industrial-kitchen", theme: "industrial", themeName: "Industrial", roomType: "kitchen", roomName: "Kitchen" },
    { slug: "luxury-bathroom", theme: "luxury", themeName: "Luxury", roomType: "bathroom", roomName: "Bathroom" },
    { slug: "coastal-living-room", theme: "coastal", themeName: "Coastal", roomType: "living-room", roomName: "Living Room" },
    { slug: "farmhouse-kitchen", theme: "farmhouse", themeName: "Farmhouse", roomType: "kitchen", roomName: "Kitchen" },
    // Modern
    { slug: "modern-kitchen", theme: "modern", themeName: "Modern", roomType: "kitchen", roomName: "Kitchen" },
    { slug: "modern-bedroom", theme: "modern", themeName: "Modern", roomType: "bedroom", roomName: "Bedroom" },
    { slug: "modern-bathroom", theme: "modern", themeName: "Modern", roomType: "bathroom", roomName: "Bathroom" },
    { slug: "modern-office", theme: "modern", themeName: "Modern", roomType: "office", roomName: "Office" },
    // Scandinavian
    { slug: "scandinavian-living-room", theme: "scandinavian", themeName: "Scandinavian", roomType: "living-room", roomName: "Living Room" },
    { slug: "scandinavian-kitchen", theme: "scandinavian", themeName: "Scandinavian", roomType: "kitchen", roomName: "Kitchen" },
    { slug: "scandinavian-bathroom", theme: "scandinavian", themeName: "Scandinavian", roomType: "bathroom", roomName: "Bathroom" },
    // Minimalist
    { slug: "minimalist-bedroom", theme: "minimalist", themeName: "Minimalist", roomType: "bedroom", roomName: "Bedroom" },
    { slug: "minimalist-kitchen", theme: "minimalist", themeName: "Minimalist", roomType: "kitchen", roomName: "Kitchen" },
    { slug: "minimalist-bathroom", theme: "minimalist", themeName: "Minimalist", roomType: "bathroom", roomName: "Bathroom" },
    // Bohemian
    { slug: "bohemian-living-room", theme: "bohemian", themeName: "Bohemian", roomType: "living-room", roomName: "Living Room" },
    { slug: "bohemian-dining-room", theme: "bohemian", themeName: "Bohemian", roomType: "dining-room", roomName: "Dining Room" },
    // Industrial
    { slug: "industrial-living-room", theme: "industrial", themeName: "Industrial", roomType: "living-room", roomName: "Living Room" },
    { slug: "industrial-bedroom", theme: "industrial", themeName: "Industrial", roomType: "bedroom", roomName: "Bedroom" },
    { slug: "industrial-office", theme: "industrial", themeName: "Industrial", roomType: "office", roomName: "Office" },
    // Luxury
    { slug: "luxury-living-room", theme: "luxury", themeName: "Luxury", roomType: "living-room", roomName: "Living Room" },
    { slug: "luxury-bedroom", theme: "luxury", themeName: "Luxury", roomType: "bedroom", roomName: "Bedroom" },
    { slug: "luxury-dining-room", theme: "luxury", themeName: "Luxury", roomType: "dining-room", roomName: "Dining Room" },
    // Coastal
    { slug: "coastal-bedroom", theme: "coastal", themeName: "Coastal", roomType: "bedroom", roomName: "Bedroom" },
    { slug: "coastal-bathroom", theme: "coastal", themeName: "Coastal", roomType: "bathroom", roomName: "Bathroom" },
    // Farmhouse
    { slug: "farmhouse-living-room", theme: "farmhouse", themeName: "Farmhouse", roomType: "living-room", roomName: "Living Room" },
    { slug: "farmhouse-bedroom", theme: "farmhouse", themeName: "Farmhouse", roomType: "bedroom", roomName: "Bedroom" },
    // Japandi
    { slug: "japandi-living-room", theme: "japandi", themeName: "Japandi", roomType: "living-room", roomName: "Living Room" },
    { slug: "japandi-bedroom", theme: "japandi", themeName: "Japandi", roomType: "bedroom", roomName: "Bedroom" },
    { slug: "japandi-bathroom", theme: "japandi", themeName: "Japandi", roomType: "bathroom", roomName: "Bathroom" },
    // Art Deco
    { slug: "art-deco-living-room", theme: "art-deco", themeName: "Art Deco", roomType: "living-room", roomName: "Living Room" },
    { slug: "art-deco-bedroom", theme: "art-deco", themeName: "Art Deco", roomType: "bedroom", roomName: "Bedroom" },
    // Mediterranean
    { slug: "mediterranean-living-room", theme: "mediterranean", themeName: "Mediterranean", roomType: "living-room", roomName: "Living Room" },
    { slug: "mediterranean-kitchen", theme: "mediterranean", themeName: "Mediterranean", roomType: "kitchen", roomName: "Kitchen" },
    // Transitional
    { slug: "transitional-living-room", theme: "transitional", themeName: "Transitional", roomType: "living-room", roomName: "Living Room" },
    { slug: "transitional-bedroom", theme: "transitional", themeName: "Transitional", roomType: "bedroom", roomName: "Bedroom" },
];

const FILTERS = [
    { key: "all", label: "All Styles" },
    { key: "modern", label: "Modern" },
    { key: "scandinavian", label: "Scandinavian" },
    { key: "minimalist", label: "Minimalist" },
    { key: "bohemian", label: "Bohemian" },
    { key: "industrial", label: "Industrial" },
    { key: "luxury", label: "Luxury" },
    { key: "coastal", label: "Coastal" },
    { key: "farmhouse", label: "Farmhouse" },
    { key: "japandi", label: "Japandi" },
    { key: "art-deco", label: "Art Deco" },
    { key: "mediterranean", label: "Mediterranean" },
    { key: "transitional", label: "Transitional" },
];

function GalleryCard({ item }: { item: GalleryItem }) {
    // Only indexable design pages are linked; pruned/noindex combos still show
    // their before/after image but are not a crawl path (lib/seo/pruned.ts).
    // The link sits on the caption, not the whole card, so dragging the slider
    // never follows it (and the slider's range input is not nested in a link).
    const linked = isPriorityDesignSlug(item.slug);

    const caption = (
        <div className="flex items-center justify-between gap-3">
            <div>
                <p className={LABEL_CLASS}>{item.themeName}</p>
                <h3 className="mt-1 font-serif text-[22px] font-normal leading-tight tracking-[-0.01em] text-ink">
                    {item.roomName}
                </h3>
            </div>
            {linked && (
                <span className="shrink-0 text-sm text-ink-3 transition-colors duration-200 group-hover/link:text-ink motion-reduce:transition-none">
                    View →
                </span>
            )}
        </div>
    );

    return (
        <div className="overflow-hidden rounded-2xl border border-line bg-paper-2">
            <CompareSlider
                before={{
                    src: `/images/designs/before-${item.roomType}.jpg`,
                    alt: `${item.roomName} before AI redesign`,
                }}
                after={{
                    src: `/images/designs/${item.slug}.jpg`,
                    alt: `${item.themeName} ${item.roomName} AI design`,
                }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                label={`Compare ${item.themeName} ${item.roomName} before and after`}
                className="rounded-none"
            />
            {linked ? (
                <Link
                    href={`/design/${item.slug}`}
                    className="group/link block p-4 transition-colors duration-200 hover:bg-paper motion-reduce:transition-none"
                >
                    {caption}
                </Link>
            ) : (
                <div className="p-4">{caption}</div>
            )}
        </div>
    );
}

export function GalleryContent() {
    const [activeFilter, setActiveFilter] = useState("all");

    const filtered =
        activeFilter === "all"
            ? ALL_ITEMS
            : ALL_ITEMS.filter((item) => item.theme === activeFilter);

    return (
        <PageTransition>
            <PageBreadcrumb
                items={[
                    { name: "Home", href: "/" },
                    { name: "Gallery", href: "/gallery" },
                ]}
            />

            {/* Hero */}
            <section className="pb-12 pt-6 md:pb-16 md:pt-12">
                <div className="container-page">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className={H1_CLASS}>AI Interior Design Gallery</h1>
                        <p className={cn(LEAD_CLASS, "mt-6")}>
                            Real before-and-after room transformations generated by AI. Drag any card to reveal the redesign, then click to explore full details and generate your own.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter tabs */}
            {/* Sticks just under the site header (66px tall, 76px from 640px). */}
            <section className="sticky top-[66px] z-20 border-y border-line bg-paper/90 backdrop-blur sm:top-[76px]">
                <div className="container-page">
                    <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={cn(
                                    "min-h-10 shrink-0 rounded-full px-4 text-sm font-medium transition-[background-color,color,transform] duration-160 ease-out active:scale-[0.97] motion-reduce:transition-none",
                                    activeFilter === filter.key
                                        ? "bg-ink text-cream"
                                        : "bg-ink/5 text-ink hover:bg-ink/10"
                                )}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery grid */}
            <section className="py-10 md:py-14">
                <div className="container-page">
                    <p className="mb-6 text-sm text-ink-2">
                        Showing {filtered.length} design{filtered.length !== 1 ? "s" : ""}
                        {activeFilter !== "all" ? ` in ${FILTERS.find((f) => f.key === activeFilter)?.label}` : ""}
                        . Drag a card to see the AI transformation.
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((item) => (
                            <GalleryCard key={item.slug} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            <Rule />

            {/* Cross-links */}
            <section className="py-16 md:py-24">
                <div className="container-page">
                    <div className="mx-auto max-w-5xl">
                        <h2 className={H2_CLASS}>Explore more</h2>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <Link href="/design" className={RELATED_CARD_CLASS}>
                                <h3 className="font-serif text-[22px] font-normal leading-tight text-ink">
                                    All Design Styles
                                </h3>
                                <p className={cn(BODY_CLASS, "mt-2 text-[15px]")}>
                                    Browse all 196 design combinations across 14 styles and 14 room types.
                                </p>
                            </Link>
                            <Link href="/blog" className={RELATED_CARD_CLASS}>
                                <h3 className="font-serif text-[22px] font-normal leading-tight text-ink">
                                    Interior Design Blog
                                </h3>
                                <p className={cn(BODY_CLASS, "mt-2 text-[15px]")}>
                                    Guides on AI room design, styling tips, and redesigning on any budget.
                                </p>
                            </Link>
                            <Link href="/alternatives" className={RELATED_CARD_CLASS}>
                                <h3 className="font-serif text-[22px] font-normal leading-tight text-ink">
                                    RoomGPT alternatives compared
                                </h3>
                                <p className={cn(BODY_CLASS, "mt-2 text-[15px]")}>
                                    RoomGPT, Interior AI, DecorAI and Reimagine Home on model, privacy and price.
                                </p>
                            </Link>
                            <Link href="/virtual-staging" className={RELATED_CARD_CLASS}>
                                <h3 className="font-serif text-[22px] font-normal leading-tight text-ink">
                                    AI virtual staging for real estate
                                </h3>
                                <p className={cn(BODY_CLASS, "mt-2 text-[15px]")}>
                                    Staging listing photos with AI instead of paying per room.
                                </p>
                            </Link>
                        </div>

                        {/* Gallery was a complete orphan — zero inbound internal
                            links despite being in the sitemap. These give it a
                            reason to pass equity onward as well. */}
                        <h3 className="mt-12 font-serif text-[24px] font-normal leading-tight text-ink">
                            Popular styles from the gallery
                        </h3>
                        <ul className="mt-5 flex flex-wrap gap-3">
                            {[
                                { slug: "art-deco-bedroom", label: "Art Deco bedroom ideas" },
                                {
                                    slug: "scandinavian-living-room",
                                    label: "Scandinavian living room ideas",
                                },
                                { slug: "modern-living-room", label: "Modern living room design ideas" },
                                { slug: "coastal-living-room", label: "Coastal living room design ideas" },
                                { slug: "modern-bathroom", label: "Modern bathroom design ideas" },
                                { slug: "farmhouse-kitchen", label: "Farmhouse kitchen design ideas" },
                            ].map((item) => (
                                <li key={item.slug}>
                                    <Link href={`/design/${item.slug}`} className={CHIP_CLASS}>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <CtaSection
                heading="Transform your room with AI"
                subtext="Upload a photo of any room and get stunning design variations in under 60 seconds. No design experience required."
                primaryLabel="Generate My Design"
                secondaryLabel="View Pricing"
                secondaryHref="/pricing"
            />
        </PageTransition>
    );
}

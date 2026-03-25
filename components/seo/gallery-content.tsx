"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageTransition } from "@/components/page-transition";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";

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
    const [hovered, setHovered] = useState(false);

    return (
        <Link
            href={`/design/${item.slug}`}
            className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Image area with before/after toggle */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
                {/* Before image */}
                <Image
                    src={`/images/designs/before-${item.roomType}.jpg`}
                    alt={`${item.roomName} before AI redesign`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`}
                />
                {/* After image */}
                <Image
                    src={`/images/designs/${item.slug}.jpg`}
                    alt={`${item.themeName} ${item.roomName} AI design`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
                />
                {/* Hover label */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-2">
                    <span className={`rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm transition-opacity duration-300 ${hovered ? "opacity-0" : "opacity-100"}`}>
                        Before
                    </span>
                    <span className={`rounded-md bg-primary/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}>
                        After
                    </span>
                </div>
            </div>

            {/* Card footer */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-primary">
                            {item.themeName}
                        </p>
                        <h3 className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                            {item.roomName}
                        </h3>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:text-primary transition-colors dark:text-slate-500">
                        View →
                    </span>
                </div>
            </div>
        </Link>
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
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container px-4 md:px-6">
                    <BreadcrumbNav
                        items={[
                            { name: "Home", href: "/" },
                            { name: "Gallery", href: "/gallery" },
                        ]}
                    />
                </div>
            </div>

            {/* Hero */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                            AI Interior Design Gallery
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                            Real before-and-after room transformations generated by AI. Hover any card to reveal the redesign, then click to explore full details and generate your own.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter tabs */}
            <section className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
                <div className="container px-4 md:px-6">
                    <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                                    activeFilter === filter.key
                                        ? "bg-primary text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery grid */}
            <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                <div className="container px-4 md:px-6">
                    <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                        Showing {filtered.length} design{filtered.length !== 1 ? "s" : ""}
                        {activeFilter !== "all" ? ` in ${FILTERS.find((f) => f.key === activeFilter)?.label}` : ""}
                        . Hover a card to see the AI transformation.
                    </p>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((item) => (
                            <GalleryCard key={item.slug} item={item} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Cross-links */}
            <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Explore more
                        </h2>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <Link
                                href="/design"
                                className="rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md dark:border-slate-800"
                            >
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    All Design Styles
                                </h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    Browse all 196 design combinations across 14 styles and 14 room types.
                                </p>
                            </Link>
                            <Link
                                href="/blog"
                                className="rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md dark:border-slate-800"
                            >
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Interior Design Blog
                                </h3>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    Guides on AI room design, styling tips, and redesigning on any budget.
                                </p>
                            </Link>
                        </div>
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

import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { DESIGN_PAGES, THEME_DATA, getDesignPageBySlug } from "@/lib/seo/design-data";
import { PRIORITY_DESIGN_SLUGS } from "@/lib/seo/priority-pages";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";

// Cross-link card, repeated once per card in the grid below.
const RELATED_CARD_CLASS =
    "rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md dark:border-slate-800";

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
                {/* Breadcrumb */}
                <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container px-4 md:px-6">
                        <BreadcrumbNav
                            items={[
                                { name: "Home", href: "/" },
                                { name: "Design Ideas", href: "/design" },
                            ]}
                        />
                    </div>
                </div>

                {/* Hero */}
                <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                                AI Interior Design Ideas
                            </h1>
                            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                                Explore 196 AI-generated interior design styles across 14 room types — from modern and
                                minimalist to Japandi, Scandinavian, farmhouse, and beyond. Each combination applies
                                professional interior design principles through AI visualization, so you can browse
                                room design styles before committing to anything. Upload your own room photo to see any
                                style applied to your actual space in seconds.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Themes */}
                {themeKeys.map((theme) => {
                    const themeData = THEME_DATA[theme];
                    const themePages = DESIGN_PAGES.filter((p) => p.theme === theme);

                    return (
                        <section
                            key={theme}
                            className="py-12 odd:bg-white even:bg-slate-50 dark:odd:bg-slate-950 dark:even:bg-slate-900/50"
                        >
                            <div className="container px-4 md:px-6">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                                        {themeData.name} Interior Design
                                    </h2>
                                    <p className="mt-2 text-base font-medium text-slate-500 dark:text-slate-400 italic">
                                        {themeData.tagline}
                                    </p>
                                    <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-400">
                                        {themeData.description}
                                    </p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {themePages.map((page) => (
                                        <Link
                                            key={page.slug}
                                            href={`/design/${page.slug}`}
                                        >
                                            <Card className="h-full border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                                        {page.themeName} {page.roomName}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                        {page.metaDescription.slice(0, 80)}...
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    );
                })}
                {/* How It Works */}
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
                                How AI room redesign works
                            </h2>
                            <p className="mt-3 text-slate-600 dark:text-slate-400">
                                Seeing a design style applied to someone else&rsquo;s room is useful. Seeing it applied
                                to your own room is transformative. Here&rsquo;s all it takes:
                            </p>
                            <ol className="mt-8 space-y-6">
                                <li className="flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                                        1
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            Upload a photo of your room
                                        </h3>
                                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                                            Any smartphone photo works. Drag it onto the upload area — it stays on your
                                            device and is never stored on our servers.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                                        2
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            Choose a room type and design style
                                        </h3>
                                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                                            Pick from 14 room types and any of the 14 styles on this page. Add an
                                            optional custom note — &ldquo;keep the fireplace&rdquo;, &ldquo;warm
                                            tones only&rdquo; — for tighter control.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                                        3
                                    </span>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            Get your AI-generated redesign in seconds
                                        </h3>
                                        <p className="mt-1 text-slate-600 dark:text-slate-400">
                                            Google Gemini processes your photo and returns a photorealistic redesign in
                                            30–60 seconds. Compare before and after with the interactive slider, then
                                            try as many styles as you like.
                                        </p>
                                    </div>
                                </li>
                            </ol>
                            <div className="mt-10">
                                <Button asChild size="lg" className="px-8">
                                    <Link href="/generate">Try it free — 1 credit included</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cross-links to other content sections */}
                <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                More resources
                            </h2>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <Link
                                    href="/blog"
                                    className={RELATED_CARD_CLASS}
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        Interior Design Blog
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Practical guides on AI room design, styling tips, and redesigning on any budget.
                                    </p>
                                </Link>
                                <Link
                                    href="/alternatives"
                                    className={RELATED_CARD_CLASS}
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        RoomGPT alternatives compared
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        How Magic Room compares to RoomGPT, Interior AI, DecorAI and Reimagine Home.
                                    </p>
                                </Link>
                                <Link
                                    href="/gallery"
                                    className={RELATED_CARD_CLASS}
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        AI room design gallery
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Before-and-after examples generated from real room photos.
                                    </p>
                                </Link>
                                <Link
                                    href="/virtual-staging"
                                    className={RELATED_CARD_CLASS}
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        AI virtual staging for real estate
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Staging listing photos with AI instead of paying €75–150 per room.
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </PageTransition>
        </>
    );
}

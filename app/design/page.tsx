import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { DESIGN_PAGES, THEME_DATA } from "@/lib/seo/design-data";
import { THEMES } from "@/lib/constants";
import { Theme } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { PageTransition } from "@/components/page-transition";

export const metadata: Metadata = createMetadata({
    title: "AI Interior Design Ideas by Style and Room",
    description:
        "Browse 56 AI interior design combinations across 8 styles and 7 room types. Generate modern, Scandinavian, industrial, bohemian, and more design ideas from a single photo.",
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

export default function DesignHubPage() {
    const themeKeys = Object.keys(THEMES) as Theme[];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
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
                                Browse design inspiration across 8 styles and 7 room types. Upload a photo and
                                generate your redesign in seconds.
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
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        {themeData.tagline}
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
                                    className="rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md dark:border-slate-800"
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
                                    className="rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md dark:border-slate-800"
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        Compare AI Design Tools
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        How Magic Room compares to RoomGPT, DecorAI, and other AI interior design tools.
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

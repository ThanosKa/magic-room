import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { COMPETITORS } from "@/lib/seo/competitor-data";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
import { PageTransition } from "@/components/page-transition";

export const metadata: Metadata = createMetadata({
    title: "AI Interior Design Alternatives - RoomGPT and More",
    description:
        "Comparing AI interior design tools? See how Magic Room compares to RoomGPT, DecorAI, Reimagine Home, and Interior AI on privacy, pricing, and output quality.",
    path: "/alternatives",
    keywords: [
        "roomgpt alternative",
        "ai interior design alternative",
        "room design ai comparison",
        "interior ai alternative",
    ],
});

const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Alternatives", url: `${SITE_URL}/alternatives` },
]);

const itemList = itemListSchema({
    name: "Best AI Interior Design Tool Alternatives to Magic Room",
    description: "Comparison of Magic Room versus RoomGPT, DecorAI, Reimagine Home, and Interior AI on privacy, AI model, pricing, and output quality.",
    items: COMPETITORS.map((c, i) => ({
        position: i + 1,
        name: `Best ${c.name} Alternative`,
        url: `${SITE_URL}/alternatives/${c.slug}`,
        description: c.description,
    })),
});

export default function AlternativesHubPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
            />
            <PageTransition>
                {/* Breadcrumb */}
                <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container px-4 md:px-6">
                        <BreadcrumbNav
                            items={[
                                { name: "Home", href: "/" },
                                { name: "Alternatives", href: "/alternatives" },
                            ]}
                        />
                    </div>
                </div>

                {/* Hero */}
                <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                                AI Interior Design Tool Comparisons
                            </h1>
                            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                                How Magic Room compares to other AI room design tools. See the differences in
                                privacy approach, AI model, pricing, and output quality.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Alternative pages list */}
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                                Magic Room alternatives to popular tools
                            </h2>
                            <div className="space-y-4">
                                {COMPETITORS.map((competitor) => (
                                    <Link
                                        key={competitor.slug}
                                        href={`/alternatives/${competitor.slug}`}
                                    >
                                        <Card className="border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                                            <CardContent className="p-6">
                                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                                    Best {competitor.name} Alternative
                                                </h3>
                                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                                    {competitor.description.slice(0, 120)}...
                                                </p>
                                                <span className="mt-3 inline-block text-sm font-medium text-primary">
                                                    Compare Magic Room vs {competitor.name}
                                                </span>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* VS pages */}
                <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                                Head-to-head comparisons
                            </h2>
                            <Link href="/vs/roomgpt">
                                <Card className="border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            Magic Room vs RoomGPT
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                            Detailed side-by-side comparison of AI model, privacy approach,
                                            pricing model, and output quality.
                                        </p>
                                        <span className="mt-3 inline-block text-sm font-medium text-primary">
                                            View comparison
                                        </span>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Cross-links to other content sections */}
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Explore more
                            </h2>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <Link
                                    href="/design"
                                    className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        AI Design Ideas
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Browse 196 AI design combinations across 14 styles and 14 room types.
                                    </p>
                                </Link>
                                <Link
                                    href="/blog"
                                    className="rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        Interior Design Blog
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Practical guides on AI room design, styling tips, and redesigning on any budget.
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <CtaSection
                    heading="See the difference yourself"
                    subtext="Try Magic Room with one free credit. No subscription, no hidden fees."
                />
            </PageTransition>
        </>
    );
}

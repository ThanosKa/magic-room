import { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { getSortedBlogPosts } from "@/lib/seo/blog-data";
import { BlogCard } from "@/components/seo/blog-card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { PageTransition } from "@/components/page-transition";
import { JsonLd } from "@/components/seo/json-ld";

// Cross-link card, repeated once per card in the grid below.
const RELATED_CARD_CLASS =
    "rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md dark:border-slate-800";

export const metadata: Metadata = createMetadata({
    // "Interior Design Blog | Magic Room" is a filing label — it names the
    // container, not the payoff, and gives a searcher at position 12 nothing.
    title: { absolute: "AI Interior Design Guides: Redesign, Styles, Staging" },
    description:
        "Hands-on guides to redesigning rooms with AI — tool comparisons, style breakdowns, virtual staging for listings, and budget makeovers. No affiliate links.",
    path: "/blog",
    keywords: [
        "interior design blog",
        "AI room design guide",
        "interior design tips",
        "room redesign ideas",
    ],
});

const schema = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
]);

export default function BlogHubPage() {
    const posts = getSortedBlogPosts();

    return (
        <>
            <JsonLd schemas={[schema]} />
            <PageTransition>
                {/* Breadcrumb */}
                <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                    <div className="container px-4 md:px-6">
                        <BreadcrumbNav
                            items={[
                                { name: "Home", href: "/" },
                                { name: "Blog", href: "/blog" },
                            ]}
                        />
                    </div>
                </div>

                {/* Hero */}
                <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                                Interior Design Blog
                            </h1>
                            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
                                Practical guides on AI room design, interior styles, and how to redesign spaces
                                without a designer. New posts every week.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Posts grid */}
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-5xl">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {posts.map((post) => (
                                    <BlogCard key={post.slug} post={post} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                {/* Cross-links to other content sections */}
                <section className="bg-white py-12 dark:bg-slate-950 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Explore more
                            </h2>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <Link
                                    href="/design"
                                    className={RELATED_CARD_CLASS}
                                >
                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                        AI Design Ideas
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Browse 196 AI design combinations across 14 styles and 14 room types.
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
                                        RoomGPT, Interior AI, DecorAI and Reimagine Home on model, privacy and price.
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
                                        What AI staging replaces on a listing, and where it still falls short.
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
                            </div>
                        </div>
                    </div>
                </section>
            </PageTransition>
        </>
    );
}

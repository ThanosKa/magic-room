import { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { getSortedBlogPosts } from "@/lib/seo/blog-data";
import { BlogCard } from "@/components/seo/blog-card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { PageTransition } from "@/components/page-transition";

export const metadata: Metadata = createMetadata({
    title: "Interior Design Blog | Magic Room",
    description:
        "Practical guides on AI interior design, room styling, design styles, and how to redesign spaces on any budget. Written by the Magic Room team.",
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
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {posts.map((post) => (
                                    <BlogCard key={post.slug} post={post} />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </PageTransition>
        </>
    );
}

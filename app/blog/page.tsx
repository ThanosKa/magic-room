import { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { getSortedBlogPosts } from "@/lib/seo/blog-data";
import { BlogCard } from "@/components/seo/blog-card";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { RelatedLinks } from "@/components/seo/related-links";
import { IContextualLink } from "@/lib/seo/internal-links";
import { PageTransition } from "@/components/page-transition";
import { JsonLd } from "@/components/seo/json-ld";

// Cross-links to the other content sections, rendered as the shared
// hairline-row link list (same h2/h3 structure and anchors as before).
const EXPLORE_LINKS: IContextualLink[] = [
    {
        href: "/design",
        label: "AI Design Ideas",
        description: "Browse 196 AI design combinations across 14 styles and 14 room types.",
    },
    {
        href: "/alternatives",
        label: "RoomGPT alternatives compared",
        description: "RoomGPT, Interior AI, DecorAI and Reimagine Home on model, privacy and price.",
    },
    {
        href: "/virtual-staging",
        label: "AI virtual staging for real estate",
        description: "What AI staging replaces on a listing, and where it still falls short.",
    },
    {
        href: "/gallery",
        label: "AI room design gallery",
        description: "Before-and-after examples generated from real room photos.",
    },
];

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
                {/* Index content shares the 5xl column the RelatedLinks block uses,
                    so breadcrumb, hero, grid and cross-links line up. */}
                <div className="container-page">
                    <div className="mx-auto max-w-5xl">
                        <BreadcrumbNav
                            items={[
                                { name: "Home", href: "/" },
                                { name: "Blog", href: "/blog" },
                            ]}
                        />
                    </div>
                </div>

                {/* Hero */}
                <section className="container-page pb-12 pt-8 md:pb-16 md:pt-14">
                    <div className="mx-auto max-w-5xl">
                        <h1 className="max-w-[14ch] animate-rise font-serif text-[clamp(48px,6.4vw,96px)] font-normal leading-[0.95] tracking-[-0.025em] text-ink text-balance">
                            Interior Design Blog
                        </h1>
                        <p
                            className="mt-6 max-w-[34rem] animate-rise text-[17px] leading-[1.55] text-ink-2 text-pretty"
                            style={{ animationDelay: "90ms" }}
                        >
                            Practical guides on AI room design, interior styles, and how to redesign spaces
                            without a designer. New posts every week.
                        </p>
                    </div>
                </section>

                {/* Posts grid */}
                <section className="container-page pb-20 md:pb-28">
                    <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
                        {posts.map((post) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                </section>

                {/* Cross-links to other content sections */}
                <RelatedLinks heading="Explore more" links={EXPLORE_LINKS} className="pb-20 md:pb-28" />
            </PageTransition>
        </>
    );
}

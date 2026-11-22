import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import { faqSchema, breadcrumbSchema, blogPostingSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import {
    getBlogPostBySlug,
    getAllBlogSlugs,
} from "@/lib/seo/blog-data";
import {
    getRelatedBlogLinksForPost,
    getComparisonLinksForPost,
} from "@/lib/seo/internal-links";
import { BlogPostContent } from "@/components/seo/blog-post-content";
import { JsonLd } from "@/components/seo/json-ld";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return {};
    }

    return createMetadata({
        title: { absolute: post.title },
        description: post.metaDescription,
        path: `/blog/${slug}`,
        keywords: post.keywords,
    });
}

export default async function BlogSlugPage({ params }: Props) {
    const { slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const postUrl = `${SITE_URL}/blog/${slug}`;

    const schemas = [
        breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Blog", url: `${SITE_URL}/blog` },
            { name: post.title, url: postUrl },
        ]),
        blogPostingSchema({
            title: post.title,
            description: post.metaDescription,
            authorName: post.authorName ?? "Thanos Kazakis",
            publishedDate: post.publishedDate,
            modifiedDate: post.updatedDate,
            url: postUrl,
        }),
        ...(post.faqs && post.faqs.length > 0 ? [faqSchema({ items: post.faqs, pageUrl: postUrl })] : []),
    ];

    return (
        <>
            <JsonLd schemas={schemas} />
            <BlogPostContent
                post={post}
                relatedPostLinks={getRelatedBlogLinksForPost({ slug })}
                comparisonLinks={getComparisonLinksForPost(slug)}
            />
        </>
    );
}

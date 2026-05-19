import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";
import { getAllCompetitorSlugs } from "@/lib/seo/competitor-data";
import { BLOG_POSTS } from "@/lib/seo/blog-data";
import { PRIORITY_DESIGN_SLUGS, TOP_DESIGN_SLUGS } from "@/lib/seo/priority-pages";

const VS_SLUGS = ["roomgpt", "interior-ai", "reimaginehome", "decorai"];

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_URL;

    const siteLastUpdated = new Date("2026-05-19");
    const legalLastUpdated = new Date("2024-12-01");

    const corePages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: siteLastUpdated,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: siteLastUpdated,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/virtual-staging`,
            lastModified: siteLastUpdated,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: siteLastUpdated,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: siteLastUpdated,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: legalLastUpdated,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: legalLastUpdated,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    const designHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/design`,
            lastModified: siteLastUpdated,
            changeFrequency: "monthly",
            priority: 0.9,
        },
    ];

    // Only ship curated, high-signal design pages to the sitemap.
    // Other (theme, room) combos still render but are noindex — they
    // exist for users browsing, but Google won't waste crawl budget on them.
    const designPages: MetadataRoute.Sitemap = PRIORITY_DESIGN_SLUGS.map((slug) => ({
        url: `${baseUrl}/design/${slug}`,
        lastModified: siteLastUpdated,
        changeFrequency: "monthly" as const,
        priority: TOP_DESIGN_SLUGS.has(slug) ? 0.8 : 0.6,
    }));

    const alternativesHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/alternatives`,
            lastModified: siteLastUpdated,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    const alternativePages: MetadataRoute.Sitemap = getAllCompetitorSlugs().map(
        (slug) => ({
            url: `${baseUrl}/alternatives/${slug}`,
            lastModified: siteLastUpdated,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })
    );

    const vsPages: MetadataRoute.Sitemap = VS_SLUGS.map((slug) => ({
        url: `${baseUrl}/vs/${slug}`,
        lastModified: siteLastUpdated,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    const blogHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/blog`,
            lastModified: siteLastUpdated,
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];

    const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedDate || post.publishedDate),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [
        ...corePages,
        ...designHub,
        ...designPages,
        ...alternativesHub,
        ...alternativePages,
        ...vsPages,
        ...blogHub,
        ...blogPages,
    ];
}

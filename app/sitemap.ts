import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";
import { getAllDesignSlugs } from "@/lib/seo/design-data";
import { getAllCompetitorSlugs } from "@/lib/seo/competitor-data";
import { BLOG_POSTS } from "@/lib/seo/blog-data";

// Top-volume design slugs that get boosted priority
const TOP_DESIGN_SLUGS = new Set([
    "modern-living-room",
    "scandinavian-living-room",
    "minimalist-living-room",
    "modern-bedroom",
    "scandinavian-bedroom",
    "bohemian-bedroom",
    "minimalist-bedroom",
    "modern-kitchen",
    "industrial-kitchen",
    "farmhouse-kitchen",
    "luxury-bathroom",
    "coastal-living-room",
    "japandi-living-room",
    "art-deco-living-room",
    "modern-bathroom",
]);

// All vs competitor slugs
const VS_SLUGS = ["roomgpt", "interior-ai", "reimaginehome"];

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_URL;

    // Use stable dates instead of new Date() to avoid wasting crawl budget
    const siteLastUpdated = new Date("2026-03-25");
    const legalLastUpdated = new Date("2024-12-01");

    // Core pages
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

    // Design hub + 196 design pages
    const designHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/design`,
            lastModified: siteLastUpdated,
            changeFrequency: "monthly",
            priority: 0.9,
        },
    ];

    const designPages: MetadataRoute.Sitemap = getAllDesignSlugs().map((slug) => ({
        url: `${baseUrl}/design/${slug}`,
        lastModified: siteLastUpdated,
        changeFrequency: "monthly" as const,
        priority: TOP_DESIGN_SLUGS.has(slug) ? 0.8 : 0.6,
    }));

    // Alternatives hub + competitor pages + vs pages
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

    // Blog hub + blog posts with real publish/update dates
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

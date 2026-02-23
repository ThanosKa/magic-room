import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";
import { getAllDesignSlugs } from "@/lib/seo/design-data";
import { getAllCompetitorSlugs } from "@/lib/seo/competitor-data";
import { getAllBlogSlugs } from "@/lib/seo/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_URL;
    const lastModified = new Date();

    // Core pages
    const corePages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    // Design hub + 56 design pages
    const designHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/design`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.9,
        },
    ];

    const designPages: MetadataRoute.Sitemap = getAllDesignSlugs().map((slug) => ({
        url: `${baseUrl}/design/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // Alternatives hub + 4 competitor pages + 1 vs page
    const alternativesHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/alternatives`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    const alternativePages: MetadataRoute.Sitemap = getAllCompetitorSlugs().map((slug) => ({
        url: `${baseUrl}/alternatives/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    const vsPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/vs/roomgpt`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.7,
        },
    ];

    // Blog hub + 10 blog posts
    const blogHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/blog`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.8,
        },
    ];

    const blogPages: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified,
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

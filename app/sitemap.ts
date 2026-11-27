import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";
import {
    getAllCompetitorSlugs,
    VS_SLUGS,
} from "@/lib/seo/competitor-data";
import { BLOG_POSTS } from "@/lib/seo/blog-data";
import { PRIORITY_DESIGN_SLUGS, TOP_DESIGN_SLUGS } from "@/lib/seo/priority-pages";

const BASELINE_LAST_UPDATED = new Date("2026-07-29");
const PASS_2026_10_LAST_UPDATED = new Date("2026-10-01");
const LEGAL_LAST_UPDATED = new Date("2026-11-07");
const RIGHTS_2026_11_LAST_UPDATED = new Date("2026-11-01");
const CLAIMS_2026_11_LAST_UPDATED = new Date("2026-11-09");
const MODEL_CLAIMS_2026_11_LAST_UPDATED = new Date("2026-11-13");
const WAIT_TIME_2026_11_LAST_UPDATED = new Date("2026-11-27");
const DESIGN_PAGE_DATES: Record<string, Date> = {
    "art-deco-bedroom": new Date("2026-11-23"),
    "modern-sunroom": new Date("2026-11-25"),
    "scandinavian-bedroom": new Date("2026-11-18"),
};

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_URL;

    const corePages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
            lastModified: WAIT_TIME_2026_11_LAST_UPDATED,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: RIGHTS_2026_11_LAST_UPDATED,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/virtual-staging`,
            lastModified: WAIT_TIME_2026_11_LAST_UPDATED,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: PASS_2026_10_LAST_UPDATED,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: BASELINE_LAST_UPDATED,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: LEGAL_LAST_UPDATED,
            changeFrequency: "yearly",
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: RIGHTS_2026_11_LAST_UPDATED,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    const designHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/design`,
            lastModified: WAIT_TIME_2026_11_LAST_UPDATED,
            changeFrequency: "monthly",
            priority: 0.9,
        },
    ];

    const designPages: MetadataRoute.Sitemap = PRIORITY_DESIGN_SLUGS.map((slug) => ({
        url: `${baseUrl}/design/${slug}`,
        lastModified: DESIGN_PAGE_DATES[slug] ?? PASS_2026_10_LAST_UPDATED,
        changeFrequency: "monthly" as const,
        priority: TOP_DESIGN_SLUGS.has(slug) ? 0.8 : 0.6,
    }));

    const alternativesHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/alternatives`,
            lastModified: MODEL_CLAIMS_2026_11_LAST_UPDATED,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    const alternativePages: MetadataRoute.Sitemap = getAllCompetitorSlugs().map(
        (slug) => ({
            url: `${baseUrl}/alternatives/${slug}`,
            lastModified: MODEL_CLAIMS_2026_11_LAST_UPDATED,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })
    );

    const vsPages: MetadataRoute.Sitemap = VS_SLUGS.map((slug) => ({
        url: `${baseUrl}/vs/${slug}`,
        lastModified: CLAIMS_2026_11_LAST_UPDATED,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    const blogHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/blog`,
            lastModified: BASELINE_LAST_UPDATED,
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

    const entries = [
        ...corePages,
        ...designHub,
        ...designPages,
        ...alternativesHub,
        ...alternativePages,
        ...vsPages,
        ...blogHub,
        ...blogPages,
    ];

    const seen = new Set<string>();
    return entries.filter((entry) => {
        if (seen.has(entry.url)) return false;
        seen.add(entry.url);
        return true;
    });
}

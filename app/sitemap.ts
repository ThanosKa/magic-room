import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";
import {
    getAllCompetitorSlugs,
    VS_SLUGS,
} from "@/lib/seo/competitor-data";
import { BLOG_POSTS } from "@/lib/seo/blog-data";
import { PRIORITY_DESIGN_SLUGS, TOP_DESIGN_SLUGS } from "@/lib/seo/priority-pages";

/**
 * Every URL emitted here must satisfy all four of:
 *   1. It renders (no 404) — enforced by deriving slugs from the same data
 *      modules the routes use, never from a hand-maintained copy.
 *   2. It is indexable (no `robots: { index: false }` on the route).
 *   3. It self-canonicals to exactly this absolute, non-trailing-slash URL.
 *   4. It is reachable by at least one internal link.
 *
 * Deliberately ABSENT and correct to be absent:
 *   /generate            — noindex (utility/app surface behind auth)
 *   /design/<non-priority> — the 158 (theme, room) combos outside
 *                          PRIORITY_DESIGN_SLUGS are noindex on purpose
 *   /design/<pruned>     — noindex via lib/seo/pruned.ts (X-Robots-Tag header)
 *   /vs/<redirected>     — 308 to /alternatives/<slug> via lib/seo/pruned.ts
 *   /api/*               — disallowed in robots.txt
 *   404 / error routes   — noindex
 */

// Honest per-surface dates. Only bump a surface when it actually changed.
//   - BASELINE: last broad content revision (per-slug intros + FAQ blocks on
//     the priority design pages, 2026-07-29). Surfaces untouched since then.
//   - PASS_2026_10: surfaces edited in the 2026-10 SEO pass (HowTo JSON-LD
//     removed, /vs consolidated into /alternatives, internal links and hub
//     listings changed, pruned combos removed from the design hub).
//   - LEGAL: matches the "Last Updated: December 2024" line on /privacy and /terms.
const BASELINE_LAST_UPDATED = new Date("2026-07-29");
const PASS_2026_10_LAST_UPDATED = new Date("2026-10-01");
const LEGAL_LAST_UPDATED = new Date("2024-12-01");

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_URL;

    const corePages: MetadataRoute.Sitemap = [
        {
            // Trailing slash on purpose: the homepage <loc> must match the URL
            // Google indexes ("https://magic-room.dev/", as it appears in the
            // Search Console Pages report) and the canonical emitted by
            // createMetadata({ path: "" }). The bare origin does not.
            url: `${baseUrl}/`,
            lastModified: PASS_2026_10_LAST_UPDATED,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: BASELINE_LAST_UPDATED,
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/virtual-staging`,
            lastModified: PASS_2026_10_LAST_UPDATED,
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
            lastModified: LEGAL_LAST_UPDATED,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    const designHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/design`,
            lastModified: PASS_2026_10_LAST_UPDATED,
            changeFrequency: "monthly",
            priority: 0.9,
        },
    ];

    // Only ship curated, high-signal design pages to the sitemap.
    // Other (theme, room) combos still render but are noindex — they
    // exist for users browsing, but Google won't waste crawl budget on them.
    const designPages: MetadataRoute.Sitemap = PRIORITY_DESIGN_SLUGS.map((slug) => ({
        url: `${baseUrl}/design/${slug}`,
        lastModified: PASS_2026_10_LAST_UPDATED,
        changeFrequency: "monthly" as const,
        priority: TOP_DESIGN_SLUGS.has(slug) ? 0.8 : 0.6,
    }));

    const alternativesHub: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/alternatives`,
            lastModified: PASS_2026_10_LAST_UPDATED,
            changeFrequency: "monthly",
            priority: 0.8,
        },
    ];

    const alternativePages: MetadataRoute.Sitemap = getAllCompetitorSlugs().map(
        (slug) => ({
            url: `${baseUrl}/alternatives/${slug}`,
            lastModified: PASS_2026_10_LAST_UPDATED,
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })
    );

    const vsPages: MetadataRoute.Sitemap = VS_SLUGS.map((slug) => ({
        url: `${baseUrl}/vs/${slug}`,
        lastModified: PASS_2026_10_LAST_UPDATED,
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

    // Guard against a duplicate <loc> ever shipping (e.g. a slug appearing in
    // both PRIORITY_DESIGN_SLUGS tiers, or a competitor listed twice).
    // Duplicate URLs in a sitemap are a known trigger for Google ignoring it.
    const seen = new Set<string>();
    return entries.filter((entry) => {
        if (seen.has(entry.url)) return false;
        seen.add(entry.url);
        return true;
    });
}

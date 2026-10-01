/**
 * Reversible SEO pruning list. One typed list drives four behaviours:
 *
 *   1. `X-Robots-Tag: noindex, follow` response header (next.config.ts headers())
 *   2. Exclusion from app/sitemap.ts
 *   3. Permanent redirects (next.config.ts redirects())
 *   4. Removal from hub listings and internal-link pools (via PRIORITY_DESIGN_SLUGS
 *      and VS_SLUGS, which are derived from this list)
 *
 * To revert an entry, delete it. See PRUNED.md at the repo root.
 *
 * Keep thresholds (never prune): >= 1 click in either GSC export, or
 * >= 30 impressions in the 2026-10-01 export.
 */

export interface IPrunedGsc {
    clicks: number;
    impressions: number;
}

interface IPrunedBase {
    path: string;
    reason: string;
    /** 2026-10-01 export (92 days to 2026-09-28). */
    gsc: IPrunedGsc;
    /** July 2026 export, kept so the keep-threshold can be audited. */
    gscJuly: IPrunedGsc;
}

export interface INoindexPruned extends IPrunedBase {
    action: "noindex";
}

export interface IRedirectPruned extends IPrunedBase {
    action: "redirect";
    target: string;
}

export type PrunedEntry = INoindexPruned | IRedirectPruned;

function designPrune(input: {
    slug: string;
    clicks: number;
    impressions: number;
    julyClicks: number;
    julyImpressions: number;
}): INoindexPruned {
    return {
        path: `/design/${input.slug}`,
        action: "noindex",
        reason: "Below keep threshold (0 clicks, <30 impressions); templated (theme, room) combo.",
        gsc: { clicks: input.clicks, impressions: input.impressions },
        gscJuly: { clicks: input.julyClicks, impressions: input.julyImpressions },
    };
}

function vsRedirect(input: {
    slug: string;
    impressions: number;
    julyImpressions: number;
}): IRedirectPruned {
    return {
        path: `/vs/${input.slug}`,
        action: "redirect",
        target: `/alternatives/${input.slug}`,
        reason: "Head-to-head page duplicates /alternatives/{slug} (33-36% shared sentences); no clicks.",
        gsc: { clicks: 0, impressions: input.impressions },
        gscJuly: { clicks: 0, impressions: input.julyImpressions },
    };
}

// /vs/reimaginehome is intentionally NOT listed: it earned 1 click in each export.
export const PRUNED: readonly PrunedEntry[] = [
    designPrune({ slug: "minimalist-living-room", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "modern-bedroom", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "bohemian-bedroom", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "modern-kitchen", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "luxury-bathroom", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "japandi-living-room", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "art-deco-living-room", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "industrial-kitchen", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "minimalist-bedroom", clicks: 0, impressions: 24, julyClicks: 0, julyImpressions: 5 }),
    designPrune({ slug: "farmhouse-home-theater", clicks: 0, impressions: 9, julyClicks: 0, julyImpressions: 23 }),
    designPrune({ slug: "farmhouse-bathroom", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 13 }),
    designPrune({ slug: "farmhouse-bedroom", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 1 }),
    designPrune({ slug: "farmhouse-dining-room", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 4 }),
    designPrune({ slug: "coastal-bedroom", clicks: 0, impressions: 10, julyClicks: 0, julyImpressions: 12 }),
    designPrune({ slug: "coastal-walk-in-closet", clicks: 0, impressions: 18, julyClicks: 0, julyImpressions: 5 }),
    designPrune({ slug: "art-deco-sunroom", clicks: 0, impressions: 5, julyClicks: 0, julyImpressions: 9 }),
    designPrune({ slug: "art-deco-dining-room", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "japandi-bedroom", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "japandi-mudroom", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "modern-home-theater", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "mediterranean-living-room", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "bohemian-living-room", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "luxury-living-room", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "luxury-bedroom", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "industrial-living-room", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "vintage-bedroom", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "modern-office", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "industrial-office", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    designPrune({ slug: "scandinavian-office", clicks: 0, impressions: 0, julyClicks: 0, julyImpressions: 0 }),
    vsRedirect({ slug: "roomgpt", impressions: 0, julyImpressions: 0 }),
    vsRedirect({ slug: "decorai", impressions: 5, julyImpressions: 11 }),
    vsRedirect({ slug: "interior-ai", impressions: 0, julyImpressions: 0 }),
];

export const PRUNED_NOINDEX_PATHS: readonly string[] = PRUNED.flatMap((entry) =>
    entry.action === "noindex" ? [entry.path] : []
);

export const PRUNED_REDIRECTS: readonly IRedirectPruned[] = PRUNED.flatMap((entry) =>
    entry.action === "redirect" ? [entry] : []
);

const PRUNED_PATH_SET = new Set(PRUNED.map((entry) => entry.path));

export function isPrunedPath(path: string): boolean {
    return PRUNED_PATH_SET.has(path);
}

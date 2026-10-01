/**
 * Internal linking layer.
 *
 * Why this file exists
 * --------------------
 * Search Console's internal-links export showed a hard cliff: ~9 pages sat at
 * 31-35 inbound links (which is just the sitewide header/footer template) and
 * everything else sat at 4-5. Two structural causes:
 *
 *   1. Sibling "related design" blocks selected candidates with
 *      `.sort(localeCompare).slice(0, 6)`. That is deterministic *and biased* —
 *      alphabetically-late slugs (scandinavian-*, vintage-*, modern-*) were
 *      never selected by anyone, so they starved at 4 inbound links while
 *      art-deco-* and bohemian-* were linked from every sibling.
 *   2. Blog posts, /vs/* pages and /gallery had no contextual inbound links at
 *      all — they were reachable only from their own index page.
 *
 * `rotatingSlice` fixes (1) with an exact round-robin: with a candidate list of
 * length L and a window of N, every candidate is selected by exactly N of the L
 * linking pages. No page starves, no page hoards.
 *
 * Everything else here is the contextual (non-nav) linking layer: design -> blog,
 * design -> comparison, blog -> blog, comparison -> design.
 *
 * Anchor-text rule enforced throughout: the anchor contains the target page's
 * actual GSC query phrase. Never "click here", "learn more", or "read more".
 */

import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/seo/blog-data";
import { COMPETITORS, getCompetitorBySlug, hasVsPage } from "@/lib/seo/competitor-data";
import {
    THEME_DATA,
    ROOM_DATA,
    IThemeData,
    IRoomData,
} from "@/lib/seo/design-data";
import { isPriorityDesignSlug, PRIORITY_DESIGN_SLUGS } from "@/lib/seo/priority-pages";
import { humanizeDesignSlug } from "@/lib/seo/slug-format";

export interface IContextualLink {
    href: string;
    /** Anchor text — must contain the target page's real query phrase. */
    label: string;
    description?: string;
}

/* -------------------------------------------------------------------------- */
/* Even-distribution selection                                                */
/* -------------------------------------------------------------------------- */

/**
 * Take `count` items from `items`, starting at `offset` and wrapping around.
 *
 * Unlike `sort().slice(0, count)`, every item is selected the same number of
 * times across all offsets, so inbound links are distributed evenly instead of
 * piling onto whichever slugs happen to sort first.
 */
function rotatingSlice<T>(items: T[], offset: number, count: number): T[] {
    if (items.length === 0) return [];
    const take = Math.min(count, items.length);
    const start = ((offset % items.length) + items.length) % items.length;
    const out: T[] = [];
    for (let i = 0; i < take; i += 1) {
        out.push(items[(start + i) % items.length]);
    }
    return out;
}

/** Stable non-cryptographic hash so rotation offsets survive rebuilds. */
function stableHash(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

/* -------------------------------------------------------------------------- */
/* Sibling design pages (same theme / same room)                              */
/* -------------------------------------------------------------------------- */

const SIBLING_LINKS_PER_SECTION = 6;

/**
 * Picks the sibling pages to link to, as an exact round-robin.
 *
 * Rotating by a *hash* of the slug spreads links but not evenly — hashes
 * collide and cluster. Rotating by the page's own index in the candidate list
 * is a true round-robin: with L candidates and a window of N, every candidate
 * is linked by exactly N of the L sibling pages. No page starves, none hoards.
 */
function roundRobinSiblings<T extends { slug: string }>(
    candidates: T[],
    ownSlug: string,
    pageSlug: string,
    size: number
): T[] {
    const ownIndex = candidates.findIndex((c) => c.slug === ownSlug);
    // Non-priority combos are not in the candidate list; fall back to a stable
    // hash offset so they still link somewhere deterministic.
    const offset = ownIndex >= 0 ? ownIndex + 1 : stableHash(pageSlug);
    // `rotatingSlice` already clamps `size` to the candidate count.
    return rotatingSlice(candidates, offset, size).filter((c) => c.slug !== ownSlug);
}

/**
 * Other themes to show for the same room type, and other room types to show for
 * the same theme.
 *
 * Only (theme, room) combinations in the indexable priority set are candidates —
 * sending crawl signal to noindex pages wastes Google's crawl budget and
 * signals scaled content.
 */
export function getSiblingThemes(
    designSlug: string,
    theme: string,
    roomType: string
): IThemeData[] {
    return roundRobinSiblings(
        Object.values(THEME_DATA)
            .filter((candidate) => isPriorityDesignSlug(`${candidate.slug}-${roomType}`))
            .sort((a, b) => a.slug.localeCompare(b.slug)),
        theme,
        `${designSlug}:themes`,
        SIBLING_LINKS_PER_SECTION + 1
    );
}

export function getSiblingRooms(
    designSlug: string,
    theme: string,
    roomType: string
): IRoomData[] {
    return roundRobinSiblings(
        Object.values(ROOM_DATA)
            .filter((candidate) => isPriorityDesignSlug(`${theme}-${candidate.slug}`))
            .sort((a, b) => a.slug.localeCompare(b.slug)),
        roomType,
        `${designSlug}:rooms`,
        SIBLING_LINKS_PER_SECTION + 1
    );
}

/* -------------------------------------------------------------------------- */
/* Structurally isolated design pages                                         */
/* -------------------------------------------------------------------------- */

/**
 * A few indexable design pages are the *only* priority combination for their
 * room type or their theme — `coastal-walk-in-closet` and `japandi-mudroom`, for
 * example. The sibling blocks on other design pages can never reach them,
 * because a sibling link is only ever `{sameTheme}-{otherRoom}` or
 * `{otherTheme}-{sameRoom}` and no such indexable page exists.
 *
 * Round-robin fixes distribution, but it cannot manufacture neighbours. This
 * computes the sparsely-connected pages from the priority set itself — no
 * hand-maintained list to drift — and rotates them through every design page so
 * they always pick up inbound links.
 */
const SPARSELY_CONNECTED_DESIGN_SLUGS: string[] = (() => {
    // Both halves of a slug can contain hyphens (art-deco, walk-in-closet), so
    // split against the known theme/room vocabularies rather than on "-".
    const themeSlugs = Object.values(THEME_DATA).map((t) => t.slug);
    const roomSlugs = Object.values(ROOM_DATA).map((r) => r.slug);

    const split = (slug: string): { theme: string; room: string } | null => {
        const theme = themeSlugs.find((t) => slug.startsWith(`${t}-`));
        if (!theme) return null;
        const room = slug.slice(theme.length + 1);
        return roomSlugs.includes(room) ? { theme, room } : null;
    };

    const parsed = PRIORITY_DESIGN_SLUGS.flatMap((slug) => {
        const parts = split(slug);
        return parts ? [{ slug, parts }] : [];
    });

    return parsed
        .map(({ slug, parts }) => ({
            slug,
            // How many indexable siblings can structurally reach this page.
            degree: parsed.filter(
                (other) =>
                    other.slug !== slug &&
                    (other.parts.theme === parts.theme || other.parts.room === parts.room)
            ).length,
        }))
        .sort((a, b) => a.degree - b.degree || a.slug.localeCompare(b.slug))
        .slice(0, 10)
        .map((entry) => entry.slug);
})();

/** Rotating chips pointing at the least-connected indexable design pages. */
export function getUnderlinkedDesignLinks(currentSlug: string, count = 4): IContextualLink[] {
    return rotatingSlice(
        SPARSELY_CONNECTED_DESIGN_SLUGS.filter((s) => s !== currentSlug),
        stableHash(currentSlug),
        count
    ).map((slug) => ({
        href: `/design/${slug}`,
        label: `${humanizeDesignSlug(slug)} design ideas`,
    }));
}

/* -------------------------------------------------------------------------- */
/* Design page -> blog post                                                   */
/* -------------------------------------------------------------------------- */

/** Reverse index of `IBlogPost.relatedDesignSlugs`: design slug -> blog slugs. */
const DESIGN_TO_BLOG: Record<string, string[]> = (() => {
    const index: Record<string, string[]> = {};
    for (const post of BLOG_POSTS) {
        for (const designSlug of post.relatedDesignSlugs) {
            (index[designSlug] ??= []).push(post.slug);
        }
    }
    return index;
})();

/** Room-type specific guides. */
const ROOM_TO_BLOG: Record<string, string[]> = {
    "living-room": ["how-to-redesign-living-room-with-ai"],
    bedroom: ["bedroom-redesign-with-ai"],
    office: ["home-office-ai-design"],
    kitchen: ["industrial-kitchen-design-ideas"],
};

/** Theme specific guides. */
const THEME_TO_BLOG: Record<string, string[]> = {
    scandinavian: ["scandinavian-design-small-spaces"],
    industrial: ["industrial-kitchen-design-ideas"],
    bohemian: ["bohemian-bedroom-decor-guide"],
    modern: ["modern-vs-minimalist-interior-design"],
    minimalist: ["modern-vs-minimalist-interior-design"],
};

/**
 * Evergreen guides used to top up the related list. Rotated per design slug so
 * every post picks up inbound links from a different slice of the 38 indexable
 * design pages rather than all of them pointing at the same two posts.
 */
const EVERGREEN_BLOG: string[] = [
    "how-to-choose-interior-design-theme",
    "ai-interior-design-tools-how-they-work",
    "interior-design-on-a-budget-ai",
    "best-ai-interior-design-tools-2026",
    "ai-home-staging-before-selling",
    "virtual-staging-real-estate-guide",
    "modern-vs-minimalist-interior-design",
    "how-to-redesign-living-room-with-ai",
    "bedroom-redesign-with-ai",
    "home-office-ai-design",
    "scandinavian-design-small-spaces",
    "bohemian-bedroom-decor-guide",
    "industrial-kitchen-design-ideas",
];

/**
 * Blog anchor + teaser, built once. The excerpt is clipped to 130 chars because
 * these render inside a card, not as body copy.
 */
function blogLink(slug: string): IContextualLink {
    const post = getBlogPostBySlug(slug);
    return {
        href: `/blog/${slug}`,
        label: post?.title ?? "",
        description: post?.excerpt?.slice(0, 130),
    };
}

/**
 * Guides to surface on `/design/[slug]`. Returns up to `count` blog posts,
 * most-relevant first, topped up from the evergreen pool via rotation.
 */
export function getRelatedBlogLinksForDesign(
    designSlug: string,
    theme: string,
    roomType: string,
    count = 4
): IContextualLink[] {
    const ordered: string[] = [
        ...(DESIGN_TO_BLOG[designSlug] ?? []),
        ...(ROOM_TO_BLOG[roomType] ?? []),
        ...(THEME_TO_BLOG[theme] ?? []),
    ];

    const seen = new Set(ordered);
    const topUp = rotatingSlice(
        EVERGREEN_BLOG.filter((s) => !seen.has(s)),
        stableHash(designSlug),
        count
    );

    const slugs = Array.from(new Set([...ordered, ...topUp])).slice(0, count);

    // Pre-filter: the room/theme maps above are hand-maintained, so a slug in
    // them may not correspond to a real post.
    return slugs.filter((slug) => getBlogPostBySlug(slug)).map(blogLink);
}

/* -------------------------------------------------------------------------- */
/* Blog post -> blog post                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Related posts scored by shared `relatedDesignSlugs` and shared keywords, then
 * topped up by rotation so no post is left with a single inbound link.
 */
export function getRelatedBlogLinksForPost(slug: string, count = 3): IContextualLink[] {
    const current = getBlogPostBySlug(slug);
    if (!current) return [];

    const currentDesigns = new Set(current.relatedDesignSlugs);
    const currentKeywords = new Set(current.keywords.map((k) => k.toLowerCase()));

    const scored = BLOG_POSTS.filter((p) => p.slug !== slug)
        .map((p) => {
            const designOverlap = p.relatedDesignSlugs.filter((d) => currentDesigns.has(d)).length;
            const keywordOverlap = p.keywords.filter((k) =>
                currentKeywords.has(k.toLowerCase())
            ).length;
            return { post: p, score: designOverlap * 2 + keywordOverlap };
        })
        .sort((a, b) => b.score - a.score || a.post.slug.localeCompare(b.post.slug));

    const strong = scored.filter((s) => s.score > 0).map((s) => s.post.slug);
    const weakPool = scored.filter((s) => s.score === 0).map((s) => s.post.slug);
    const topUp = rotatingSlice(weakPool, stableHash(slug), count);

    return Array.from(new Set([...strong, ...topUp])).slice(0, count).map(blogLink);
}

/* -------------------------------------------------------------------------- */
/* Comparison links (design + blog -> money pages)                            */
/* -------------------------------------------------------------------------- */

/**
 * Anchor text for competitor pages. `/alternatives/[slug]` targets the singular
 * "<name> alternative" query; `/vs/[slug]` targets "magic room vs <name>".
 * These were previously swapped on the alternative pages.
 */
function competitorName(competitorSlug: string): string {
    return getCompetitorBySlug(competitorSlug)?.name ?? competitorSlug;
}

function alternativeLink(competitorSlug: string): IContextualLink {
    const name = competitorName(competitorSlug);
    return {
        href: `/alternatives/${competitorSlug}`,
        label: `${name} alternative`,
        description: `Why people switch from ${name}, and what changes when they do.`,
    };
}

function vsLink(competitorSlug: string): IContextualLink {
    return {
        href: `/vs/${competitorSlug}`,
        label: `Magic Room vs ${competitorName(competitorSlug)}`,
        description: "Side-by-side on AI model, photo privacy, pricing and output quality.",
    };
}

/**
 * Comparison block for a design page or a blog post: the `/alternatives` hub
 * plus a rotated pair of competitor pages.
 *
 * Rotation is the point — without it each of the four competitor pages would be
 * linked from every design page and every post with the same anchor, which
 * dilutes the anchor signal instead of concentrating it.
 */
function comparisonLinks(
    pageSlug: string,
    hub: { label: string; description: string },
    vsTargets: "first" | "all"
): IContextualLink[] {
    const rotated = rotatingSlice(
        COMPETITORS.map((c) => c.slug),
        stableHash(pageSlug),
        2
    );

    return [
        { href: "/alternatives", ...hub },
        ...rotated.map(alternativeLink),
        // Most /vs pages now 301 to /alternatives (lib/seo/pruned.ts); never link a redirect.
        ...(vsTargets === "all" ? rotated : rotated.slice(0, 1)).filter(hasVsPage).map(vsLink),
    ];
}

/**
 * Comparison block for `/design/[slug]`. Rotated so each of the four competitor
 * pages picks up inbound links from a quarter of the design catalogue rather
 * than the same page being linked from all of them.
 */
export function getComparisonLinksForDesign(designSlug: string): IContextualLink[] {
    return comparisonLinks(
        designSlug,
        {
            label: "best RoomGPT alternatives for AI interior design",
            description:
                "All four tools compared on AI model, photo retention, pricing model and output quality.",
        },
        "first"
    );
}

/* -------------------------------------------------------------------------- */
/* Competitor pages -> design catalogue                                       */
/* -------------------------------------------------------------------------- */

/**
 * Design pages to surface from a competitor page. Rotated per competitor slug so
 * the four comparison pages feed four different sets of design pages.
 */
const DESIGN_LINK_POOL: { slug: string; label: string }[] = [
    { slug: "art-deco-bedroom", label: "Art Deco bedroom ideas" },
    { slug: "scandinavian-living-room", label: "Scandinavian living room ideas" },
    { slug: "modern-living-room", label: "modern living room design ideas" },
    { slug: "scandinavian-bedroom", label: "Scandinavian bedroom design ideas" },
    { slug: "industrial-kitchen", label: "industrial kitchen design ideas" },
    { slug: "coastal-living-room", label: "coastal living room design ideas" },
    { slug: "minimalist-living-room", label: "minimalist living room design ideas" },
    { slug: "japandi-living-room", label: "Japandi living room design ideas" },
    { slug: "modern-bedroom", label: "modern bedroom design ideas" },
    { slug: "luxury-bathroom", label: "luxury bathroom design ideas" },
    { slug: "farmhouse-kitchen", label: "farmhouse kitchen design ideas" },
    { slug: "bohemian-bedroom", label: "bohemian bedroom decor ideas" },
];

export function getDesignLinksForCompetitor(competitorSlug: string, count = 4): IContextualLink[] {
    return rotatingSlice(
        DESIGN_LINK_POOL.filter((d) => isPriorityDesignSlug(d.slug)),
        stableHash(competitorSlug),
        count
    ).map((d) => ({
        href: `/design/${d.slug}`,
        label: d.label,
        description: "Generate this style on a photo of your own room.",
    }));
}

/** Guides worth reading from a competitor page. */
export function getBlogLinksForCompetitor(competitorSlug: string, count = 3): IContextualLink[] {
    const priority = [
        "best-ai-interior-design-tools-2026",
        "ai-interior-design-tools-how-they-work",
    ];
    const topUp = rotatingSlice(
        EVERGREEN_BLOG.filter((s) => !priority.includes(s)),
        stableHash(competitorSlug),
        count
    );
    return Array.from(new Set([...priority, ...topUp])).slice(0, count).map(blogLink);
}

/* -------------------------------------------------------------------------- */
/* Blog post -> money pages                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Comparison links for a blog post. Rotated per post slug so the four
 * alternative pages and four vs pages each collect roughly a quarter of the
 * blog's outbound comparison links, instead of every post linking to all four
 * with identical anchors (which dilutes the anchor signal).
 */
export function getComparisonLinksForPost(slug: string): IContextualLink[] {
    return comparisonLinks(
        slug,
        {
            label: "RoomGPT alternatives compared",
            description:
                "Magic Room, RoomGPT, Interior AI, DecorAI and Reimagine Home on privacy, pricing and model quality.",
        },
        "all"
    );
}

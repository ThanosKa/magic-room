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
    label: string;
    description?: string;
}

function rotatingSlice<T>({ items, offset, count }: { items: T[]; offset: number; count: number }): T[] {
    if (items.length === 0) return [];
    const take = Math.min(count, items.length);
    const start = ((offset % items.length) + items.length) % items.length;
    const out: T[] = [];
    for (let i = 0; i < take; i += 1) {
        out.push(items[(start + i) % items.length]);
    }
    return out;
}

function stableHash(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}

const SIBLING_LINKS_PER_SECTION = 6;

function roundRobinSiblings<T extends { slug: string }>({
    candidates,
    ownSlug,
    pageSlug,
    size,
}: {
    candidates: T[];
    ownSlug: string;
    pageSlug: string;
    size: number;
}): T[] {
    const ownIndex = candidates.findIndex((c) => c.slug === ownSlug);
    const offset = ownIndex >= 0 ? ownIndex + 1 : stableHash(pageSlug);
    return rotatingSlice({ items: candidates, offset, count: size }).filter((c) => c.slug !== ownSlug);
}

export function getSiblingThemes({
    designSlug,
    theme,
    roomType,
}: {
    designSlug: string;
    theme: string;
    roomType: string;
}): IThemeData[] {
    return roundRobinSiblings({
        candidates: Object.values(THEME_DATA)
            .filter((candidate) => isPriorityDesignSlug(`${candidate.slug}-${roomType}`))
            .sort((a, b) => a.slug.localeCompare(b.slug)),
        ownSlug: theme,
        pageSlug: `${designSlug}:themes`,
        size: SIBLING_LINKS_PER_SECTION + 1,
    });
}

export function getSiblingRooms({
    designSlug,
    theme,
    roomType,
}: {
    designSlug: string;
    theme: string;
    roomType: string;
}): IRoomData[] {
    return roundRobinSiblings({
        candidates: Object.values(ROOM_DATA)
            .filter((candidate) => isPriorityDesignSlug(`${theme}-${candidate.slug}`))
            .sort((a, b) => a.slug.localeCompare(b.slug)),
        ownSlug: roomType,
        pageSlug: `${designSlug}:rooms`,
        size: SIBLING_LINKS_PER_SECTION + 1,
    });
}

const SPARSELY_CONNECTED_DESIGN_SLUGS: string[] = (() => {
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

export function getUnderlinkedDesignLinks({
    currentSlug,
    count = 4,
}: {
    currentSlug: string;
    count?: number;
}): IContextualLink[] {
    return rotatingSlice({
        items: SPARSELY_CONNECTED_DESIGN_SLUGS.filter((s) => s !== currentSlug),
        offset: stableHash(currentSlug),
        count,
    }).map((slug) => ({
        href: `/design/${slug}`,
        label: `${humanizeDesignSlug(slug)} design ideas`,
    }));
}

const DESIGN_TO_BLOG: Record<string, string[]> = (() => {
    const index: Record<string, string[]> = {};
    for (const post of BLOG_POSTS) {
        for (const designSlug of post.relatedDesignSlugs) {
            (index[designSlug] ??= []).push(post.slug);
        }
    }
    return index;
})();

const ROOM_TO_BLOG: Record<string, string[]> = {
    "living-room": ["how-to-redesign-living-room-with-ai"],
    bedroom: ["bedroom-redesign-with-ai"],
    office: ["home-office-ai-design"],
    kitchen: ["industrial-kitchen-design-ideas"],
};

const THEME_TO_BLOG: Record<string, string[]> = {
    scandinavian: ["scandinavian-design-small-spaces"],
    industrial: ["industrial-kitchen-design-ideas"],
    bohemian: ["bohemian-bedroom-decor-guide"],
    modern: ["modern-vs-minimalist-interior-design"],
    minimalist: ["modern-vs-minimalist-interior-design"],
};

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

function blogLink(slug: string): IContextualLink {
    const post = getBlogPostBySlug(slug);
    return {
        href: `/blog/${slug}`,
        label: post?.title ?? "",
        description: post?.excerpt?.slice(0, 130),
    };
}

export function getRelatedBlogLinksForDesign({
    designSlug,
    theme,
    roomType,
    count = 4,
}: {
    designSlug: string;
    theme: string;
    roomType: string;
    count?: number;
}): IContextualLink[] {
    const ordered: string[] = [
        ...(DESIGN_TO_BLOG[designSlug] ?? []),
        ...(ROOM_TO_BLOG[roomType] ?? []),
        ...(THEME_TO_BLOG[theme] ?? []),
    ];

    const seen = new Set(ordered);
    const topUp = rotatingSlice({
        items: EVERGREEN_BLOG.filter((s) => !seen.has(s)),
        offset: stableHash(designSlug),
        count,
    });

    const slugs = Array.from(new Set([...ordered, ...topUp])).slice(0, count);

    return slugs.filter((slug) => getBlogPostBySlug(slug)).map(blogLink);
}

export function getRelatedBlogLinksForPost({ slug, count = 3 }: { slug: string; count?: number }): IContextualLink[] {
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
    const topUp = rotatingSlice({ items: weakPool, offset: stableHash(slug), count });

    return Array.from(new Set([...strong, ...topUp])).slice(0, count).map(blogLink);
}

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

function comparisonLinks({
    pageSlug,
    hub,
    vsTargets,
}: {
    pageSlug: string;
    hub: { label: string; description: string };
    vsTargets: "first" | "all";
}): IContextualLink[] {
    const rotated = rotatingSlice({
        items: COMPETITORS.map((c) => c.slug),
        offset: stableHash(pageSlug),
        count: 2,
    });

    return [
        { href: "/alternatives", ...hub },
        ...rotated.map(alternativeLink),
        ...(vsTargets === "all" ? rotated : rotated.slice(0, 1)).filter(hasVsPage).map(vsLink),
    ];
}

export function getComparisonLinksForDesign(designSlug: string): IContextualLink[] {
    return comparisonLinks({
        pageSlug: designSlug,
        hub: {
            label: "best RoomGPT alternatives for AI interior design",
            description:
                "All four tools compared on AI model, photo retention, pricing model and output quality.",
        },
        vsTargets: "first",
    });
}

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

export function getDesignLinksForCompetitor({
    competitorSlug,
    count = 4,
}: {
    competitorSlug: string;
    count?: number;
}): IContextualLink[] {
    return rotatingSlice({
        items: DESIGN_LINK_POOL.filter((d) => isPriorityDesignSlug(d.slug)),
        offset: stableHash(competitorSlug),
        count,
    }).map((d) => ({
        href: `/design/${d.slug}`,
        label: d.label,
        description: "Generate this style on a photo of your own room.",
    }));
}

export function getBlogLinksForCompetitor({
    competitorSlug,
    count = 3,
}: {
    competitorSlug: string;
    count?: number;
}): IContextualLink[] {
    const priority = [
        "best-ai-interior-design-tools-2026",
        "ai-interior-design-tools-how-they-work",
    ];
    const topUp = rotatingSlice({
        items: EVERGREEN_BLOG.filter((s) => !priority.includes(s)),
        offset: stableHash(competitorSlug),
        count,
    });
    return Array.from(new Set([...priority, ...topUp])).slice(0, count).map(blogLink);
}

export function getComparisonLinksForPost(slug: string): IContextualLink[] {
    return comparisonLinks({
        pageSlug: slug,
        hub: {
            label: "RoomGPT alternatives compared",
            description:
                "Magic Room, RoomGPT, Interior AI, DecorAI and Reimagine Home on privacy, pricing and model quality.",
        },
        vsTargets: "all",
    });
}

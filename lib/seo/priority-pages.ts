import { isPrunedPath } from "@/lib/seo/pruned";

export const TOP_DESIGN_SLUGS = new Set([
    "modern-living-room",
    "scandinavian-living-room",
    "minimalist-living-room",
    "modern-bedroom",
    "scandinavian-bedroom",
    "bohemian-bedroom",
    "modern-kitchen",
    "farmhouse-kitchen",
    "luxury-bathroom",
    "coastal-living-room",
    "japandi-living-room",
    "art-deco-living-room",
    "modern-bathroom",
    "art-deco-bedroom",
    "industrial-kitchen",
]);

const SECONDARY_DESIGN_SLUGS = new Set([
    "minimalist-bedroom",
    "farmhouse-home-theater",
    "farmhouse-gaming-room",
    "farmhouse-bathroom",
    "farmhouse-bedroom",
    "farmhouse-dining-room",
    "coastal-bedroom",
    "coastal-walk-in-closet",
    "art-deco-sunroom",
    "art-deco-dining-room",
    "japandi-bedroom",
    "japandi-mudroom",
    "modern-sunroom",
    "modern-home-theater",
    "mediterranean-living-room",
    "bohemian-living-room",
    "luxury-living-room",
    "luxury-bedroom",
    "industrial-living-room",
    "vintage-bedroom",
    "modern-office",
    "industrial-office",
    "scandinavian-office",
]);

const CURATED_DESIGN_SLUGS: string[] = Array.from(
    new Set<string>([...TOP_DESIGN_SLUGS, ...SECONDARY_DESIGN_SLUGS])
);

export const PRIORITY_DESIGN_SLUGS: string[] = CURATED_DESIGN_SLUGS.filter(
    (slug) => !isPrunedPath(`/design/${slug}`)
);

export const PRIORITY_DESIGN_SET = new Set(PRIORITY_DESIGN_SLUGS);

export function isPriorityDesignSlug(slug: string): boolean {
    return PRIORITY_DESIGN_SET.has(slug);
}

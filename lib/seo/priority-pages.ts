/**
 * Curated set of design pages that:
 *   - Are exposed in the XML sitemap
 *   - Are indexable by search engines
 *
 * Every other (theme, room) combination still renders for users browsing
 * the catalogue, but is served with `robots: { index: false }` so Google
 * stops treating the site as scaled programmatic content (the March-April
 * 2026 core + spam updates penalised that signal heavily).
 *
 * Rule of thumb when adding to this list:
 *   1. The page has visible search demand (impressions/clicks in GSC), or
 *   2. The (theme, room) combination is a recognised head term, or
 *   3. We have a unique hero image and bespoke intro/FAQ content for it.
 */

// Highest priority — boosted sitemap priority and crawl frequency.
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

// Secondary tier — kept indexable because of measured impressions, strong head terms,
// or because they're cross-linked from blog content (blog → design hub-and-spoke).
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

export const PRIORITY_DESIGN_SLUGS: string[] = Array.from(
    new Set<string>([...TOP_DESIGN_SLUGS, ...SECONDARY_DESIGN_SLUGS])
);

export const PRIORITY_DESIGN_SET = new Set(PRIORITY_DESIGN_SLUGS);

export function isPriorityDesignSlug(slug: string): boolean {
    return PRIORITY_DESIGN_SET.has(slug);
}

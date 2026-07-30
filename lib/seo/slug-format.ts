/**
 * Slug formatting helpers.
 *
 * Deliberately a leaf module with no data imports: `lib/seo/internal-links.ts`
 * pulls in the whole design/blog/competitor catalogue, so client components
 * (`components/seo/*.tsx` are `"use client"`) cannot import from there without
 * dragging that data into the browser bundle. They can import from here.
 */

/** `art-deco-bedroom` -> `Art Deco Bedroom`. */
export function humanizeDesignSlug(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

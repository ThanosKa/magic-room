import { Metadata } from "next";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { GalleryContent } from "@/components/seo/gallery-content";

export const metadata: Metadata = createMetadata({
    title: "AI Interior Design Gallery | Before & After Room Transformations",
    description:
        "Browse real AI-generated room transformations. See before and after photos for modern, Scandinavian, minimalist, bohemian, farmhouse, and more interior design styles.",
    path: "/gallery",
    keywords: [
        "ai room design gallery",
        "ai interior design examples",
        "before and after room design",
        "AI room transformation",
        "interior design inspiration",
        "room makeover ideas",
        "AI interior design photos",
    ],
});

const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Gallery", url: `${SITE_URL}/gallery` },
]);

const itemList = itemListSchema({
    name: "AI Interior Design Gallery",
    description: "Before and after AI-generated room transformations across popular interior design styles.",
    items: [
        { position: 1, name: "Modern Living Room Design", url: `${SITE_URL}/design/modern-living-room` },
        { position: 2, name: "Scandinavian Bedroom Design", url: `${SITE_URL}/design/scandinavian-bedroom` },
        { position: 3, name: "Minimalist Living Room Design", url: `${SITE_URL}/design/minimalist-living-room` },
        { position: 4, name: "Bohemian Bedroom Design", url: `${SITE_URL}/design/bohemian-bedroom` },
        { position: 5, name: "Industrial Kitchen Design", url: `${SITE_URL}/design/industrial-kitchen` },
        { position: 6, name: "Luxury Bathroom Design", url: `${SITE_URL}/design/luxury-bathroom` },
        { position: 7, name: "Coastal Living Room Design", url: `${SITE_URL}/design/coastal-living-room` },
        { position: 8, name: "Farmhouse Kitchen Design", url: `${SITE_URL}/design/farmhouse-kitchen` },
    ],
});

export default function GalleryPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
            />
            <GalleryContent />
        </>
    );
}

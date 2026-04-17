import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import {
    faqSchema,
    breadcrumbSchema,
    howToSchema,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import {
    getDesignPageBySlug,
    getAllDesignSlugs,
    THEME_DATA,
    ROOM_DATA,
} from "@/lib/seo/design-data";
import { DesignPageContent } from "@/components/seo/design-page-content";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllDesignSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const page = getDesignPageBySlug(slug);

    if (!page) {
        return {};
    }

    return createMetadata({
        title: page.title,
        description: page.metaDescription,
        path: `/design/${slug}`,
        keywords: page.keywords,
    });
}

export default async function DesignSlugPage({ params }: Props) {
    const { slug } = await params;
    const page = getDesignPageBySlug(slug);

    if (!page) {
        notFound();
    }

    const themeData = THEME_DATA[page.theme];
    const roomData = ROOM_DATA[page.roomType];

    const otherThemes = Object.values(THEME_DATA)
        .filter((theme) => theme.slug !== page.theme)
        .sort((a, b) => a.slug.localeCompare(b.slug))
        .slice(0, 6);

    const otherRooms = Object.values(ROOM_DATA)
        .filter((room) => room.slug !== page.roomType)
        .sort((a, b) => a.slug.localeCompare(b.slug))
        .slice(0, 6);

    const pageUrl = `${SITE_URL}/design/${slug}`;

    const schemas = [
        breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Design Ideas", url: `${SITE_URL}/design` },
            { name: `${page.themeName} ${page.roomName}`, url: pageUrl },
        ]),
        howToSchema({
            name: `How to Generate ${page.themeName} ${page.roomName} Design Ideas with AI`,
            description: `Step-by-step guide to redesigning your ${page.roomName.toLowerCase()} in a ${page.themeName.toLowerCase()} style using AI interior design.`,
            totalTime: "PT2M",
            steps: [
                {
                    name: "Upload your room photo",
                    text: "Take a clear photo of your room in good daylight, shooting from a corner or doorway to capture as much of the space as possible. Upload it directly from your phone or computer.",
                },
                {
                    name: `Select ${page.themeName} style and room type`,
                    text: `Choose ${page.themeName} as your design theme and confirm the room type. Add any specific details or requirements in the optional text field.`,
                },
                {
                    name: "Review and download your AI-generated designs",
                    text: "The AI generates your redesigned room in 30 to 60 seconds. Review the design variations and download the result for planning or sharing.",
                },
            ],
            url: pageUrl,
        }),
        ...(page.faqs.length > 0 ? [faqSchema(page.faqs, pageUrl)] : []),
    ];

    return (
        <>
            {schemas.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
            <DesignPageContent
                page={page}
                themeData={themeData}
                roomData={roomData}
                otherThemes={otherThemes}
                otherRooms={otherRooms}
            />
        </>
    );
}

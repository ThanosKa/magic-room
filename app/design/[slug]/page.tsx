import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import {
    faqSchema,
    breadcrumbSchema,
    howToSchema,
    imageObjectSchema,
    webPageSchema,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import {
    getDesignPageBySlug,
    getAllDesignSlugs,
    THEME_DATA,
    ROOM_DATA,
} from "@/lib/seo/design-data";
import { isPriorityDesignSlug, PRIORITY_DESIGN_SET } from "@/lib/seo/priority-pages";
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

    // Non-priority (theme, room) combos still render so users browsing the
    // catalogue see a real page, but are kept out of the index. This pulls
    // the site below Google's scaled-content threshold and concentrates
    // ranking signals on the pages we actually want to win.
    const indexable = isPriorityDesignSlug(slug);

    return createMetadata({
        title: page.title,
        description: page.metaDescription,
        path: `/design/${slug}`,
        keywords: page.keywords,
        noIndex: !indexable,
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

    // Only link out to other (theme, room) combinations that are in the
    // indexable priority set — sending crawl signal to noindex pages
    // wastes Google's crawl budget and signals scaled content.
    const otherThemes = Object.values(THEME_DATA)
        .filter((theme) => theme.slug !== page.theme)
        .filter((theme) => PRIORITY_DESIGN_SET.has(`${theme.slug}-${page.roomType}`))
        .sort((a, b) => a.slug.localeCompare(b.slug))
        .slice(0, 6);

    const otherRooms = Object.values(ROOM_DATA)
        .filter((room) => room.slug !== page.roomType)
        .filter((room) => PRIORITY_DESIGN_SET.has(`${page.theme}-${room.slug}`))
        .sort((a, b) => a.slug.localeCompare(b.slug))
        .slice(0, 6);

    const pageUrl = `${SITE_URL}/design/${slug}`;
    const heroImageUrl = `${SITE_URL}/images/designs/${page.slug}.jpg`;

    const schemas = [
        webPageSchema({
            url: pageUrl,
            name: `${page.themeName} ${page.roomName} Design Ideas`,
            description: page.metaDescription,
            datePublished: "2026-02-15",
            dateModified: "2026-05-19",
            primaryImage: heroImageUrl,
        }),
        imageObjectSchema({
            url: heroImageUrl,
            caption: `AI-generated ${page.themeName.toLowerCase()} ${page.roomName.toLowerCase()} redesign from a single photo`,
            creditText: "Magic Room (AI-generated)",
            creator: {
                name: "Thanos Kazakis",
                url: "https://www.linkedin.com/in/thanos-kazakis-922977205/",
            },
        }),
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

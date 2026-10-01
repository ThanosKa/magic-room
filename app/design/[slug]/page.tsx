import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import {
    faqSchema,
    breadcrumbSchema,
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
import { isPriorityDesignSlug } from "@/lib/seo/priority-pages";
import {
    getSiblingThemes,
    getSiblingRooms,
    getRelatedBlogLinksForDesign,
    getComparisonLinksForDesign,
    getUnderlinkedDesignLinks,
} from "@/lib/seo/internal-links";
import { DesignPageContent } from "@/components/seo/design-page-content";
import { JsonLd } from "@/components/seo/json-ld";

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
        // Absolute: the root layout's "%s | Magic Room" template costs 12
        // characters of an already-truncated SERP title, spent on a brand no
        // non-brand searcher recognises. The domain is shown above the title
        // anyway.
        title: { absolute: page.title },
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

    const otherThemes = getSiblingThemes(slug, page.theme, page.roomType);
    const otherRooms = getSiblingRooms(slug, page.theme, page.roomType);

    // Contextual (non-nav) links out of the design cluster. Before this, every
    // design page linked only to siblings, /design, /blog and /pricing — the
    // blog posts and comparison pages had no inbound links except their own
    // index page.
    const relatedBlogLinks = getRelatedBlogLinksForDesign(slug, page.theme, page.roomType);
    const comparisonLinks = getComparisonLinksForDesign(slug);
    const moreDesignLinks = getUnderlinkedDesignLinks(slug);

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
        ...(page.faqs.length > 0 ? [faqSchema(page.faqs, pageUrl)] : []),
    ];

    return (
        <>
            <JsonLd schemas={schemas} />
            <DesignPageContent
                page={page}
                themeData={themeData}
                roomData={roomData}
                otherThemes={otherThemes}
                otherRooms={otherRooms}
                relatedBlogLinks={relatedBlogLinks}
                comparisonLinks={comparisonLinks}
                moreDesignLinks={moreDesignLinks}
            />
        </>
    );
}

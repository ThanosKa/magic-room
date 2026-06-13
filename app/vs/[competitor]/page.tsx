import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import {
    faqSchema,
    breadcrumbSchema,
    aggregateOfferSchema,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { getCompetitorBySlug } from "@/lib/seo/competitor-data";
import { VsPageContent } from "@/components/seo/vs-page-content";

// VS comparison pages — extend this list to add new comparisons
const VS_SLUGS = ["roomgpt", "interior-ai", "reimaginehome", "decorai"];

interface Props {
    params: Promise<{ competitor: string }>;
}

export async function generateStaticParams() {
    return VS_SLUGS.map((slug) => ({ competitor: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { competitor: slug } = await params;

    if (!VS_SLUGS.includes(slug)) {
        return {};
    }

    const competitor = getCompetitorBySlug(slug);

    if (!competitor) {
        return {};
    }

    return createMetadata({
        title: {
            absolute: `Magic Room vs ${competitor.name} — Side-by-Side (2026)`,
        },
        description: `Magic Room vs ${competitor.name}: AI model, photo privacy, pricing, and output quality compared side-by-side. Try Magic Room free with 1 credit.`,
        path: `/vs/${slug}`,
        keywords: [
            `magic room vs ${competitor.name.toLowerCase()}`,
            `${competitor.name.toLowerCase()} vs magic room`,
            `${competitor.name.toLowerCase()} comparison`,
            "ai room design comparison",
        ],
    });
}

export default async function VsPage({ params }: Props) {
    const { competitor: slug } = await params;

    if (!VS_SLUGS.includes(slug)) {
        notFound();
    }

    const competitor = getCompetitorBySlug(slug);

    if (!competitor) {
        notFound();
    }

    const schemas = [
        breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Alternatives", url: `${SITE_URL}/alternatives` },
            {
                name: `Magic Room vs ${competitor.name}`,
                url: `${SITE_URL}/vs/${slug}`,
            },
        ]),
        aggregateOfferSchema({
            name: `Magic Room (vs ${competitor.name})`,
            description: `AI interior design tool compared side-by-side with ${competitor.name}. One-time credit packages from €9.99, no subscription, photos never stored.`,
            lowPrice: 9.99,
            highPrice: 29.99,
            offerCount: 3,
            url: `${SITE_URL}/vs/${slug}`,
        }),
        ...(competitor.faqs.length > 0 ? [faqSchema(competitor.faqs, `${SITE_URL}/vs/${slug}`)] : []),
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
            <VsPageContent competitor={competitor} />
        </>
    );
}

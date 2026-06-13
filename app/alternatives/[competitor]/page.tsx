import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import {
    faqSchema,
    breadcrumbSchema,
    aggregateOfferSchema,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import {
    getCompetitorBySlug,
    getAllCompetitorSlugs,
    COMPETITORS,
} from "@/lib/seo/competitor-data";
import { AlternativePageContent } from "@/components/seo/alternative-page-content";

interface Props {
    params: Promise<{ competitor: string }>;
}

export async function generateStaticParams() {
    return getAllCompetitorSlugs().map((slug) => ({ competitor: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { competitor: slug } = await params;
    const competitor = getCompetitorBySlug(slug);

    if (!competitor) {
        return {};
    }

    return createMetadata({
        title: {
            absolute: `${competitor.name} Alternative — Magic Room (Cheaper, Privacy-First, 2026)`,
        },
        description: `Switching from ${competitor.name}? Magic Room starts at €9.99 one-time (not monthly), never stores your photos, and runs on Google Gemini. Try free with 1 credit.`,
        path: `/alternatives/${slug}`,
        keywords: competitor.keywords,
    });
}

export default async function AlternativePage({ params }: Props) {
    const { competitor: slug } = await params;
    const competitor = getCompetitorBySlug(slug);

    if (!competitor) {
        notFound();
    }

    const schemas = [
        breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Alternatives", url: `${SITE_URL}/alternatives` },
            {
                name: `${competitor.name} Alternative`,
                url: `${SITE_URL}/alternatives/${slug}`,
            },
        ]),
        aggregateOfferSchema({
            name: `Magic Room — ${competitor.name} Alternative`,
            description: `AI interior design tool offered as a ${competitor.name} alternative. One-time credit packages from €9.99, no subscription, photos never stored.`,
            lowPrice: 9.99,
            highPrice: 29.99,
            offerCount: 3,
            url: `${SITE_URL}/alternatives/${slug}`,
        }),
        ...(competitor.faqs.length > 0 ? [faqSchema(competitor.faqs, `${SITE_URL}/alternatives/${slug}`)] : []),
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
            <AlternativePageContent
                competitor={competitor}
                otherCompetitors={COMPETITORS.filter((c) => c.slug !== slug)}
            />
        </>
    );
}

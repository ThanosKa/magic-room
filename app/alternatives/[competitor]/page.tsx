import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import {
    getCompetitorBySlug,
    getAllCompetitorSlugs,
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
        title: `Best ${competitor.name} Alternative`,
        description: `Looking for a ${competitor.name} alternative? See how Magic Room compares on privacy, pricing, and AI quality. Try for free with one credit.`,
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
        ...(competitor.faqs.length > 0 ? [faqSchema(competitor.faqs)] : []),
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
            <AlternativePageContent competitor={competitor} />
        </>
    );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { getCompetitorBySlug } from "@/lib/seo/competitor-data";
import { VsPageContent } from "@/components/seo/vs-page-content";

// Only the RoomGPT vs page for now — extend this list as needed
const VS_SLUGS = ["roomgpt"];

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
        title: `Magic Room vs ${competitor.name}`,
        description: `Detailed comparison of Magic Room and ${competitor.name}. See the differences in AI model, privacy, pricing, and output quality.`,
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
            <VsPageContent competitor={competitor} />
        </>
    );
}

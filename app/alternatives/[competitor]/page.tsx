import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import {
    faqSchema,
    breadcrumbSchema,
    softwareApplicationSchema,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import {
    getCompetitorBySlug,
    getAllCompetitorSlugs,
    COMPETITORS,
    hasVsPage,
} from "@/lib/seo/competitor-data";
import {
    getDesignLinksForCompetitor,
    getBlogLinksForCompetitor,
} from "@/lib/seo/internal-links";
import { AlternativePageContent } from "@/components/seo/alternative-page-content";
import { JsonLd } from "@/components/seo/json-ld";

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
        // Was 69 chars and spent the prime post-query pixels on "Magic Room" —
        // a brand a non-brand searcher has never heard of. Now the query phrase
        // is front-loaded and the visible tail carries two concrete
        // differentiators instead of an unknown name.
        title: {
            absolute: `${competitor.name} Alternative — Pay Once, Photos Never Stored`,
        },
        description: `A ${competitor.name} alternative that charges once, not monthly, and never stores your room photos. Google Gemini AI, 4–8 redesigns in 60s. 1 free credit.`,
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
        // SoftwareApplication, not Product. Magic Room is a web app, not a SKU,
        // and `Product` + offers with no aggregateRating is exactly the shape
        // that produced the 0-click "Product snippets" appearance in GSC.
        softwareApplicationSchema({
            description: `AI interior design tool offered as a ${competitor.name} alternative. One-time credit packages from €9.99, no subscription, photos never stored.`,
            includeOffers: true,
        }),
        ...(competitor.faqs.length > 0 ? [faqSchema(competitor.faqs, `${SITE_URL}/alternatives/${slug}`)] : []),
    ];

    return (
        <>
            <JsonLd schemas={schemas} />
            <AlternativePageContent
                competitor={competitor}
                otherCompetitors={COMPETITORS.filter((c) => c.slug !== slug)}
                vsCompetitors={COMPETITORS.filter((c) => hasVsPage(c.slug))}
                designLinks={getDesignLinksForCompetitor(slug)}
                blogLinks={getBlogLinksForCompetitor(slug)}
            />
        </>
    );
}

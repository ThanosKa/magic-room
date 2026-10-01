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
    hasVsPage,
    VS_SLUGS,
    COMPETITORS,
} from "@/lib/seo/competitor-data";
import {
    getDesignLinksForCompetitor,
    getBlogLinksForCompetitor,
} from "@/lib/seo/internal-links";
import { VsPageContent } from "@/components/seo/vs-page-content";
import { JsonLd } from "@/components/seo/json-ld";

// VS comparison pages are declared once in lib/seo/competitor-data.ts so this
// route and app/sitemap.ts can never disagree about which /vs/ URLs exist.

interface Props {
    params: Promise<{ competitor: string }>;
}

export async function generateStaticParams() {
    return VS_SLUGS.map((slug) => ({ competitor: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { competitor: slug } = await params;

    if (!hasVsPage(slug)) {
        return {};
    }

    const competitor = getCompetitorBySlug(slug);

    if (!competitor) {
        return {};
    }

    return createMetadata({
        // Leads with the competitor, not us: on a comparison query the
        // recognised brand is the anchor that earns the eye, and "Side-by-Side"
        // told the searcher nothing that the three named axes don't tell better.
        title: {
            absolute: `${competitor.name} vs Magic Room — Price, Privacy, Output (2026)`,
        },
        description: `${competitor.name} vs Magic Room on AI model, photo retention and real cost. One bills monthly, one charges €9.99 once. Try Magic Room free — 1 credit.`,
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

    if (!hasVsPage(slug)) {
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
        // SoftwareApplication rather than Product — see the note in
        // lib/seo/schema.ts on why a rating-less Product entity was costing
        // clicks rather than earning them.
        softwareApplicationSchema({
            description: `AI interior design tool compared side-by-side with ${competitor.name}. One-time credit packages from €9.99, no subscription, photos never stored.`,
            includeOffers: true,
        }),
        ...(competitor.faqs.length > 0 ? [faqSchema(competitor.faqs, `${SITE_URL}/vs/${slug}`)] : []),
    ];

    return (
        <>
            <JsonLd schemas={schemas} />
            <VsPageContent
                competitor={competitor}
                otherCompetitors={COMPETITORS.filter((c) => c.slug !== slug)}
                vsSiblings={COMPETITORS.filter(
                    (c) => c.slug !== slug && hasVsPage(c.slug)
                )}
                designLinks={getDesignLinksForCompetitor(`vs-${slug}`)}
                blogLinks={getBlogLinksForCompetitor(`vs-${slug}`)}
            />
        </>
    );
}

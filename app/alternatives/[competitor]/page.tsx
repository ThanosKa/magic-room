import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo/metadata";
import {
    faqSchema,
    breadcrumbSchema,
    softwareApplicationSchema,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { CREDIT_PACKAGES } from "@/lib/constants";
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

// Cheapest pack, read from the same table checkout uses so the meta line
// cannot drift from the real price.
const ENTRY_PACK = CREDIT_PACKAGES[0];
const ENTRY_PRICE = `€${(ENTRY_PACK.priceCents / 100).toFixed(2)}`;

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
        // Leads with the two facts a switcher compares first (what it costs and
        // whether it is a subscription), then privacy and the free try. The old
        // line named one AI vendor, which stopped being the whole story when the
        // Ultra tier moved to an OpenAI model.
        description: `${/^[AEIOU]/i.test(competitor.name) ? "An" : "A"} ${competitor.name} alternative you pay for once: ${ENTRY_PRICE} for ${ENTRY_PACK.credits} credits that never expire. Your room photos are never stored. 1 free design, no card.`,
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

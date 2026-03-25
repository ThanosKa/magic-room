import { SITE_URL, SITE_NAME } from "./config";

export function graphSchema(schemas: Record<string, unknown>[]) {
    return {
        "@context": "https://schema.org",
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        "@graph": schemas.map(({ "@context": _ctx, ...rest }) => rest),
    };
}

interface AggregateOfferSchemaInput {
    name: string;
    description: string;
    lowPrice: number;
    highPrice: number;
    priceCurrency?: string;
    offerCount: number;
    url?: string;
}

export function aggregateOfferSchema(input: AggregateOfferSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${input.url ?? `${SITE_URL}/pricing`}#product`,
        name: input.name,
        description: input.description,
        image: `${SITE_URL}/opengraph-image.png`,
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
            "@type": "AggregateOffer",
            lowPrice: input.lowPrice,
            highPrice: input.highPrice,
            priceCurrency: input.priceCurrency ?? "EUR",
            offerCount: input.offerCount,
            availability: "https://schema.org/InStock",
            url: input.url ?? `${SITE_URL}/pricing`,
        },
    };
}

interface BlogPostingSchemaInput {
    title: string;
    description: string;
    authorName: string;
    publishedDate: string;
    modifiedDate: string;
    url: string;
    image?: string;
    wordCount?: number;
}

export function blogPostingSchema(input: BlogPostingSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${input.url}#article`,
        headline: input.title,
        description: input.description,
        image: input.image ?? `${SITE_URL}/opengraph-image.png`,
        author: {
            "@type": "Person",
            name: input.authorName,
            url: "https://www.linkedin.com/in/thanos-kazakis-922977205/",
        },
        publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
        },
        datePublished: input.publishedDate,
        dateModified: input.modifiedDate,
        url: input.url,
        mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
        inLanguage: "en-US",
        ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    };
}

interface OrganizationSchemaInput {
    name?: string;
    url?: string;
    logo?: string;
}

export function organizationSchema(input?: OrganizationSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${input?.url ?? SITE_URL}#organization`,
        name: input?.name ?? SITE_NAME,
        url: input?.url ?? SITE_URL,
        logo: {
            "@type": "ImageObject",
            "@id": `${input?.url ?? SITE_URL}#logo`,
            url: input?.logo ?? `${SITE_URL}/logo.png`,
            contentUrl: input?.logo ?? `${SITE_URL}/logo.png`,
            caption: input?.name ?? SITE_NAME,
        },
        image: { "@id": `${input?.url ?? SITE_URL}#logo` },
        sameAs: [
            "https://x.com/KazakisThanos",
            "https://www.linkedin.com/in/thanos-kazakis-922977205/",
            "https://github.com/ThanosKa/magic-room",
        ],
    };
}

interface WebSiteSchemaInput {
    name?: string;
    url?: string;
    description?: string;
}

export function webSiteSchema(input?: WebSiteSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${input?.url ?? SITE_URL}#website`,
        name: input?.name ?? SITE_NAME,
        url: input?.url ?? SITE_URL,
        description: input?.description,
        publisher: { "@id": `${input?.url ?? SITE_URL}#organization` },
        inLanguage: "en-US",
    };
}

interface FaqItem {
    question: string;
    answer: string;
}

export function faqSchema(items: FaqItem[], pageUrl?: string) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        ...(pageUrl ? { "@id": `${pageUrl}#faq`, mainEntityOfPage: { "@id": pageUrl } } : {}),
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };
}

interface ProductSchemaInput {
    name: string;
    description: string;
    price: number;
    priceCurrency?: string;
    url?: string;
    image?: string;
}

export function productSchema(input: ProductSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${input.url ?? `${SITE_URL}/pricing`}#product`,
        name: input.name,
        description: input.description,
        image: input.image ?? `${SITE_URL}/opengraph-image.png`,
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
            "@type": "Offer",
            price: input.price,
            priceCurrency: input.priceCurrency ?? "EUR",
            availability: "https://schema.org/InStock",
            url: input.url ?? `${SITE_URL}/pricing`,
        },
    };
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

interface HowToStep {
    name: string;
    text: string;
    image?: string;
}

interface HowToSchemaInput {
    name: string;
    description?: string;
    steps: HowToStep[];
    url: string;
    totalTime?: string;
}

export function howToSchema(input: HowToSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "@id": `${input.url}#howto`,
        name: input.name,
        description: input.description,
        ...(input.totalTime ? { totalTime: input.totalTime } : {}),
        step: input.steps.map((step, index) => ({
            "@type": "HowToStep",
            position: index + 1,
            name: step.name,
            text: step.text,
            ...(step.image ? { image: step.image } : {}),
        })),
        url: input.url,
    };
}

interface ItemListSchemaItem {
    position: number;
    name: string;
    url: string;
    description?: string;
}

interface ItemListSchemaInput {
    name: string;
    description?: string;
    items: ItemListSchemaItem[];
}

export function itemListSchema(input: ItemListSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: input.name,
        description: input.description,
        itemListElement: input.items.map((item) => ({
            "@type": "ListItem",
            position: item.position,
            name: item.name,
            url: item.url,
            description: item.description,
        })),
    };
}

interface PersonSchemaInput {
    name: string;
    url: string;
    description?: string;
    sameAs?: string[];
    jobTitle?: string;
}

export function personSchema(input: PersonSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${input.url}#person`,
        name: input.name,
        url: input.url,
        ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.sameAs ? { sameAs: input.sameAs } : {}),
    };
}

interface SoftwareApplicationSchemaInput {
    name?: string;
    description?: string;
    applicationCategory?: string;
    operatingSystem?: string;
}

export function softwareApplicationSchema(input?: SoftwareApplicationSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}#software`,
        name: input?.name ?? SITE_NAME,
        description: input?.description ?? "AI-powered interior design tool",
        applicationCategory: input?.applicationCategory ?? "DesignApplication",
        operatingSystem: input?.operatingSystem ?? "Web",
        url: SITE_URL,
        offers: {
            "@type": "AggregateOffer",
            lowPrice: 0,
            highPrice: 29.99,
            priceCurrency: "EUR",
            offerCount: 3,
            availability: "https://schema.org/InStock",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "150",
            bestRating: "5",
            worstRating: "1",
        },
    };
}

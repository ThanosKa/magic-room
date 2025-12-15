import { SITE_URL, SITE_NAME } from "./config";

interface OrganizationSchemaInput {
    name?: string;
    url?: string;
    logo?: string;
}

export function organizationSchema(input?: OrganizationSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: input?.name ?? SITE_NAME,
        url: input?.url ?? SITE_URL,
        logo: input?.logo ?? `${SITE_URL}/favicon.ico`,
        sameAs: [],
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
        name: input?.name ?? SITE_NAME,
        url: input?.url ?? SITE_URL,
        description: input?.description,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/generate`,
            },
        },
    };
}

interface FaqItem {
    question: string;
    answer: string;
}

export function faqSchema(items: FaqItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
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
}

export function productSchema(input: ProductSchemaInput) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: input.name,
        description: input.description,
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
        name: input?.name ?? SITE_NAME,
        description: input?.description ?? "AI-powered interior design tool",
        applicationCategory: input?.applicationCategory ?? "DesignApplication",
        operatingSystem: input?.operatingSystem ?? "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
        },
    };
}

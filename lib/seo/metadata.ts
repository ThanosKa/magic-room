import { Metadata } from "next";
import {
    SITE_URL,
    SITE_NAME,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    OG_IMAGE,
    TWITTER_HANDLE,
} from "./config";

interface CreateMetadataInput {
    title?: string;
    description?: string;
    path?: string;
    noIndex?: boolean;
    keywords?: string[];
    ogImage?: {
        url: string;
        width: number;
        height: number;
        alt: string;
    };
}

export function createMetadata(input?: CreateMetadataInput): Metadata {
    const title = input?.title;
    const description = input?.description ?? SITE_DESCRIPTION;
    const canonicalUrl = `${SITE_URL}${input?.path ?? ""}`;
    const ogImage = input?.ogImage ?? OG_IMAGE;
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    return {
        title,
        description,
        keywords: input?.keywords ?? SITE_KEYWORDS,
        authors: [{ name: SITE_NAME }],
        creator: SITE_NAME,
        publisher: SITE_NAME,
        robots: input?.noIndex
            ? { index: false, follow: false }
            : { index: true, follow: true },
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type: "website",
            locale: "en_US",
            url: canonicalUrl,
            siteName: SITE_NAME,
            title: fullTitle,
            description,
            images: [
                {
                    url: ogImage.url,
                    width: ogImage.width,
                    height: ogImage.height,
                    alt: ogImage.alt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            site: TWITTER_HANDLE,
            creator: TWITTER_HANDLE,
            title: fullTitle,
            description,
            images: [ogImage.url],
        },
    };
}

export function homeMetadata(): Metadata {
    return createMetadata({
        title: "AI Interior Design - Transform Your Room in Seconds",
        description:
            "Magic Room is the AI interior design tool that transforms any room from a photo. Upload once, get stunning design variations in under 60 seconds.",
        path: "",
    });
}

export function pricingMetadata(): Metadata {
    return createMetadata({
        title: "Pricing — From €9.99 for 30 AI Designs",
        description:
            "AI interior design from €9.99 for 30 credits (~€0.33 per design). No subscription, credits never expire, full commercial rights included.",
        path: "/pricing",
    });
}

export function generateMetadata(): Metadata {
    return createMetadata({
        title: "Generate Design",
        description:
            "Upload your room photo and generate AI-powered interior design variations. Select room type and style to get started.",
        path: "/generate",
        noIndex: true,
    });
}

export function privacyMetadata(): Metadata {
    return createMetadata({
        title: "Privacy Policy",
        description:
            "Magic Room privacy policy and data protection information. Learn how we protect your data and images.",
        path: "/privacy",
    });
}

export function termsMetadata(): Metadata {
    return createMetadata({
        title: "Terms of Service",
        description:
            "Magic Room terms of service and user agreement. Read our terms before using the service.",
        path: "/terms",
    });
}

export function aboutMetadata(): Metadata {
    return createMetadata({
        title: "About Magic Room | AI Interior Design",
        description:
            "Magic Room was built by Thanos Kazakis to make AI-powered interior design accessible to everyone. Learn about the mission, the technology, and the founder.",
        path: "/about",
        keywords: [
            "about magic room",
            "AI interior design tool",
            "Thanos Kazakis",
            "interior design AI founder",
            "magic room about",
        ],
    });
}

export function virtualStagingMetadata(): Metadata {
    return createMetadata({
        title: "AI Virtual Staging for Real Estate",
        description:
            "Stage any property listing with AI for under $1 per photo. Replace $2,000–$5,000 traditional staging costs. Upload a photo, choose a style, get professionally staged images in 60 seconds.",
        path: "/virtual-staging",
        keywords: [
            "virtual staging ai",
            "ai home staging",
            "ai virtual staging",
            "real estate virtual staging",
            "virtual home staging",
            "property staging ai",
            "real estate ai staging",
            "ai staging tool",
            "virtual staging real estate agents",
            "cheap virtual staging",
        ],
    });
}

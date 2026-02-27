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
            "Transform your room in seconds with AI-powered interior design. Upload a photo and get stunning design variations instantly. Privacy-first, professional quality.",
        path: "",
    });
}

export function pricingMetadata(): Metadata {
    return createMetadata({
        title: "Pricing & Plans",
        description:
            "Simple, transparent pricing for AI interior design. Choose from flexible credit packages. Credits never expire.",
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

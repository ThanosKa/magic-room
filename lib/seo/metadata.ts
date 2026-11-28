import { Metadata } from "next";
import {
    SITE_URL,
    SITE_NAME,
    SITE_DESCRIPTION,
    SITE_KEYWORDS,
    OG_IMAGE,
    TWITTER_HANDLE,
} from "./config";
import { CREDIT_PACKAGES } from "@/lib/constants";

const ENTRY_PACK = CREDIT_PACKAGES[0];
const ENTRY_PRICE = `€${(ENTRY_PACK.priceCents / 100).toFixed(2)}`;
const ENTRY_PER_DESIGN = `€${(ENTRY_PACK.priceCents / 100 / ENTRY_PACK.credits).toFixed(2)}`;

interface CreateMetadataInput {
    title?: string | { absolute: string };
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
    const titleString =
        typeof title === "string" ? title : title?.absolute;
    const description = input?.description ?? SITE_DESCRIPTION;
    const canonicalUrl =
        typeof input?.path === "string" ? `${SITE_URL}${input.path || "/"}` : undefined;
    const ogImage = input?.ogImage ?? OG_IMAGE;
    const isAbsolute = typeof title === "object" && title !== null;
    const fullTitle = titleString
        ? isAbsolute
            ? titleString
            : `${titleString} | ${SITE_NAME}`
        : SITE_NAME;

    return {
        title,
        description,
        keywords: input?.keywords ?? SITE_KEYWORDS,
        authors: [{ name: SITE_NAME }],
        creator: SITE_NAME,
        publisher: SITE_NAME,
        robots: input?.noIndex
            ? {
                  index: false,
                  follow: false,
                  googleBot: { index: false, follow: false },
              }
            : {
                  index: true,
                  follow: true,
                  googleBot: {
                      index: true,
                      follow: true,
                      "max-video-preview": -1,
                      "max-image-preview": "large",
                      "max-snippet": -1,
                  },
              },
        alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
        openGraph: {
            type: "website",
            locale: "en_US",
            url: canonicalUrl ?? SITE_URL,
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
        title: {
            absolute: "AI Interior Design: Redesign Any Room From One Photo (2026)",
        },
        description:
            "Turn one room photo into an AI redesign in 60 seconds, powered by Gemini and OpenAI. Photos never stored. €9.99 once, not monthly. 1 free credit, no card.",
        path: "",
        keywords: [
            "ai interior design tools",
            "best ai tools for interior design 2026",
            "ai interior design",
            "ai room design tool",
            "ai interior design generator",
            "redesign room from photo ai",
            "virtual staging ai",
            "ai room makeover",
        ],
    });
}

export function pricingMetadata(): Metadata {
    return createMetadata({
        title: `Pricing — From ${ENTRY_PRICE} for ${ENTRY_PACK.credits} AI Designs`,
        description: `AI interior design from ${ENTRY_PRICE} for ${ENTRY_PACK.credits} credits (~${ENTRY_PER_DESIGN} per design). No subscription, credits never expire, full commercial rights included.`,
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
        title: {
            absolute: "What Is Magic Room? The AI Room Designer That Keeps Nothing",
        },
        description:
            "Magic Room turns one room photo into an AI redesign in 60 seconds. Built by one developer, €9.99 once instead of monthly, photos never stored.",
        path: "/about",
        keywords: [
            "what is magic room",
            "about magic room",
            "AI interior design tool",
            "Thanos Kazakis",
            "interior design AI founder",
        ],
    });
}

export function virtualStagingMetadata(): Metadata {
    return createMetadata({
        title: { absolute: "AI Virtual Staging: Stage Any Listing for Under €1" },
        description:
            "Stage a listing photo with AI from €0.25, against a $1,500 median for a staging service (NAR 2025). Upload, pick a style, download in 60 seconds.",
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

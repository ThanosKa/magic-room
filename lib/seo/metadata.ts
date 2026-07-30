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
    // `path` must be explicitly provided (use "" for the homepage). If a caller
    // forgets it we deliberately emit NO canonical rather than silently
    // canonicalising the page to the homepage — a wrong canonical removes the
    // page from the index ("Alternate page with proper canonical tag"),
    // whereas a missing canonical only falls back to the request URL.
    // path "" is the homepage. `${SITE_URL}` with no trailing slash yields the
    // bare origin "https://magic-room.dev", but the URL Google actually has in
    // its index (and reports in Search Console) is "https://magic-room.dev/".
    // Emit the form Google uses so the canonical is a byte-for-byte
    // self-reference rather than relying on origin normalisation.
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
        // Page-level `robots` REPLACES the root layout's robots object in Next.js
        // metadata resolution — it is not merged. The googleBot directives below
        // must therefore be repeated here, otherwise every page that calls
        // createMetadata() silently loses max-image-preview:large (no image
        // thumbnails in SERPs / Discover) and max-snippet:-1.
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
        // Was 64 chars (cut mid-phrase) with a 205-char description that Google
        // truncated at ~155 — everything after "Photos never stored" was never
        // seen. Both now fit inside what actually renders.
        title: {
            absolute: "AI Interior Design: Redesign Any Room From One Photo (2026)",
        },
        description:
            "Turn one room photo into 4–8 AI redesigns in 60 seconds, powered by Google Gemini. Photos never stored. €9.99 once, not monthly. 1 free credit, no card.",
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
        // "Built for Privacy" is a category claim; "Never Keeps Your Photos" is
        // the same claim made checkable, which is what earns the click.
        title: {
            absolute: "What Is Magic Room? The AI Room Designer That Keeps Nothing",
        },
        description:
            "Magic Room turns one room photo into 4–8 AI redesigns in 60 seconds. Built by one developer, €9.99 once instead of monthly, photos never stored.",
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
        // Old title led with the category ("AI Virtual Staging for Real Estate")
        // and said nothing an agent scanning nine results couldn't already
        // assume. The price is the differentiator, so the price goes in the
        // title. Old description also quoted dollars while the whole product
        // prices in euros.
        title: { absolute: "AI Virtual Staging: Stage Any Listing for Under €1" },
        description:
            "Stage a listing photo with AI for under €1 instead of thousands for traditional staging. Upload, pick a style, download in 60 seconds. Commercial rights.",
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

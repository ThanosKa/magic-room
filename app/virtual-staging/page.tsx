import { Metadata } from "next";
import { virtualStagingMetadata } from "@/lib/seo/metadata";
import {
    faqSchema,
    breadcrumbSchema,
    softwareApplicationSchema,
} from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { VirtualStagingContent } from "@/components/seo/virtual-staging-content";
import { JsonLd } from "@/components/seo/json-ld";

export function generateMetadata(): Metadata {
    return virtualStagingMetadata();
}

const PAGE_URL = `${SITE_URL}/virtual-staging`;

const FAQS = [
    {
        question: "What is AI virtual staging?",
        answer:
            "AI virtual staging uses generative AI to digitally furnish and decorate a room photo. You upload an image of an empty or unfurnished space and the AI returns a photo-realistic version with furniture, lighting, and decor appropriate to the style you selected. The result can be used directly in MLS listings, property websites, or marketing materials.",
    },
    {
        question: "How much does AI virtual staging cost compared to traditional staging?",
        answer:
            "In the National Association of Realtors 2025 Profile of Home Staging, hiring a staging service cost a median of $1,500, before the furniture is delivered and collected. AI virtual staging with Magic Room costs one credit per Quick photo, €0.25 to €0.50 depending on the pack: the €9.99 Starter pack's 20 credits stage 20 photos, several listings' worth.",
    },
    {
        question: "Can I use the staged images in my MLS listing?",
        answer:
            "Yes. The images you generate are yours to use in MLS listings, property portals, social media, and print marketing. Most MLS systems require a disclosure that images are virtually staged — always check your local board requirements and add a 'virtually staged' label to stay compliant.",
    },
    {
        question: "Does Magic Room store or share my listing photos?",
        answer:
            "No. Images are converted to base64 in your browser, sent directly to the AI model, and processed entirely in memory. Nothing is written to a database or file store. Your listing photos never persist on our servers and are never used to train AI models.",
    },
    {
        question: "What types of properties and rooms does it work best for?",
        answer:
            "AI virtual staging works across all residential property types — single-family homes, condos, apartments, and vacation rentals. It performs best on living rooms, bedrooms, dining rooms, and home offices. For best results, use a photo taken in good natural light with a clear view of the entire room.",
    },
    {
        question: "How many photos can I stage per listing?",
        answer:
            "There is no per-listing limit. Each Quick generation uses one credit (Pro uses 2, Ultra 3). A typical listing might require 3 to 8 key room photos. At €0.25 to €0.50 per Quick photo, staging every important room in a property costs a few euros.",
    },
];

export default function VirtualStagingPage() {
    const schemas = [
        breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Virtual Staging", url: PAGE_URL },
        ]),
        softwareApplicationSchema({
            description:
                "AI virtual staging for real estate listings. Upload an empty or unfurnished room photo and get a photo-realistic staged image in 60 seconds, for under €1 per photo.",
            includeOffers: true,
        }),
        faqSchema({ items: FAQS, pageUrl: PAGE_URL }),
    ];

    return (
        <>
            <JsonLd schemas={schemas} />
            <VirtualStagingContent />
        </>
    );
}

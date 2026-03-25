import { Metadata } from "next";
import { virtualStagingMetadata } from "@/lib/seo/metadata";
import { faqSchema, breadcrumbSchema, howToSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";
import { VirtualStagingContent } from "@/components/seo/virtual-staging-content";

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
            "Traditional professional staging typically costs $2,000 to $5,000 per property, covering a staging consultation, furniture rental, and moving fees. AI virtual staging with Magic Room costs less than $1 per photo. A pack of 10 credits covers ten staged images for a few dollars — a fraction of what you would pay a staging company even for a single room.",
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
            "There is no per-listing limit. Each generation uses one credit. A typical listing might require 3 to 8 key room photos. You can buy credit packs that work out to well under $1 per staged image, making it practical to stage every important room in a property.",
    },
];

export default function VirtualStagingPage() {
    const schemas = [
        breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Virtual Staging", url: PAGE_URL },
        ]),
        faqSchema(FAQS, PAGE_URL),
        howToSchema({
            name: "How to virtually stage a property with AI",
            description:
                "Stage a real estate listing photo in 60 seconds using AI — no furniture, no scheduling, under $1 per photo.",
            totalTime: "PT2M",
            url: PAGE_URL,
            steps: [
                {
                    name: "Upload your listing photo",
                    text: "Take or select an existing photo of the room you want to stage. Upload it to Magic Room — JPG, PNG, and WEBP files are all supported.",
                },
                {
                    name: "Select a staging style",
                    text: "Choose a design theme such as modern, Scandinavian, or traditional. Optionally add specific instructions for furniture, colours, or materials.",
                },
                {
                    name: "Download your staged image",
                    text: "The AI generates a photo-realistic staged version of your room in 30 to 60 seconds. Download the result and use it in your MLS listing or marketing materials.",
                },
            ],
        }),
    ];

    return (
        <>
            {schemas.map((schema, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            ))}
            <VirtualStagingContent />
        </>
    );
}

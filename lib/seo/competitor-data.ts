export interface ICompetitorData {
    slug: string;
    name: string;
    website: string;
    description: string;
    pros: string[];
    cons: string[];
    pricing: string;
    magicRoomAdvantages: string[];
    faqs: { question: string; answer: string }[];
    keywords: string[];
}

export const COMPETITORS: ICompetitorData[] = [
    {
        slug: "roomgpt",
        name: "RoomGPT",
        website: "roomgpt.io",
        description:
            "RoomGPT is an AI room redesign tool that became popular for its simple drag-and-drop interface and fast generation. It uses a stable diffusion-based approach to reimagine room photos in different styles.",
        pros: [
            "Simple interface with no account required for basic use",
            "Fast generation using diffusion models",
            "Widely known and has an established user base",
        ],
        cons: [
            "Limited style options compared to newer tools",
            "Image quality is inconsistent — results vary significantly between generations",
            "Generated images are stored on the service's servers",
            "No privacy guarantees around uploaded room photos",
            "Less control over specific design direction",
        ],
        pricing:
            "RoomGPT offers a free tier with limited generations. Paid plans are available for more generations per month, typically subscription-based.",
        magicRoomAdvantages: [
            "Magic Room processes images in-memory and never stores your room photos — RoomGPT retains uploaded images on their servers",
            "Magic Room uses Google Gemini multimodal AI, which produces more architecturally coherent outputs than diffusion-only approaches",
            "Magic Room credits never expire and are not tied to a monthly subscription",
            "Magic Room provides 8 distinct design themes with AI that understands the style's specific design principles",
        ],
        faqs: [
            {
                question: "Is Magic Room better than RoomGPT?",
                answer:
                    "Magic Room and RoomGPT take different approaches to AI room redesign. RoomGPT uses a diffusion model that excels at quick stylistic variation but can produce inconsistent architectural results. Magic Room uses Google Gemini multimodal AI, which better preserves the room's structure while applying design themes. For users who want privacy guarantees and predictable results, Magic Room's approach is more suitable.",
            },
            {
                question: "Does RoomGPT store your photos?",
                answer:
                    "Based on publicly available information, RoomGPT stores uploaded images on its servers. Magic Room processes all images in memory and does not retain copies of your room photos after the design generation is complete.",
            },
            {
                question: "Which tool is cheaper: Magic Room or RoomGPT?",
                answer:
                    "Pricing changes over time on both platforms. Magic Room offers one-time credit packages starting from EUR 9.99 with no subscription requirement and credits that never expire. RoomGPT primarily operates on a subscription basis for full access.",
            },
            {
                question: "Can I use Magic Room instead of RoomGPT?",
                answer:
                    "Yes. Magic Room accepts the same input — a photo of your room — and produces redesigned outputs in a range of styles. The workflow is similar: upload a photo, select a style, and download the result. The main differences are the AI model used, the privacy approach, and the pricing structure.",
            },
        ],
        keywords: [
            "roomgpt alternative",
            "better than roomgpt",
            "roomgpt vs magic room",
            "roomgpt competitor",
            "ai room design alternative to roomgpt",
        ],
    },
    {
        slug: "decorai",
        name: "DecorAI",
        website: "decorai.com",
        description:
            "DecorAI is an AI interior design platform that offers multiple design modes including room redesign, virtual staging, and interior concept generation. It targets both homeowners and property professionals.",
        pros: [
            "Multiple design modes including virtual staging for real estate",
            "Professional-oriented features for agents and property developers",
            "Wider range of output types beyond simple room redesign",
        ],
        cons: [
            "More complex interface aimed at professional users rather than homeowners",
            "Higher price point than tools focused on consumer use",
            "Subscription model required for most functionality",
            "Longer generation times for higher-quality outputs",
        ],
        pricing:
            "DecorAI uses a subscription model with different tiers for personal and professional use. Professional plans with team access are considerably more expensive.",
        magicRoomAdvantages: [
            "Magic Room is designed for straightforward room redesign without the complexity of a professional platform",
            "Magic Room's credit model is pay-as-you-go with no ongoing subscription commitment",
            "Magic Room provides a faster path from photo to redesigned room for homeowners who do not need professional staging features",
            "Magic Room's privacy-first approach means uploaded photos are not retained after processing",
        ],
        faqs: [
            {
                question: "Is Magic Room a suitable DecorAI alternative for homeowners?",
                answer:
                    "Yes. DecorAI targets both professional and consumer users, which makes its interface more complex than many homeowners need. Magic Room is designed specifically for the straightforward use case of reimagining a room in a different style, with a simpler workflow and pay-as-you-go pricing that suits occasional use.",
            },
            {
                question: "Does Magic Room offer virtual staging like DecorAI?",
                answer:
                    "Magic Room's AI can transform furnished and unfurnished rooms into styled design variations, which covers the core use case of virtual staging for visualisation purposes. Purpose-built virtual staging tools for real estate listings, with specific output formats required by platforms, are a separate category that Magic Room does not specifically target.",
            },
            {
                question: "How does Magic Room's pricing compare to DecorAI?",
                answer:
                    "Magic Room offers one-time credit packages with no subscription requirement. DecorAI primarily uses subscription pricing. For users who need occasional room redesign rather than frequent professional use, Magic Room's model is likely to be more cost-effective.",
            },
        ],
        keywords: [
            "decorai alternative",
            "ai interior design tool",
            "decorai vs magic room",
            "room redesign tool",
        ],
    },
    {
        slug: "reimaginehome",
        name: "Reimagine Home",
        website: "reimaginehome.ai",
        description:
            "Reimagine Home is an AI interior design tool that offers room redesign, virtual renovation, and landscape design features. It focuses on providing a range of AI-powered home transformation tools in a single platform.",
        pros: [
            "Covers multiple areas including interior and exterior spaces",
            "Landscape and garden design alongside room redesign",
            "Multiple AI rendering modes for different types of output",
        ],
        cons: [
            "Broader scope means individual features are less polished than specialist tools",
            "Subscription required for meaningful generation volume",
            "Generating high-quality outputs often requires several attempts",
            "Limited control over the direction of specific design choices",
        ],
        pricing:
            "Reimagine Home uses a subscription model with monthly credit allocations. Credits do not roll over between billing periods on most plans.",
        magicRoomAdvantages: [
            "Magic Room focuses specifically on interior room redesign and delivers better results in that specific use case than a multi-purpose platform",
            "Magic Room credits never expire — they do not reset at the end of a billing period",
            "Magic Room uses Google Gemini multimodal AI rather than diffusion models, providing more architecturally coherent outputs",
            "Magic Room does not retain your uploaded room photos after processing",
        ],
        faqs: [
            {
                question: "Is Magic Room a good Reimagine Home alternative?",
                answer:
                    "For users who specifically want to redesign interior rooms rather than landscapes or exteriors, Magic Room is more focused and produces more consistent results. If you need landscape or exterior design, Reimagine Home covers those use cases where Magic Room does not.",
            },
            {
                question: "What happens to Reimagine Home credits that are unused?",
                answer:
                    "On most Reimagine Home plans, monthly credits expire at the end of each billing period and do not carry over. Magic Room credits are purchased as packages and never expire, allowing you to use them at your own pace.",
            },
            {
                question: "Which AI model does Magic Room use versus Reimagine Home?",
                answer:
                    "Magic Room uses Google Gemini multimodal AI via OpenRouter, which handles image understanding and generation as a unified process. This produces outputs that better preserve the physical structure of your room while applying the selected design style.",
            },
        ],
        keywords: [
            "reimagine home alternative",
            "reimaginehome ai alternative",
            "ai home design tool",
            "room redesign ai",
        ],
    },
    {
        slug: "interior-ai",
        name: "Interior AI",
        website: "interiorai.com",
        description:
            "Interior AI is one of the earlier AI room redesign tools, offering virtual staging and style transformation through a diffusion model approach. It was one of the first tools to demonstrate AI-powered interior design generation at scale.",
        pros: [
            "Established tool with a large base of generated examples for reference",
            "Simple interface focused on the core redesign use case",
            "Wide variety of style presets",
        ],
        cons: [
            "Diffusion model approach can produce results that alter room geometry inconsistently",
            "Output resolution and quality have been surpassed by newer model approaches",
            "Less privacy transparency around image storage",
            "Generation results are inconsistent — significant variation between attempts with the same prompt",
        ],
        pricing:
            "Interior AI offers both free limited access and paid plans. Pricing has changed since launch; current plans vary by generation volume.",
        magicRoomAdvantages: [
            "Magic Room uses Google Gemini multimodal AI, a more recent model that better preserves architectural structure than the diffusion approach Interior AI uses",
            "Magic Room guarantees that uploaded room photos are not retained after processing — Interior AI does not make equivalent privacy guarantees",
            "Magic Room's design themes include specific guidance that shapes the AI output more precisely than generic style presets",
            "Magic Room provides more consistent results between generation attempts",
        ],
        faqs: [
            {
                question: "Is Magic Room better than Interior AI?",
                answer:
                    "Magic Room uses a more recent AI approach (Google Gemini multimodal) that produces outputs with better structural coherence than the diffusion models Interior AI uses. For users who want results that respect the physical dimensions and layout of their existing room, Magic Room tends to produce more useful outputs. Interior AI has a larger catalogue of generated examples to browse for inspiration.",
            },
            {
                question: "Does Interior AI keep your uploaded photos?",
                answer:
                    "Interior AI does not publish explicit privacy commitments around photo retention comparable to Magic Room's in-memory processing guarantee. Magic Room explicitly does not retain uploaded room photos after the generation is complete.",
            },
            {
                question: "How does Magic Room handle image quality compared to Interior AI?",
                answer:
                    "Both tools accept standard room photographs. Magic Room uses Google Gemini's multimodal processing, which tends to produce higher-resolution outputs with better texture and material coherence than diffusion-based approaches. The practical difference is most visible in how well room features — flooring, walls, windows — are preserved in the redesigned output.",
            },
        ],
        keywords: [
            "interior ai alternative",
            "interiorai alternative",
            "ai room redesign tool",
            "better interior ai",
        ],
    },
];

export function getCompetitorBySlug(slug: string): ICompetitorData | undefined {
    return COMPETITORS.find((c) => c.slug === slug);
}

export function getAllCompetitorSlugs(): string[] {
    return COMPETITORS.map((c) => c.slug);
}

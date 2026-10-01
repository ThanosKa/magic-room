/**
 * Pricing mechanics, stated as *model* rather than as a euro figure.
 *
 * Search Console shows a large, consistent pricing-intent cluster against these
 * competitor names — roughly 40 impressions on "reimagine home pricing 2026" and
 * its variants, 26 on "interior ai pricing 2026" variants, 15 on "roomgpt
 * pricing 2026" variants — and the pages currently answer none of it.
 *
 * Deliberately no scraped price figures: vendor pricing changes without notice
 * and a stale number on a comparison page destroys the trust the page exists to
 * build. What is captured here is the part that does not churn — how you are
 * billed, whether credits survive the billing period, what happens when you stop
 * paying — plus a link to the vendor's own page for the current rate.
 */
import { isPrunedPath } from "@/lib/seo/pruned";

export interface IPricingModel {
    /** How the vendor bills: subscription, one-time, hybrid. */
    billing: string;
    /** What you get without paying. */
    freeTier: string;
    /** Whether unused credits survive the billing period. */
    creditsExpire: string;
    /** Whether outputs can be used commercially, and on which tier. */
    commercialRights: string;
    /** What happens to access and to past outputs when you stop paying. */
    ifYouStopPaying: string;
    /** Vendor's own pricing page, for the current rate. */
    officialPricingUrl: string;
}

export interface ICompetitorData {
    slug: string;
    name: string;
    website: string;
    description: string;
    pros: string[];
    cons: string[];
    pricing: string;
    pricingModel: IPricingModel;
    /** Concrete reasons people give for moving off this tool. */
    whySwitch: string[];
    /** What switching actually involves. */
    migration: string;
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
        pricingModel: {
            billing:
                "Credit packs and recurring plans. The free tier is capped at a small number of generations, after which continued use requires payment.",
            freeTier:
                "A handful of free generations, typically gated behind a Google sign-in. Enough to evaluate output quality, not enough to redesign a house.",
            creditsExpire:
                "Recurring plans allocate credits per billing period; unused allocation generally does not carry forward.",
            commercialRights:
                "Not clearly stated for the free tier. If you are staging a listing or producing client work, confirm this before you rely on an output.",
            ifYouStopPaying:
                "Generation stops at the free-tier cap. Previously generated images remain on RoomGPT's servers rather than being deleted.",
            officialPricingUrl: "https://roomgpt.io",
        },
        whySwitch: [
            "Room geometry drifts between attempts — walls move, windows relocate, and the output stops being usable as a planning reference for your actual room",
            "Uploaded room photos are retained on the service's servers rather than discarded after processing",
            "The free tier runs out quickly and the paid step-up is recurring, which is poor value for someone redesigning two or three rooms once",
            "Limited control over specific design direction — you get a style, not a set of decisions you can steer",
        ],
        migration:
            "There is nothing to export. Both tools take the same input — a photo of your room — so switching means uploading the same photo somewhere else. Magic Room gives every new account 1 free credit with no card required, so you can run the identical photo through both and compare outputs side by side before spending anything. If you are on a RoomGPT recurring plan, cancel it after you have compared, not before.",
        magicRoomAdvantages: [
            "Magic Room processes images in-memory and never stores your room photos — RoomGPT retains uploaded images on their servers",
            "Magic Room uses Google Gemini multimodal AI, which produces more architecturally coherent outputs than diffusion-only approaches",
            "Magic Room credits never expire and are not tied to a monthly subscription",
            "Magic Room provides 14 distinct design themes with AI that understands each style's specific design principles",
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
            {
                question: "How do I switch from RoomGPT to Magic Room?",
                answer:
                    "There is nothing to migrate — Magic Room works directly from your room photos, so you can switch instantly. Create an account to claim 1 free credit, upload the same photo you would use in RoomGPT, pick one of the 14 design themes, and generate. Because credits are one-time purchases that never expire, there is no subscription to cancel before you start.",
            },
            {
                question: "Is there a free RoomGPT alternative?",
                answer:
                    "Magic Room gives every new account 1 free credit with no card required, so you can generate a full set of redesigns before paying anything. After that, credits start at €9.99 for 30 designs (about €0.33 each) with no monthly commitment — a lower entry cost than most subscription-based RoomGPT alternatives.",
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
        pricingModel: {
            billing:
                "Tiered subscription, separated into personal and professional plans. Team access sits on the higher tiers.",
            freeTier:
                "Limited trial access. Most of the platform's output types are behind a paid tier.",
            creditsExpire:
                "Monthly allocation. Unused generations reset at the end of the billing period on standard plans.",
            commercialRights:
                "Generally tied to the professional tiers. Verify before using outputs on a live listing.",
            ifYouStopPaying:
                "Access to the professional output types ends with the subscription.",
            officialPricingUrl: "https://decorai.com",
        },
        whySwitch: [
            "The interface is built for professional staging workflows, which is significant overhead if all you want is to see your living room in a different style",
            "The subscription is priced for continuous professional use and is poor value for two or three redesigns",
            "Generation times are longer on the higher-quality settings",
            "Uploaded photos are retained rather than processed and discarded",
        ],
        migration:
            "No data to move — Magic Room works from the same room photo. The practical difference is workflow: DecorAI expects you to configure a staging job, Magic Room expects you to pick a room type and a style. If you use DecorAI specifically for real-estate staging output formats, run one listing photo through both before cancelling, since that is the use case where DecorAI's extra configuration earns its keep.",
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
        pricingModel: {
            billing:
                "Monthly or annual subscription with a credit allocation per period. Higher tiers raise the allocation and unlock additional rendering modes.",
            freeTier:
                "A small number of free credits on signup, sufficient to evaluate output quality on one or two rooms.",
            creditsExpire:
                "Yes — this is the detail worth checking before you subscribe. On most plans the monthly credit allocation resets at the end of the billing period and unused credits do not carry forward. If your redesign happens in bursts, you pay for months you do not use.",
            commercialRights:
                "Tied to plan tier. Confirm the tier you are on covers listing photos before publishing an output.",
            ifYouStopPaying:
                "Credit allocation stops immediately at the end of the billing period. Remaining unused credits from that period are not refunded or carried over.",
            officialPricingUrl: "https://www.reimaginehome.ai/pricing",
        },
        whySwitch: [
            "Monthly credits reset — you pay a recurring fee whether or not you redesign anything that month, which suits agencies and penalises homeowners",
            "The platform covers interiors, exteriors and landscaping, so the interior redesign specifically is less refined than a tool that only does interiors",
            "Getting a usable output often takes several attempts, which consumes the monthly allocation faster than the plan implies",
            "Limited control over specific design direction within a chosen style",
        ],
        migration:
            "Nothing to export or import — both tools start from a room photo. The one thing worth timing: because Reimagine Home credits reset at the end of the billing period, use whatever allocation you have left before cancelling. Magic Room's 1 free credit lets you run the same photo through both in parallel first, and Magic Room credits are bought once and never expire, so there is no equivalent deadline afterwards.",
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
            {
                question: "How does Magic Room pricing compare to Reimagine Home?",
                answer:
                    "Reimagine Home uses a monthly subscription where unused credits typically reset at the end of each billing period. Magic Room sells one-time credit packages from €9.99 for 30 designs (about €0.33 each) that never expire, so occasional users do not pay for months they do not use. Both include a free way to try the tool before paying.",
            },
            {
                question: "Is Magic Room a free Reimagine Home alternative?",
                answer:
                    "Magic Room includes 1 free credit on signup with no card required, letting you generate a redesign before committing. Unlike Reimagine Home's recurring plans, Magic Room never charges a subscription — you buy credits only when you need them, and they never expire.",
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
        pricingModel: {
            billing:
                "Subscription tiers scaled by generation volume and output resolution. Pricing has been revised several times since launch, so a figure quoted elsewhere is likely out of date.",
            freeTier:
                "Limited free access, generally with watermarking or reduced resolution on outputs.",
            creditsExpire:
                "Volume allowances are per billing period and do not accumulate.",
            commercialRights:
                "Restricted on the free tier. Higher tiers remove watermarking, which is the practical gate on commercial use.",
            ifYouStopPaying:
                "You revert to the limited free tier, including any watermarking that applies to it.",
            officialPricingUrl: "https://interiorai.com/pricing",
        },
        whySwitch: [
            "Diffusion-based generation alters room geometry inconsistently, so outputs are inspiration rather than a reference for your actual space",
            "Output resolution and quality have been overtaken by newer multimodal models",
            "Results vary significantly between attempts with the same prompt, which burns through a monthly allowance",
            "No equivalent commitment on what happens to uploaded room photos",
        ],
        migration:
            "Switching is immediate — there is no library to migrate, since both tools generate from a photo you already have. If you use Interior AI's example catalogue for inspiration, that remains freely browsable after you stop paying. Run the same source photo through Magic Room's free credit and compare how closely each output preserves your room's actual walls, windows and proportions; that is the dimension where the two approaches diverge most.",
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

/**
 * Single source of truth for which competitors have a `/vs/[competitor]` page.
 *
 * This list was previously duplicated in both `app/vs/[competitor]/page.tsx`
 * and `app/sitemap.ts`. Any drift between the two would have shipped a
 * sitemap URL that returns 404 (adding a slug to the sitemap copy only) or an
 * orphaned indexable page (adding it to the route copy only). Both routes now
 * import this constant.
 */
export const VS_SLUGS: string[] = getAllCompetitorSlugs().filter(
    (slug) => !isPrunedPath(`/vs/${slug}`)
);

export function hasVsPage(slug: string): boolean {
    return VS_SLUGS.includes(slug);
}

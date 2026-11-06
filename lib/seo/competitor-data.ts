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
    /** What the vendor says it does with uploaded photos, with source and date. */
    imageStorage: string;
    /** Which model the vendor says it uses, with source and date. */
    aiModel: string;
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
            "RoomGPT is an AI room redesign tool that became popular for its simple drag-and-drop interface and fast generation. It started as an open-source project that ran ControlNet, a diffusion model, on Replicate (github.com/Nutlope/roomGPT); the paid version at roomgpt.io does not say which model it uses today (as of November 2026).",
        pros: [
            "Simple interface with no account required for basic use",
            "One-step flow: upload a photo, pick a style",
            "Widely known and has an established user base",
        ],
        cons: [
            "Limited style options compared to newer tools",
            "Image quality is inconsistent — results vary significantly between generations",
            "roomgpt.io has no privacy policy page saying how long uploaded room photos are kept (checked November 2026)",
            "Less control over specific design direction",
        ],
        pricing:
            "RoomGPT sells credits on roomgpt.io/buy-credits. That page lists no prices and does not say whether plans renew (as of November 2026).",
        pricingModel: {
            billing:
                "Credits bought on roomgpt.io/buy-credits. The page lists no prices and does not say whether a plan renews (as of November 2026).",
            freeTier:
                "A handful of free generations, typically gated behind a Google sign-in. Enough to evaluate output quality, not enough to redesign a house.",
            creditsExpire:
                "Not stated on roomgpt.io (as of November 2026).",
            commercialRights:
                "Not clearly stated for the free tier. If you are staging a listing or producing client work, confirm this before you rely on an output.",
            ifYouStopPaying:
                "Generation stops when your credits run out. roomgpt.io does not say whether past uploads and outputs are kept or deleted.",
            officialPricingUrl: "https://www.roomgpt.io/buy-credits",
        },
        imageStorage:
            "Not stated: roomgpt.io has no privacy policy page (checked November 2026)",
        aiModel:
            "Not stated for the paid version; the open-source original ran ControlNet, a diffusion model (github.com/Nutlope/roomGPT)",
        whySwitch: [
            "Room geometry drifts between attempts — walls move, windows relocate, and the output stops being usable as a planning reference for your actual room",
            "roomgpt.io publishes no policy on what happens to uploaded room photos, which matters if the photo shows your home or a client's listing",
            "The credits page lists no prices, so you cannot compare cost before you sign in",
            "Limited control over specific design direction — you get a style, not a set of decisions you can steer",
        ],
        migration:
            "There is nothing to export. Both tools take the same input — a photo of your room — so switching means uploading the same photo somewhere else. Magic Room gives every new account 1 free credit with no card required, so you can run the identical photo through both and compare outputs side by side before spending anything. If you still have RoomGPT credits, use them up first; nothing carries over between the two tools.",
        magicRoomAdvantages: [
            "Magic Room processes images in memory and never stores your room photos; roomgpt.io publishes no policy on how long it keeps uploads",
            "Magic Room uses Google Gemini and OpenAI multimodal models, which read your photo and your instruction together so walls, windows and layout stay in place",
            "Magic Room credits never expire and are not tied to a monthly subscription",
            "Magic Room provides 14 distinct design themes with AI that understands each style's specific design principles",
        ],
        faqs: [
            {
                question: "Is Magic Room better than RoomGPT?",
                answer:
                    "It depends on what you need. RoomGPT does not say which model its paid version uses (its open-source predecessor ran ControlNet, a diffusion model). Magic Room uses Google Gemini and OpenAI multimodal models, which keep the room's structure while applying the style, never stores your photos, and lists its prices up front. Run the same photo through both with the free credit and compare.",
            },
            {
                question: "Does RoomGPT store your photos?",
                answer:
                    "roomgpt.io does not publish a privacy policy that answers this (checked November 2026), so we cannot say either way. Magic Room processes every photo in memory and keeps no copy after the design is generated.",
            },
            {
                question: "Which tool is cheaper: Magic Room or RoomGPT?",
                answer:
                    "Pricing changes over time on both platforms. Magic Room offers one-time credit packages starting from EUR 9.99 with no subscription requirement and credits that never expire. RoomGPT sells credits too, but its buy-credits page lists no prices and does not say whether plans renew (as of November 2026).",
            },
            {
                question: "Can I use Magic Room instead of RoomGPT?",
                answer:
                    "Yes. Magic Room accepts the same input — a photo of your room — and produces redesigned outputs in a range of styles. The workflow is similar: upload a photo, select a style, and download the result. The main differences are the AI model used, the privacy approach, and how openly prices are shown.",
            },
            {
                question: "How do I switch from RoomGPT to Magic Room?",
                answer:
                    "There is nothing to migrate — Magic Room works directly from your room photos, so you can switch instantly. Create an account to claim 1 free credit, upload the same photo you would use in RoomGPT, pick one of the 14 design themes, and generate. Because credits are one-time purchases that never expire, there is no subscription to cancel before you start.",
            },
            {
                question: "Is there a free RoomGPT alternative?",
                answer:
                    "Magic Room gives every new account 1 free credit with no card required, so you can generate a full redesign before paying anything. After that, credits start at €9.99 for 20 credits (about €0.50 per Quick design) with no monthly commitment — a lower entry cost than most subscription-based RoomGPT alternatives.",
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
        website: "decorai.io",
        description:
            "DecorAI is an AI interior design platform that offers multiple design modes including room redesign, virtual staging, and interior concept generation. It targets both homeowners and property professionals.",
        pros: [
            "Multiple design modes including virtual staging for real estate",
            "Professional-oriented features for agents and property developers",
            "Wider range of output types beyond simple room redesign",
        ],
        cons: [
            "More complex interface aimed at professional users rather than homeowners",
            "Subscription required after a short trial, and the trial asks for a payment card",
            "Paying monthly is poor value if you only redesign a room or two",
            "Longer generation times for higher-quality outputs",
        ],
        pricing:
            "DecorAI is a subscription billed monthly, half-yearly or yearly. Paid plans include unlimited images; AI videos are capped per plan. New users get a short trial with 3 designs, and the trial asks for a card (decorai.io/pricing, as of November 2026).",
        pricingModel: {
            billing:
                "Subscription billed monthly, half-yearly or yearly. Every paid plan includes unlimited AI images; the plans differ in how many AI videos you get (decorai.io/pricing, as of November 2026).",
            freeTier:
                "A 1-day trial with 3 full-quality designs. The trial asks for a payment card, and the subscription starts when it ends unless you cancel.",
            creditsExpire:
                "Images do not use credits on a paid plan, so there is nothing to expire. What you lose is the subscription itself: a month you do not use is still paid for. AI videos come from a per-plan allowance.",
            commercialRights:
                "Every plan, the trial included, carries commercial usage rights (decorai.io/pricing, as of November 2026).",
            ifYouStopPaying:
                "Access to the professional output types ends with the subscription.",
            officialPricingUrl: "https://decorai.io/pricing/",
        },
        imageStorage:
            "Uploads and outputs kept while your account is active, deleted on request; not used for training (decorai.io/privacy, as of November 2026)",
        aiModel: "Not named on decorai.io (as of November 2026)",
        whySwitch: [
            "The interface is built for professional staging workflows, which is significant overhead if all you want is to see your living room in a different style",
            "The subscription is priced for continuous professional use and is poor value for two or three redesigns",
            "The free trial asks for a payment card and turns into a subscription unless you cancel in time",
            "Generation times are longer on the higher-quality settings",
        ],
        migration:
            "No data to move — Magic Room works from the same room photo. The practical difference is workflow: DecorAI expects you to configure a staging job, Magic Room expects you to pick a room type and a style. If you use DecorAI specifically for real-estate staging output formats, run one listing photo through both before cancelling, since that is the use case where DecorAI's extra configuration earns its keep.",
        magicRoomAdvantages: [
            "Magic Room is designed for straightforward room redesign without the complexity of a professional platform",
            "Magic Room's credit model is pay-as-you-go with no ongoing subscription commitment",
            "Magic Room provides a faster path from photo to redesigned room for homeowners who do not need professional staging features",
            "Magic Room never stores uploaded photos; DecorAI keeps uploads and outputs while your account is active unless you ask for deletion (decorai.io/privacy, as of November 2026)",
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
                    "DecorAI is a subscription with unlimited images on every paid plan (decorai.io/pricing, as of November 2026). Magic Room sells one-time credit packs from €9.99 for 20 credits that never expire. If you redesign rooms every week, DecorAI's unlimited plan can work out cheaper. If you redesign a few rooms a year, paying once is cheaper, and there is no trial to remember to cancel.",
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
            "Reimagine Home is a monthly subscription from $14 to $99 a month with 30, 200, 400 or 900 credits a month; one generation is one credit. New users get 5 free designs with no card (reimaginehome.ai/pricing, as of November 2026).",
        pricingModel: {
            billing:
                "Monthly subscription with a credit allowance per month: Essential 30, Pro 200, Advanced 400, Agency 900 credits, $14 to $99 a month. One generation is one credit (reimaginehome.ai/pricing, as of November 2026).",
            freeTier:
                "5 free designs for new users, same model as paid plans, no card required (reimaginehome.ai/pricing, as of November 2026).",
            creditsExpire:
                "The pricing page does not say whether unused credits roll over (as of November 2026), so check before you subscribe. Either way the fee is monthly: if your redesigns come in bursts, you pay for months you do not use.",
            commercialRights:
                "Not addressed on the pricing page; the Essential plan lists watermark-free, shareable images. Confirm before publishing an output on a listing.",
            ifYouStopPaying:
                "New credits stop with the subscription. Uploads and projects stay stored while the account is active, until you delete them (reimaginehome.ai/privacy-policy, as of November 2026).",
            officialPricingUrl: "https://www.reimaginehome.ai/pricing",
        },
        imageStorage:
            "Uploads kept while your account is active or until you delete them; may train its own models unless you opt out (reimaginehome.ai/privacy-policy, as of November 2026)",
        aiModel: "Not named on reimaginehome.ai (as of November 2026)",
        whySwitch: [
            "It is a monthly fee whether or not you redesign anything that month, which suits agencies and penalises homeowners",
            "The platform covers interiors, exteriors and landscaping, so the interior redesign specifically is less refined than a tool that only does interiors",
            "Getting a usable output often takes several attempts, which consumes the monthly allocation faster than the plan implies",
            "Limited control over specific design direction within a chosen style",
        ],
        migration:
            "Nothing to export or import — both tools start from a room photo. The one thing worth timing: use whatever credits you have left before you cancel the subscription. Magic Room's 1 free credit lets you run the same photo through both in parallel first, and Magic Room credits are bought once and never expire, so there is no equivalent deadline afterwards.",
        magicRoomAdvantages: [
            "Magic Room focuses specifically on interior room redesign and delivers better results in that specific use case than a multi-purpose platform",
            "Magic Room credits never expire and there is no monthly fee",
            "Magic Room uses Google Gemini and OpenAI multimodal models, which read your photo and your instruction together so the room's structure stays in place",
            "Magic Room never stores your room photos; Reimagine Home keeps uploads while your account is active and may use them to train its own models unless you opt out (reimaginehome.ai/privacy-policy, as of November 2026)",
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
                    "Reimagine Home's pricing page does not say whether unused monthly credits roll over (as of November 2026); ask them before you rely on it. Magic Room credits are purchased as packages and never expire, allowing you to use them at your own pace.",
            },
            {
                question: "Which AI model does Magic Room use versus Reimagine Home?",
                answer:
                    "Magic Room uses Google Gemini and OpenAI multimodal AI via OpenRouter, which handles image understanding and generation as a unified process. This produces outputs that better preserve the physical structure of your room while applying the selected design style.",
            },
            {
                question: "How does Magic Room pricing compare to Reimagine Home?",
                answer:
                    "Reimagine Home is a monthly subscription from $14 to $99 a month for 30 to 900 credits (reimaginehome.ai/pricing, as of November 2026). Magic Room sells one-time credit packages from €9.99 for 20 credits (about €0.50 per Quick design) that never expire, so occasional users do not pay for months they do not use. Both include a free way to try the tool before paying.",
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
            "Interior AI is one of the earlier AI room redesign tools, offering virtual staging and style transformation. Its Pro plan renders with the Flux model (interiorai.com/pricing, as of November 2026). It was one of the first tools to demonstrate AI-powered interior design generation at scale.",
        pros: [
            "Established tool with a large base of generated examples for reference",
            "Simple interface focused on the core redesign use case",
            "Wide variety of style presets",
        ],
        cons: [
            "Output resolution and quality have been surpassed by newer model approaches",
            "Uploads and renders are stored on the service; it says only you can access them (interiorai.com/pricing, as of November 2026)",
            "Generation results are inconsistent — significant variation between attempts with the same prompt",
        ],
        pricing:
            "Interior AI is a subscription: Pro $49, Premium $99, Ultra $199 a month, or $29, $49, $99 a month billed yearly, for 1,000 to 25,000 designs a month (interiorai.com/pricing, as of November 2026).",
        pricingModel: {
            billing:
                "Monthly or yearly subscription. Plans differ by designs per month (1,000, 5,000, 25,000), render quality and features such as virtual staging, which starts on Premium (interiorai.com/pricing, as of November 2026).",
            freeTier:
                "No free tier is listed on the pricing page (as of November 2026).",
            creditsExpire:
                "Allowances are per month; the pricing page does not say whether unused designs carry over.",
            commercialRights:
                "Every paid plan includes a commercial use license (interiorai.com/pricing, as of November 2026).",
            ifYouStopPaying:
                "Generation stops with the subscription.",
            officialPricingUrl: "https://interiorai.com/pricing",
        },
        imageStorage:
            "Photos and renders stored, accessible only by you, not used for training (interiorai.com/pricing, as of November 2026)",
        aiModel:
            "Flux on the Pro plan; \"Hyper Realism\" on Premium and Ultra (interiorai.com/pricing, as of November 2026)",
        whySwitch: [
            "The cheapest plan is $29 a month billed yearly, a lot for someone redesigning two or three rooms",
            "Output resolution and quality have been overtaken by newer multimodal models",
            "Results vary significantly between attempts with the same prompt, which burns through a monthly allowance",
            "Uploads and renders are kept on the service, where Magic Room keeps nothing",
        ],
        migration:
            "Switching is immediate — there is no library to migrate, since both tools generate from a photo you already have. If you use Interior AI's example catalogue for inspiration, that remains freely browsable after you stop paying. Run the same source photo through Magic Room's free credit and compare how closely each output preserves your room's actual walls, windows and proportions; that is the dimension where the two approaches diverge most.",
        magicRoomAdvantages: [
            "Magic Room uses Google Gemini and OpenAI multimodal models, which read your photo and your instruction together so walls, windows and layout stay in place",
            "Magic Room never stores uploaded room photos; Interior AI stores them and says only you can access them",
            "Magic Room's design themes include specific guidance that shapes the AI output more precisely than generic style presets",
            "Magic Room provides more consistent results between generation attempts",
        ],
        faqs: [
            {
                question: "Is Magic Room better than Interior AI?",
                answer:
                    "They suit different users. Interior AI is a subscription from $29 a month (billed yearly) with high monthly volumes and extras like walkthrough videos, which fits professionals. Magic Room is pay-once credits from €9.99 that never expire, uses Google Gemini and OpenAI multimodal models that keep your room's layout, and never stores your photos, which fits homeowners redesigning a few rooms.",
            },
            {
                question: "Does Interior AI keep your uploaded photos?",
                answer:
                    "Yes, it stores them: its pricing page says it does not train on your photos and that your photos and renders are only accessible by you (interiorai.com/pricing, as of November 2026). Magic Room keeps no copy at all: photos are processed in memory and discarded after the design is generated.",
            },
            {
                question: "How does Magic Room handle image quality compared to Interior AI?",
                answer:
                    "Both tools accept standard room photographs. Magic Room uses multimodal Google Gemini and OpenAI image models, which read your photo and your instruction together. The practical difference is most visible in how well room features — flooring, walls, windows — are preserved in the redesigned output.",
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

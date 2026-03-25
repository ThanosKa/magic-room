import { Metadata } from "next";
import { homeMetadata, faqSchema, howToSchema, SITE_URL } from "@/lib/seo";
import HomeContent from "@/components/home-content";

export const metadata: Metadata = homeMetadata();

const FAQ_ITEMS = [
  {
    question: "How does Magic Room work?",
    answer:
      "Magic Room uses Google Gemini multimodal AI via OpenRouter to analyze your uploaded room photo and generate professional interior design variations. The AI preserves your room's original structure and layout while applying your chosen style. Each generation takes 30-60 seconds and produces 4-8 unique design variations you can compare side by side.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes — every new account receives 1 free credit on signup so you can try the AI before purchasing. Additional credits start at €9.99 for 30 credits (roughly €0.33 per design). Credits never expire, so you can use them at your own pace with no subscription required.",
  },
  {
    question: "What happens to my photos?",
    answer:
      "Your photos are processed in-memory only and never stored on our servers. Images are sent directly to the AI as base64 data, processed, and deleted immediately after your results are returned. We never use your photos for AI training, and no image ever touches a storage bucket.",
  },
  {
    question: "Can I use the designs for commercial projects?",
    answer:
      "Yes, you own full commercial rights to every design generated with your paid credits. Common commercial uses include real estate listing photos, interior design client presentations, Airbnb listing imagery, and renovation planning decks. Free-credit generations are for personal use only.",
  },
  {
    question: "How long does it take?",
    answer:
      "Most generations complete in 30-60 seconds. Each run produces 4-8 design variations powered by Google Gemini AI, so you get a range of interpretations to choose from in under a minute — no waiting, no polling, results appear as soon as processing finishes.",
  },
  {
    question: "What AI model does Magic Room use?",
    answer:
      "Magic Room uses Google Gemini multimodal AI (google/gemini-2.5-flash-image) accessed via the OpenRouter API. Gemini processes both your room image and your text prompt simultaneously, allowing it to understand spatial context, maintain the room's structure, and apply design styles accurately without distorting walls, windows, or furniture placement.",
  },
  {
    question: "How is Magic Room different from RoomGPT?",
    answer:
      "Magic Room is pay-per-use (from €9.99 for 30 credits) with no monthly subscription, while RoomGPT charges a recurring fee. Crucially, Magic Room never stores your photos — images are processed in-memory and deleted immediately, making it the privacy-first alternative. All 14 design themes are available on every plan with no upsells.",
  },
  {
    question: "Can I use Magic Room for real estate virtual staging?",
    answer:
      "Yes. Real estate agents and property managers use Magic Room to virtually stage empty or outdated rooms for listing photos. At under €1 per room, it costs a fraction of traditional virtual staging services that charge €75-150 per room. Results are ready in under a minute and you retain full commercial rights to use them in listings.",
  },
  {
    question: "How many design styles does Magic Room offer?",
    answer:
      "Magic Room offers 14 design styles: Modern, Minimalist, Scandinavian, Industrial, Tropical, Bohemian, Vintage, Luxury, Japandi, Art Deco, Coastal, Farmhouse, Mediterranean, and Transitional. Each style can be applied across 14 room types — living room, bedroom, kitchen, bathroom, dining room, home office, and more — for 196 possible combinations.",
  },
];

const HOME_HOWTO = howToSchema({
  name: "How to Redesign a Room with AI",
  description:
    "Transform any room in your home using AI-powered interior design in three simple steps.",
  totalTime: "PT2M",
  steps: [
    {
      name: "Upload a photo of your room",
      text: "Take a clear photo of the room you want to redesign. Shoot from a corner or doorway in good lighting to capture as much of the space as possible, then upload it to Magic Room.",
    },
    {
      name: "Choose your design style and room type",
      text: "Select from 14 design themes including Modern, Scandinavian, Industrial, Bohemian, and more. Confirm your room type and optionally add custom details about what you want.",
    },
    {
      name: "Get your AI-generated design in seconds",
      text: "The AI processes your photo and generates a professionally redesigned version of your room in 30 to 60 seconds. Download the result for planning, sharing, or inspiration.",
    },
  ],
  url: SITE_URL,
});

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(FAQ_ITEMS, SITE_URL)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(HOME_HOWTO),
        }}
      />
      <HomeContent />
    </>
  );
}

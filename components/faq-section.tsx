"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: "item-1",
    question: "How does Magic Room work?",
    answer:
      "Magic Room uses Google Gemini multimodal AI via OpenRouter to analyze your uploaded room photo and generate professional interior design variations. The AI preserves your room's original structure and layout while applying your chosen style. Each generation takes 30-60 seconds and produces 4-8 unique design variations you can compare side by side.",
  },
  {
    id: "item-2",
    question: "Is it free to use?",
    answer:
      "Yes — every new account receives 1 free credit on signup so you can try the AI before purchasing. Additional credits start at €9.99 for 30 credits (roughly €0.33 per design). Credits never expire, so you can use them at your own pace with no subscription required.",
  },
  {
    id: "item-3",
    question: "What happens to my photos?",
    answer:
      "Your photos are processed in-memory only and never stored on our servers. Images are sent directly to the AI as base64 data, processed, and deleted immediately after your results are returned. We never use your photos for AI training, and no image ever touches a storage bucket.",
  },
  {
    id: "item-4",
    question: "Can I use the designs for commercial projects?",
    answer:
      "Yes, you own full commercial rights to every design generated with your paid credits. Common commercial uses include real estate listing photos, interior design client presentations, Airbnb listing imagery, and renovation planning decks. Free-credit generations are for personal use only.",
  },
  {
    id: "item-5",
    question: "How long does it take?",
    answer:
      "Most generations complete in 30-60 seconds. Each run produces 4-8 design variations powered by Google Gemini AI, so you get a range of interpretations to choose from in under a minute — no waiting, no polling, results appear as soon as processing finishes.",
  },
  {
    id: "item-6",
    question: "What AI model does Magic Room use?",
    answer:
      "Magic Room uses Google Gemini multimodal AI (google/gemini-2.5-flash-image) accessed via the OpenRouter API. Gemini processes both your room image and your text prompt simultaneously, allowing it to understand spatial context, maintain the room's structure, and apply design styles accurately without distorting walls, windows, or furniture placement.",
  },
  {
    id: "item-7",
    question: "How is Magic Room different from RoomGPT?",
    answer:
      "Magic Room is pay-per-use (from €9.99 for 30 credits) with no monthly subscription, while RoomGPT charges a recurring fee. Crucially, Magic Room never stores your photos — images are processed in-memory and deleted immediately, making it the privacy-first alternative. All 14 design themes are available on every plan with no upsells.",
  },
  {
    id: "item-8",
    question: "Can I use Magic Room for real estate virtual staging?",
    answer:
      "Yes. Real estate agents and property managers use Magic Room to virtually stage empty or outdated rooms for listing photos. At under €1 per room, it costs a fraction of traditional virtual staging services that charge €75-150 per room. Results are ready in under a minute and you retain full commercial rights to use them in listings.",
  },
  {
    id: "item-9",
    question: "How many design styles does Magic Room offer?",
    answer:
      "Magic Room offers 14 design styles: Modern, Minimalist, Scandinavian, Industrial, Tropical, Bohemian, Vintage, Luxury, Japandi, Art Deco, Coastal, Farmhouse, Mediterranean, and Transitional. Each style can be applied across 14 room types — living room, bedroom, kitchen, bathroom, dining room, home office, and more — for 196 possible combinations.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Everything you need to know about Magic Room
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline hover:text-primary md:text-lg cursor-pointer">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600 dark:text-slate-400 md:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

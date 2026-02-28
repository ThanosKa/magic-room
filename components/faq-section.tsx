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
      "Magic Room uses Google Gemini multimodal AI to analyze your uploaded room photo and generate professional interior design variations while maintaining your room's original structure and layout.",
  },
  {
    id: "item-2",
    question: "Is it free to use?",
    answer:
      "Yes! You can try Magic Room for free. We provide complimentary credits so you can experience the magic of AI interior design before deciding to purchase more.",
  },
  {
    id: "item-3",
    question: "What happens to my photos?",
    answer:
      "Privacy is our top priority. Your original photos are processed securely and automatically deleted from our servers after 2 hours. We do not use your photos to train our models.",
  },
  {
    id: "item-4",
    question: "Can I use the designs for commercial projects?",
    answer:
      "Yes, you own the commercial rights to all designs generated with your paid credits. They are perfect for real estate listings, interior design portfolios, and renovation planning.",
  },
  {
    id: "item-5",
    question: "How long does it take?",
    answer:
      "Designs are generated in seconds! Typically it takes between 30 to 60 seconds to receive 4-8 different design variations.",
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

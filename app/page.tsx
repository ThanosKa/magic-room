import { Suspense, lazy } from "react";
import { Metadata } from "next";
import { homeMetadata, faqSchema } from "@/lib/seo";
import { PageLoader } from "@/components/page-loader";

const HomeContent = lazy(() => import("@/components/home-content"));

export const metadata: Metadata = homeMetadata();

const FAQ_ITEMS = [
  {
    question: "How does Magic Room work?",
    answer:
      "Magic Room uses advanced AI models (Google Gemini 2.5 Flash) to analyze your uploaded room photo and generate professional interior design variations while maintaining your room's original structure and layout.",
  },
  {
    question: "Is it free to use?",
    answer:
      "Yes! You can try Magic Room for free. We provide complimentary credits so you can experience the magic of AI interior design before deciding to purchase more.",
  },
  {
    question: "What happens to my photos?",
    answer:
      "Privacy is our top priority. Your original photos are processed securely and automatically deleted from our servers after 2 hours. We do not use your photos to train our models.",
  },
  {
    question: "Can I use the designs for commercial projects?",
    answer:
      "Yes, you own the commercial rights to all designs generated with your paid credits. They are perfect for real estate listings, interior design portfolios, and renovation planning.",
  },
  {
    question: "How long does it take?",
    answer:
      "Designs are generated in seconds! Typically it takes between 30 to 60 seconds to receive 4-8 different design variations.",
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema(FAQ_ITEMS)),
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <HomeContent />
      </Suspense>
    </>
  );
}

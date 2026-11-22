import { Metadata } from "next";
import {
  homeMetadata,
  faqSchema,
  softwareApplicationSchema,
  SITE_URL,
} from "@/lib/seo";
import { HomeContent } from "@/components/home/home-content";
import { HOME_FAQ } from "@/components/home/home-faq";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = homeMetadata();

const HOME_SOFTWARE = softwareApplicationSchema({
  description:
    "AI interior design tool that turns one room photo into a redesigned version in 30–60 seconds using Google Gemini and OpenAI image models. Photos are processed in-memory and never stored.",
  includeOffers: true,
});

export default function Home() {
  return (
    <>
      <JsonLd schemas={[HOME_SOFTWARE, faqSchema({ items: HOME_FAQ, pageUrl: SITE_URL })]} />
      <HomeContent />
    </>
  );
}

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

/**
 * The SoftwareApplication entity, declared here rather than sitewide.
 *
 * No `aggregateRating` is present because Magic Room has no collected reviews.
 * Inventing one would be a Google structured-data policy violation and a
 * manual-action risk. Without a rating this entity is not eligible for a
 * software rich result — that is the correct, honest state until real reviews
 * exist, and it still feeds entity understanding and AI-answer extraction.
 */
const HOME_SOFTWARE = softwareApplicationSchema({
  description:
    "AI interior design tool that turns one room photo into a redesigned version in 30–60 seconds using Google Gemini multimodal AI. Photos are processed in-memory and never stored.",
  includeOffers: true,
});

export default function Home() {
  return (
    <>
      <JsonLd schemas={[HOME_SOFTWARE, faqSchema(HOME_FAQ, SITE_URL)]} />
      <HomeContent />
    </>
  );
}

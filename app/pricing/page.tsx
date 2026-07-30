import { Metadata } from "next";
import { pricingMetadata, aggregateOfferSchema } from "@/lib/seo";
import PricingContent from "@/components/pricing-content";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = pricingMetadata();

const PRICING_SCHEMA = aggregateOfferSchema({
  name: "Magic Room AI Interior Design Credits",
  description:
    "Credit packages for AI-powered interior design generation. Upload a photo and transform any room instantly.",
  lowPrice: 9.99,
  highPrice: 29.99,
  offerCount: 3,
});

export default function PricingPage() {
  return (
    <>
      <JsonLd schemas={[PRICING_SCHEMA]} />
      <PricingContent />
    </>
  );
}

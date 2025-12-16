import { Suspense, lazy } from "react";
import { Metadata } from "next";
import { pricingMetadata, productSchema } from "@/lib/seo";
import { PageLoader } from "@/components/page-loader";

const PricingContent = lazy(() => import("@/components/pricing-content"));

export const metadata: Metadata = pricingMetadata();

const CREDIT_PACKAGES_SCHEMA = [
  {
    name: "Magic Room Starter",
    description: "30 AI interior design generations. Credits never expire.",
    price: 9.99,
  },
  {
    name: "Magic Room Growth",
    description: "150 AI interior design generations. Priority support included.",
    price: 19.99,
  },
  {
    name: "Magic Room Premium",
    description: "300 AI interior design generations. 24/7 priority support.",
    price: 29.99,
  },
];

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            CREDIT_PACKAGES_SCHEMA.map((pkg) => productSchema(pkg))
          ),
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <PricingContent />
      </Suspense>
    </>
  );
}

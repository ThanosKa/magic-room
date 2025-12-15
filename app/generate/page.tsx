import { Suspense, lazy } from "react";
import { Metadata } from "next";
import { generateMetadata as getGenerateMetadata } from "@/lib/seo";
import { PageLoader } from "@/components/page-loader";

const GenerateContent = lazy(() => import("@/components/generate-content"));

export const metadata: Metadata = getGenerateMetadata();

export default function GeneratePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <GenerateContent />
    </Suspense>
  );
}

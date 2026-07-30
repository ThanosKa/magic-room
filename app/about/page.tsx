import React from "react";
import { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { AboutContent } from "@/components/seo/about-content";
import { JsonLd } from "@/components/seo/json-ld";
import { aboutMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graphSchema, personSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/config";

export const metadata: Metadata = aboutMetadata();

const jsonLd = graphSchema([
  // url is the on-site /about page, not LinkedIn. personSchema derives its @id
  // from this url, and every BlogPosting author now references
  // `${SITE_URL}/about#person` — the two must resolve to the same node or the
  // author entity fragments across the site. LinkedIn stays in sameAs below.
  personSchema({
    name: "Thanos Kazakis",
    url: `${SITE_URL}/about`,
    jobTitle: "Software Developer",
    description:
      "Thanos Kazakis is the founder of Magic Room, an AI-powered interior design tool built with Google Gemini.",
    sameAs: [
      "https://x.com/KazakisThanos",
      "https://github.com/ThanosKa",
      "https://www.linkedin.com/in/thanos-kazakis-922977205/",
    ],
  }),
  breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "About", url: `${SITE_URL}/about` },
  ]),
]);

export default function AboutPage() {
  return (
    <PageTransition>
      <JsonLd schemas={[jsonLd]} />
      <AboutContent />
    </PageTransition>
  );
}

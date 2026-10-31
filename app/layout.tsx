import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ToastProvider } from "@/components/toast-provider";
import { UserDataProvider } from "@/components/user-data-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/seo/json-ld";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  TWITTER_HANDLE,
  OG_IMAGE,
} from "@/lib/seo/config";
import {
  organizationSchema,
  webSiteSchema,
  graphSchema,
} from "@/lib/seo/schema";

/**
 * Sitewide entity graph: Organization + WebSite only.
 *
 * SoftwareApplication (and its €9.99–€29.99 AggregateOffer) used to live here,
 * which meant every one of the ~230 pages declared itself a priced product —
 * including `/design/art-deco-bedroom` and every blog post. Search Console
 * shows the result: "Product snippets, 82 impressions, 0 clicks, position
 * 13.09". A price range rendered against an informational result is a click
 * deterrent, not an enhancement.
 *
 * The SoftwareApplication entity is now declared only on the pages where
 * purchase is the actual intent: `/`, `/virtual-staging`, `/alternatives`,
 * `/alternatives/*` and `/vs/*`. (`/pricing` carries an AggregateOffer instead —
 * see app/pricing/page.tsx.) Those pages reference `#organization` from this
 * graph, so the @id resolves on merge.
 */
const globalSchema = graphSchema([
  organizationSchema(),
  webSiteSchema({ description: SITE_DESCRIPTION }),
]);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Display face for headlines and italic emphasis: Tailwind `font-serif`. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

/*
 * Clerk sign-in / sign-up windows and the UserButton, in the design tokens.
 * Variables drive Clerk's own styles; the few element overrides are style
 * objects (not Tailwind classes) so they win over Clerk's injected CSS.
 */
const clerkAppearance = {
  variables: {
    colorPrimary: "var(--ink)",
    colorPrimaryForeground: "var(--cream)",
    colorForeground: "var(--ink)",
    colorMutedForeground: "var(--ink-2)",
    colorMuted: "var(--paper-2)",
    colorBackground: "var(--paper)",
    colorInput: "var(--paper)",
    colorInputForeground: "var(--ink)",
    colorNeutral: "var(--ink)",
    colorBorder: "var(--ink)",
    colorRing: "var(--accent)",
    colorDanger: "var(--destructive)",
    colorModalBackdrop: "rgb(20 17 13 / 0.5)",
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
    fontFamilyButtons: "var(--font-geist-sans), system-ui, sans-serif",
    borderRadius: "14px",
  },
  elements: {
    headerTitle: {
      fontFamily: "var(--font-instrument), 'Times New Roman', serif",
      fontWeight: 400,
      fontSize: "28px",
      lineHeight: 1.05,
      letterSpacing: "-0.02em",
    },
    formButtonPrimary: {
      borderRadius: "999px",
      height: "44px",
      fontSize: "15px",
      fontWeight: 500,
      textTransform: "none" as const,
    },
    socialButtonsIconButton: { borderRadius: "999px" },
    footerActionLink: {
      color: "var(--ink)",
      fontWeight: 500,
      textDecoration: "underline",
      textUnderlineOffset: "4px",
    },
  },
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "iconButton" as const,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f0e9",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - AI Interior Design`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - AI Interior Design`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE.url,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: `${SITE_NAME} - AI Interior Design`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image.png"], // Static file
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={clerkAppearance}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} flex flex-col antialiased`}
        >
          <JsonLd schemas={[globalSchema]} />
            <UserDataProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <ToastProvider />
              <Analytics />
            </UserDataProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
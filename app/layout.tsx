import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProviderComponent } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-provider";
import { UserDataProvider } from "@/components/user-data-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  TWITTER_HANDLE,
} from "@/lib/seo/config";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7C3AED",
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
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - AI Interior Design`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: `${SITE_NAME} - AI Interior Design`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          rootBox: "flex items-center justify-center min-h-screen",
          card: "bg-white dark:bg-slate-950 border border-purple-200 dark:border-purple-900 shadow-lg rounded-lg",
          headerTitle: "text-2xl font-bold text-slate-900 dark:text-white",
          headerSubtitle: "text-slate-600 dark:text-slate-400",
          socialButtonsBlockButton:
            "border border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-slate-800",
          formButtonPrimary:
            "bg-purple-600 hover:bg-purple-700 text-white rounded-md",
          footerActionLink:
            "text-purple-600 dark:text-purple-400 hover:text-purple-700",
          input:
            "border border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400",
        },
        layout: {
          socialButtonsPlacement: "top",
          socialButtonsVariant: "iconButton",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} flex flex-col antialiased`}
        >
          <ThemeProviderComponent>
            <UserDataProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <ToastProvider />
              <Analytics />
            </UserDataProvider>
          </ThemeProviderComponent>
        </body>
      </html>
    </ClerkProvider>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProviderComponent } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

// Force dynamic rendering during development
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Magic Room - AI Interior Design",
  description: "Privacy-first AI room redesign assistant powered by SDXL",
  icons: {
    icon: "/favicon.ico",
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
          footerActionLink: "text-purple-600 dark:text-purple-400 hover:text-purple-700",
          input:
            "border border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400",
        },
        layout: "cards",
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} flex flex-col antialiased`}
        >
          <ThemeProviderComponent>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ToastProvider />
          </ThemeProviderComponent>
        </body>
      </html>
    </ClerkProvider>
  );
}

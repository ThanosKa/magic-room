"use client";

import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ErrorScreen } from "@/components/error-screen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

/*
 * Shown only when the root layout itself crashes, so it has to bring its own
 * <html> and <body>. Same screen as the other error pages (noindex included).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${instrumentSerif.variable} flex flex-col antialiased`}
      >
        <ErrorScreen
          className="min-h-screen"
          title="Oops! Something went wrong"
          message="An unexpected error occurred while loading the page. Please try again."
          onRetry={reset}
          digest={error.digest}
        />
      </body>
    </html>
  );
}

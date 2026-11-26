"use client";

import { useEffect } from "react";
import { captureException } from "@sentry/browser";
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

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error);
  }, [error]);

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

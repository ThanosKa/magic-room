"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
        <h1 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
          Oops! Something went wrong
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          {error.message ||
            "An unexpected error occurred while processing your request. Our team has been notified."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="bg-purple-600 hover:bg-purple-700">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Go Home
            </Button>
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

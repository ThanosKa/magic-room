"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function GenerateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex min-h-[400px] items-center justify-center px-4 py-12">
      <div className="max-w-md text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Something went wrong
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {error.message || "An error occurred while processing your request"}
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            onClick={reset}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            Try Again
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


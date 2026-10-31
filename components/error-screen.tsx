"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorScreenProps {
  title: string;
  message: string;
  /** Re-renders the failed segment (the `reset` from an error boundary). */
  onRetry: () => void;
  /** Shown small under the buttons when present. */
  digest?: string;
  className?: string;
}

/*
 * Shared body for the error boundaries (app/error.tsx, app/generate/error.tsx):
 * serif headline, the message, "Try Again" (ink pill) and "Go Home".
 * Error screens are never indexed; React hoists the <meta> into <head>.
 */
export function ErrorScreen({
  title,
  message,
  onRetry,
  digest,
  className,
}: ErrorScreenProps) {
  return (
    <div
      className={cn(
        "container-page flex items-center justify-center py-16 md:py-24",
        className
      )}
    >
      <meta name="robots" content="noindex" />
      <div className="flex max-w-xl flex-col items-center text-center">
        <span
          aria-hidden
          className="flex size-14 items-center justify-center rounded-full border border-line bg-paper-2 font-serif text-[28px] italic leading-none text-ink"
        >
          !
        </span>
        <h1 className="mt-8 font-serif text-[clamp(40px,5.4vw,68px)] leading-[1] tracking-[-0.02em] text-balance text-ink">
          {title}
        </h1>
        <p className="mt-5 max-w-md text-[17px] leading-[1.55] text-pretty break-words text-ink-2">
          {message}
        </p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
          <Button size="lg" onClick={onRetry}>
            <RotateCcw className="size-4" aria-hidden />
            Try Again
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
        {digest && (
          <p className="mt-8 text-xs tabular-nums text-ink-3">
            Error ID: {digest}
          </p>
        )}
      </div>
    </div>
  );
}

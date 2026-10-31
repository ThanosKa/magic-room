"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-ink/8 motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  );
}

export function CreditsSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-9 w-20 rounded-full" />
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-ink/15 border-t-ink",
          sizeClasses[size]
        )}
      />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-xl border border-line bg-card p-6">
      <Skeleton className="mb-4 h-6 w-3/4" />
      <Skeleton className="mb-3 h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function LoadingGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

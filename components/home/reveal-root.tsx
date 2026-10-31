"use client";

import { useRef, type ReactNode } from "react";
import { useReveal } from "@/hooks/use-reveal";

/**
 * Client wrapper that turns on reveal-on-scroll for every `[data-reveal]`
 * inside it, so the sections themselves can stay server components.
 */
export function RevealRoot({ children, className }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useReveal(root);
  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}

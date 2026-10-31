"use client";

import { useEffect, type RefObject } from "react";

/**
 * Reveal-on-scroll (styles in app/motion.css).
 * Adds `.reveal-ready` to `root`, then `.is-in` to every `[data-reveal]`
 * inside it once it scrolls into view. Without JS, nothing is hidden.
 * Reduced motion is handled in CSS (elements simply show).
 */
export function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    el.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    el.querySelectorAll("[data-reveal]").forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [root]);
}

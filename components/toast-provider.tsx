"use client";

import React from "react";
import { Toaster } from "sonner";

/*
 * Light theme only, coloured with the design tokens. Sonner's own CSS reads
 * these variables from the toaster element, so the inline style wins over it.
 * Errors get a light destructive tint; everything else is paper and ink.
 */
const toastTokens = {
  fontFamily: "var(--font-sans)",
  "--border-radius": "16px",
  "--normal-bg": "var(--paper)",
  "--normal-border": "var(--line)",
  "--normal-text": "var(--ink)",
  "--success-bg": "var(--paper)",
  "--success-border": "var(--line)",
  "--success-text": "var(--ink)",
  "--info-bg": "var(--paper)",
  "--info-border": "var(--line)",
  "--info-text": "var(--ink)",
  "--warning-bg": "var(--paper-2)",
  "--warning-border": "var(--line)",
  "--warning-text": "var(--ink)",
  "--error-bg": "color-mix(in oklab, var(--destructive) 7%, var(--paper))",
  "--error-border": "color-mix(in oklab, var(--destructive) 25%, transparent)",
  "--error-text": "var(--destructive)",
} as React.CSSProperties;

export function ToastProvider() {
  return (
    <Toaster
      theme="light"
      position="bottom-right"
      richColors
      closeButton
      expand={false}
      visibleToasts={3}
      style={toastTokens}
    />
  );
}

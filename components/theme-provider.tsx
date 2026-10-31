"use client";

import { ThemeProvider } from "next-themes";
import React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * The site has one light theme. This stays pinned to light so the `.dark`
 * class is never set; there are no dark styles behind it (no `dark:` classes).
 */
export function ThemeProviderComponent({ children }: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}

"use client";

import { ThemeProvider } from "next-themes";
import React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProviderComponent({ children }: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}


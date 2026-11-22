"use client";

import type { ReactNode } from "react";

export function SiteMain({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1">
      <PageSlot>{children}</PageSlot>
    </main>
  );
}

function PageSlot({ children }: { children: ReactNode }) {
  return children;
}

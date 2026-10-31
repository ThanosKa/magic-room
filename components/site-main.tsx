"use client";

import type { ReactNode } from "react";

/**
 * The layout's <main>. It keeps one component (PageSlot) between <main> and
 * the page; don't inline it.
 *
 * Why (ticket 22): while the browser hydrates, the page can still be waiting
 * on a client chunk (Next's layout router needs app/error.tsx), so React gets
 * it as a lazy element. If that element is a direct child of <main> and the
 * chunk lands in the short gap where React yields, React 19 replays <main>
 * with its hydration cursor already inside it and fails with "expected
 * <main>, found <script>" (#418), the page's JSON-LD being <main>'s first
 * child. With a component in between, React replays that component instead,
 * which claims no HTML, and hydration carries on. This file must stay a client
 * component: a server component would be flattened away before it reaches the
 * browser, and the lazy page would sit in <main> again.
 */
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

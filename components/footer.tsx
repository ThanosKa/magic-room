"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { BrandMark } from "@/components/brand-mark";
import { SiteStatus } from "@/components/site-status";

interface FooterLink {
  href: string;
  label: string;
  newTab?: true;
}

const PRODUCT: FooterLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
];

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of service" },
      { href: "/privacy", label: "Privacy policy" },
    ],
  },
  {
    title: "Design Ideas",
    links: [
      { href: "/design", label: "All design styles" },
      { href: "/design/modern-living-room", label: "Modern living room" },
      { href: "/design/scandinavian-bedroom", label: "Scandinavian bedroom" },
      { href: "/design/art-deco-bedroom", label: "Art Deco bedroom" },
      { href: "/gallery", label: "AI room design gallery" },
      { href: "/virtual-staging", label: "AI virtual staging" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/alternatives", label: "All alternatives" },
      { href: "/alternatives/roomgpt", label: "RoomGPT alternative" },
      { href: "/alternatives/decorai", label: "DecorAI alternative" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "https://github.com/ThanosKa/magic-room", label: "GitHub" },
      { href: "https://x.com/KazakisThanos", label: "Twitter / X" },
      { href: "mailto:kazakis.th@gmail.com", label: "Support" },
      { href: "https://thanoska.betteruptime.com", label: "Status", newTab: true },
    ],
  },
];

const linkClass =
  "inline-flex min-h-8 cursor-pointer items-center text-left text-[14.5px] text-ink-2 transition-colors duration-200 hover:text-ink motion-reduce:transition-none";

function ColumnTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-3">
      {children}
    </h3>
  );
}

function LinkList({ links, children }: { links: FooterLink[]; children?: ReactNode }) {
  return (
    <ul className="grid gap-1">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className={linkClass}
            {...(l.newTab && { target: "_blank", rel: "noopener noreferrer" })}
          >
            {l.label}
          </Link>
        </li>
      ))}
      {children}
    </ul>
  );
}

export function Footer() {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useUser();
  const router = useRouter();

  return (
    <footer className="overflow-hidden px-5 pb-7 pt-[88px] sm:px-6 sm:pt-[120px] lg:px-12">
      <div className="mx-auto grid max-w-[1240px] gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] xl:gap-16">
        <div>
          <BrandMark />
          <p className="mt-4 max-w-[26ch] text-[15px] leading-[1.55] text-ink-2">
            Transform your space with AI-powered interior design.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1.35fr_1.25fr_0.9fr] lg:gap-x-8">
          <div>
            <ColumnTitle>Product</ColumnTitle>
            <LinkList links={PRODUCT}>
              <li>
                <button
                  type="button"
                  onClick={() => (isSignedIn ? router.push("/generate") : openSignIn())}
                  className={linkClass}
                >
                  Generate
                </button>
              </li>
            </LinkList>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <ColumnTitle>{col.title}</ColumnTitle>
              <LinkList links={col.links} />
            </div>
          ))}
        </div>
      </div>

      <p
        aria-hidden="true"
        className="mx-auto mt-16 max-w-[1240px] select-none whitespace-nowrap pb-[0.14em] font-serif text-[clamp(72px,21.5vw,320px)] leading-[0.8] tracking-[-0.045em] text-ink sm:mt-24"
      >
        <span className="before:content-['Magic_']" />
        <em className="text-ink-3 before:content-['Room']" />
      </p>

      <div className="mx-auto mt-6 flex max-w-[1240px] flex-wrap justify-between gap-x-6 gap-y-2 border-t border-line pt-5 text-[13px] text-ink-3">
        <p>&copy; 2026 Thaka — All rights reserved.</p>
        <SiteStatus />
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { cn, formatCredits } from "@/lib/utils";

const NAV = [
  { href: "/generate", label: "Generate" },
  { href: "/design", label: "Design Ideas" },
  { href: "/blog", label: "Blog" },
  { href: "/alternatives", label: "Alternatives" },
  { href: "/pricing", label: "Pricing" },
];

/** The menu is for phones and tablets; from this width the full bar shows. */
const DESKTOP_QUERY = "(min-width: 1024px)";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Credit balance pill (purple accent), links to pricing. */
function Credits({ onClick, className }: { onClick?: () => void; className?: string }) {
  const { credits, isLoading, user, error } = useUserStore();
  const pending = isLoading || (!user && !error);

  return (
    <Link
      href="/pricing"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-accent/10 px-3.5 text-[13px] font-medium tabular-nums text-accent transition-colors duration-200 hover:bg-accent/15 motion-reduce:transition-none",
        className
      )}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      {pending ? (
        <>
          <span aria-hidden="true">…</span>
          <span className="sr-only">Loading credits</span>
        </>
      ) : (
        formatCredits(credits)
      )}
    </Link>
  );
}

export function Header() {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();

  // The menu belongs to the page it was opened on: navigating anywhere closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn !== null && openOn === pathname;
  const close = () => setOpenOn(null);

  const [scrolled, setScrolled] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the menu is open: lock page scroll, close on Esc (focus back on the
  // menu button) and when the viewport grows to the desktop bar.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenOn(null);
      burgerRef.current?.focus();
    };
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onMq = () => mq.matches && setOpenOn(null);

    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 px-3 pb-1.5 pt-2 sm:px-6 sm:pb-2 sm:pt-3 lg:px-12">
      <div
        data-scrolled={scrolled || open}
        className="relative mx-auto flex h-[52px] max-w-[1344px] items-center gap-6 rounded-full border border-transparent bg-paper/72 pl-3 pr-1.5 backdrop-blur-[16px] backdrop-saturate-[1.2] transition-[background-color,border-color,box-shadow] duration-250 ease-out motion-reduce:transition-none data-[scrolled=true]:border-line data-[scrolled=true]:bg-paper/88 data-[scrolled=true]:shadow-[0_8px_30px_rgb(23_20_15/0.08)] sm:h-14 sm:pl-4 sm:pr-2"
      >
        <BrandMark priority />

        <nav aria-label="Main" className="mx-auto hidden gap-0.5 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isCurrent(pathname, n.href) ? "page" : undefined}
              className="inline-flex h-10 items-center rounded-full px-3.5 text-sm font-medium text-ink-2 transition-colors duration-200 hover:bg-ink/5 hover:text-ink aria-[current=page]:text-ink motion-reduce:transition-none"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div
          className={cn(
            "hidden items-center gap-1.5 transition-opacity duration-200 motion-reduce:transition-none lg:flex",
            // Clerk decides the signed-in state on the client; fade in once it
            // has, so a signed-in visitor never sees a flash of "Sign In".
            !isLoaded && "opacity-0"
          )}
        >
          {isSignedIn ? (
            <>
              <Credits className="mr-1.5" />
              <span className="inline-flex size-11 items-center justify-center">
                <UserButton />
              </span>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="h-10">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className="h-10 px-5 shadow-none hover:bg-ink/90 hover:shadow-none"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 lg:hidden">
          {isSignedIn && <Credits onClick={close} />}
          <button
            ref={burgerRef}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpenOn(open ? null : pathname)}
            className="relative size-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 hover:bg-ink/5 motion-reduce:transition-none"
          >
            <span className="sr-only">Toggle menu</span>
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-[13px] top-[21px] h-[1.5px] w-[18px] rounded-[2px] bg-ink transition-transform duration-250 ease-out motion-reduce:transition-none",
                open ? "rotate-45" : "-translate-y-[3.5px]"
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-[13px] top-[21px] h-[1.5px] w-[18px] rounded-[2px] bg-ink transition-transform duration-250 ease-out motion-reduce:transition-none",
                open ? "-rotate-45" : "translate-y-[3.5px]"
              )}
            />
          </button>
        </div>
      </div>

      {open && (
        <div
          id="site-menu"
          className="fixed inset-0 -z-10 flex flex-col justify-between gap-8 overflow-y-auto overscroll-contain bg-paper px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-[96px] sm:px-6 lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {NAV.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={close}
                aria-current={isCurrent(pathname, n.href) ? "page" : undefined}
                style={{ animationDelay: `${60 + i * 45}ms` }}
                className="block animate-menu-in border-b border-line py-2.5 font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="grid animate-menu-in gap-2.5" style={{ animationDelay: "300ms" }}>
            {isSignedIn ? (
              <div className="flex items-center justify-between">
                <Credits onClick={close} />
                <span className="inline-flex size-11 items-center justify-center">
                  <UserButton />
                </span>
              </div>
            ) : (
              <>
                <SignUpButton mode="modal">
                  <Button size="lg" className="w-full text-base" onClick={close}>
                    Sign Up
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="secondary" size="lg" className="w-full text-base" onClick={close}>
                    Sign In
                  </Button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

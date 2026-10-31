"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { useHydratedUser } from "@/hooks/use-hydrated-user";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
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

/** Scroll positions where the bar narrows (going down) and widens again (going up). */
const COMPACT_AFTER = 40;
const FULL_BEFORE = 20;
/** How far each end of the bar moves in, as a share of its width (capped by free space). */
const SHRINK = 0.09;

interface BarFit {
  /** px each end of the bar moves in. */
  inset: number;
  /** scaleX for the background layer: (width - 2 * inset) / width. */
  scale: number;
  /** Half the bar's height: its corner radius. */
  radius: number;
}

/**
 * Measures how much the floating bar can narrow without its items touching:
 * the free space between them, at most SHRINK of the width. Re-measured when
 * the bar or any item changes size (viewport, Clerk loading, credits pill).
 */
function useBarFit(bar: RefObject<HTMLDivElement | null>) {
  const [fit, setFit] = useState<BarFit | null>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(":scope > [data-bar-item]"));

    const measure = () => {
      const cs = getComputedStyle(el);
      const width = el.clientWidth;
      const shown = items.filter((i) => i.offsetWidth > 0);
      const used =
        shown.reduce((sum, i) => sum + i.offsetWidth, 0) +
        parseFloat(cs.columnGap || "0") * Math.max(0, shown.length - 1) +
        parseFloat(cs.paddingLeft) +
        parseFloat(cs.paddingRight);
      const inset = Math.max(0, Math.floor(Math.min(width * SHRINK, (width - used) / 2)));
      const next = { inset, scale: width ? (width - 2 * inset) / width : 1, radius: el.clientHeight / 2 };
      setFit((prev) =>
        prev && prev.inset === next.inset && prev.radius === next.radius && Math.abs(prev.scale - next.scale) < 1e-4
          ? prev
          : next
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    items.forEach((i) => ro.observe(i));
    return () => ro.disconnect();
  }, [bar]);

  return fit;
}

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
  const { isSignedIn, isLoaded } = useHydratedUser();
  const pathname = usePathname();

  // The menu belongs to the page it was opened on: navigating anywhere closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn !== null && openOn === pathname;
  const close = () => setOpenOn(null);

  const [scrolled, setScrolled] = useState(false);
  const [past, setPast] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const fit = useBarFit(barRef);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Two thresholds, so a page resting near one of them can't flicker.
      setPast((was) => (was ? y > FULL_BEFORE : y > COMPACT_AFTER));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Transitions switch on one frame after the first measure, so a page that
  // loads already scrolled shows the narrow bar instead of animating to it.
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (!fit || live) return;
    const id = requestAnimationFrame(() => setLive(true));
    return () => cancelAnimationFrame(id);
  }, [fit, live]);

  /*
   * Shrinking bar (owner request): past COMPACT_AFTER the floating bar gets
   * narrower and widens again near the top. Nothing is resized: the
   * background layer scales on X (its corner radius is widened by 1/scale so
   * the round ends stay round) and the items at each end slide in. Reduced
   * motion: the bar keeps its width.
   */
  const compact = past && !reduced && fit !== null && fit.inset > 0;
  const shift = (dir: 1 | -1): CSSProperties | undefined =>
    compact ? { transform: `translateX(${dir * (fit?.inset ?? 0)}px)` } : undefined;
  const bgStyle: CSSProperties | undefined = fit
    ? {
        transform: compact ? `scaleX(${fit.scale})` : undefined,
        borderRadius: compact ? `${fit.radius / fit.scale}px / ${fit.radius}px` : `${fit.radius}px`,
      }
    : undefined;
  const slide = live && "transition-transform duration-400 ease-out motion-reduce:transition-none";

  // While the menu is open: lock page scroll, close on Esc (focus back on the
  // menu button) and when the viewport grows to the desktop bar. The lock goes
  // on <html>: on <body> it would make body a scroll container (html has
  // overflow-x: clip), and the sticky header would leave the screen.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

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
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 px-3 pb-1.5 pt-2 sm:px-6 sm:pb-2 sm:pt-3 lg:px-12">
      <div
        ref={barRef}
        data-scrolled={scrolled || open}
        data-compact={compact}
        className="group/bar relative isolate mx-auto flex h-[52px] max-w-[1344px] items-center gap-6 pl-3 pr-1.5 sm:h-14 sm:pl-4 sm:pr-2"
      >
        {/* The bar's surface, on its own layer so it can scale without touching layout. */}
        <span
          aria-hidden="true"
          style={bgStyle}
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-full border border-transparent bg-paper/72 backdrop-blur-[16px] backdrop-saturate-[1.2] group-data-[scrolled=true]/bar:border-line group-data-[scrolled=true]/bar:bg-paper/88 group-data-[scrolled=true]/bar:shadow-[0_8px_30px_rgb(23_20_15/0.08)]",
            live &&
              "transition-[transform,border-radius,background-color,border-color,box-shadow] duration-400 ease-out motion-reduce:transition-none"
          )}
        />

        <div data-bar-item className={cn("flex shrink-0", slide)} style={shift(1)}>
          <BrandMark priority />
        </div>

        <nav data-bar-item aria-label="Main" className="mx-auto hidden gap-0.5 lg:flex">
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
          data-bar-item
          style={shift(-1)}
          className={cn(
            "hidden items-center gap-1.5 lg:flex",
            live && "transition-[opacity,transform] duration-[200ms,400ms] ease-out motion-reduce:transition-none",
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
                  className="h-10 px-5 drop-shadow-none hover:bg-ink/90 hover:drop-shadow-none"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>

        <div data-bar-item style={shift(-1)} className={cn("ml-auto flex items-center gap-1 lg:hidden", slide)}>
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
                style={{ animationDelay: `${60 + i * 30}ms` }}
                className="block animate-lift-in border-b border-line py-2.5 font-serif text-[40px] leading-[1.1] tracking-[-0.02em] text-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="grid animate-lift-in gap-2.5" style={{ animationDelay: "210ms" }}>
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

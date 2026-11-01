"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore, type CSSProperties, type FocusEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const IMG = "/images/designs";
/** One style per cycle. The timer bar's animation end advances the dial. */
const CYCLE_MS = 3600;

const DIAL = [
  { slug: "japandi", name: "Japandi" },
  { slug: "art-deco", name: "Art Deco" },
  { slug: "coastal", name: "Coastal" },
  { slug: "luxury", name: "Luxury" },
  { slug: "scandinavian", name: "Scandinavian" },
  { slug: "mediterranean", name: "Mediterranean" },
];

const STRIP = ["1 free design, no card", "30–60 s per run", "from €0.25 a design"];

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** True while the tab is in the background. False on the server. */
function useDocumentHidden() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.hidden,
    () => false,
  );
}

/**
 * The hero and its "style dial": one living room restyles itself every 3.6 s
 * with a left-edge wipe while the last line of the H1 swaps to the style name.
 * The dial pauses while the pointer is over it, while anything in it has focus
 * and while the tab is hidden. With reduced motion there is no autoplay and a
 * chosen style fades in instead of wiping (see app/motion.css).
 */
export function HomeHero() {
  const reduced = usePrefersReducedMotion();
  const hidden = useDocumentHidden();
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused || hidden;

  const go = (next: number) => {
    if (next === active) return;
    setPrev(active);
    setActive(next);
  };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  const current = DIAL[active];

  return (
    <section
      aria-labelledby="hero-title"
      className="flex items-center px-5 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6 lg:min-h-[calc(100dvh-76px)] lg:px-12 lg:pt-8"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-x-[clamp(40px,5vw,88px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h1
            id="hero-title"
            className="font-serif text-[clamp(44px,12.4vw,60px)] font-normal leading-[0.95] tracking-[-0.025em] text-ink sm:text-[clamp(48px,5.6vw,96px)] lg:[@media(max-height:760px)]:text-[clamp(44px,5.2vw,84px)]"
          >
            <span
              className="mb-[22px] flex w-fit animate-rise items-center gap-2.5 rounded-full bg-ink/5 py-[7px] pl-3 pr-3.5 font-sans text-[13px] font-medium leading-normal tracking-[-0.005em] text-ink-2 sm:mb-7"
              style={delay(60)}
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
              AI interior design
            </span>{" "}
            <span className="block animate-rise lg:whitespace-nowrap" style={delay(160)}>
              Any room,
            </span>{" "}
            <span className="block animate-rise lg:whitespace-nowrap" style={delay(260)}>
              restyled as
            </span>{" "}
            <span className="block animate-rise lg:whitespace-nowrap" style={delay(360)}>
              <span className="relative -mb-[0.08em] inline-block overflow-hidden pb-[0.08em] pr-[0.06em] align-bottom">
                <em key={current.slug} className="inline-block animate-word-in italic">
                  {`${current.name}.`}
                </em>
              </span>
            </span>
          </h1>

          <p
            className="mt-5 max-w-[30rem] animate-rise text-base leading-[1.55] tracking-[-0.01em] text-ink-2 sm:mt-7 sm:text-[17px] lg:[@media(max-height:760px)]:mt-5"
            style={delay(480)}
          >
            Upload one photo of your room and get a redesign in under a minute. Fourteen styles,
            fourteen room types, no subscription, and your photo is never stored.
          </p>

          <div
            className="mt-7 flex animate-rise flex-wrap items-center gap-x-6 gap-y-1 sm:mt-9 sm:gap-x-7 lg:[@media(max-height:760px)]:mt-7"
            style={delay(580)}
          >
            <Button
              asChild
              size="lg"
              className="group gap-4 pl-6 pr-[7px] max-sm:flex-[1_1_100%] max-sm:justify-between"
            >
              {/* No prefetch: signed out, /generate redirects to Clerk (another origin, CORS error). */}
              <Link href="/generate" prefetch={false}>
                Redesign my room
                <span className="grid size-[38px] place-items-center rounded-full bg-cream text-ink">
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-[3px] motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </Button>
            <Link
              href="/pricing"
              className="inline-flex min-h-11 items-center text-[15px] font-medium tracking-[-0.01em] text-ink underline decoration-ink/35 decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-ink motion-reduce:transition-none"
            >
              See pricing
            </Link>
          </div>

          {/* Each item's divider sits on its left; the -ml + overflow clip hides it at every line start. */}
          <div
            className="mt-6 animate-rise overflow-hidden sm:mt-10 lg:[@media(max-height:760px)]:mt-7"
            style={delay(680)}
          >
            <ul className="-ml-[29px] flex flex-wrap items-center gap-y-2.5 text-[13px] text-ink-3">
              {STRIP.map((item) => (
                <li
                  key={item}
                  className="flex items-center before:mx-3.5 before:h-3 before:w-px before:bg-line before:content-['']"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-7 w-full animate-frame-in sm:mt-12 lg:mt-0 lg:max-w-[min(100%,calc(100dvh-200px))] lg:justify-self-end"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={onBlur}
        >
          <div className="relative isolate aspect-square overflow-hidden rounded-[22px] bg-paper-2 sm:rounded-3xl">
            {DIAL.map((d, i) => {
              const isActive = i === active;
              return (
                <div
                  key={d.slug}
                  aria-hidden={!isActive}
                  className={cn(
                    "absolute inset-0",
                    isActive ? "z-[2] animate-wipe" : i === prev ? "z-[1]" : "z-0 opacity-0",
                  )}
                >
                  <Image
                    src={`${IMG}/${d.slug}-living-room.jpg`}
                    alt={`The same living room redesigned in ${d.name} style`}
                    fill
                    sizes="(min-width: 1024px) 56vw, 100vw"
                    priority={i < 2}
                    className={cn("object-cover", isActive && "animate-settle")}
                  />
                </div>
              );
            })}

            <div className="absolute left-3 top-3 z-[5] inline-flex items-center gap-2.5 rounded-full bg-paper/80 py-[7px] pl-3 pr-3.5 text-[13px] font-medium text-ink backdrop-blur-md sm:left-4 sm:top-4">
              <span className="text-xs tabular-nums text-ink-3">
                {String(active + 1).padStart(2, "0")} / {String(DIAL.length).padStart(2, "0")}
              </span>
              <span>{current.name}</span>
            </div>

            <figure className="absolute bottom-3 left-3 z-[5] m-0 flex items-center gap-2.5 rounded-2xl bg-paper py-1.5 pl-1.5 pr-3.5 shadow-float sm:bottom-4 sm:left-4 sm:gap-3.5 sm:rounded-[20px] sm:py-2 sm:pl-2 sm:pr-5">
              <Image
                src={`${IMG}/before-living-room.jpg`}
                alt="The original living room photo"
                width={84}
                height={84}
                className="size-12 rounded-[11px] object-cover sm:size-16 sm:rounded-[13px]"
              />
              <figcaption className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-ink">Your photo</span>
                <span className="text-xs text-ink-3">Living room, as is</span>
              </figcaption>
            </figure>
          </div>

          <div
            role="group"
            aria-label="Choose a style"
            className="mt-3.5 flex gap-x-0.5 gap-y-1 [scrollbar-width:none] max-sm:-mx-5 max-sm:overflow-x-auto max-sm:px-5 sm:flex-wrap [&::-webkit-scrollbar]:hidden"
          >
            {DIAL.map((d, i) => {
              const isActive = i === active;
              return (
                <button
                  key={d.slug}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => go(i)}
                  className={cn(
                    "relative min-h-11 flex-none cursor-pointer rounded-full px-3 text-[13px] font-medium tracking-[-0.005em] transition-[color,background-color,transform] duration-200 ease-out active:scale-[0.96] motion-reduce:transition-none sm:min-h-10",
                    isActive ? "bg-ink/[0.06] text-ink" : "text-ink-3 hover:text-ink",
                  )}
                >
                  {d.name}
                  {isActive && !reduced && (
                    <span
                      key={`timer-${active}`}
                      aria-hidden="true"
                      onAnimationEnd={() => go((active + 1) % DIAL.length)}
                      className="absolute inset-x-3.5 bottom-1.5 h-0.5 origin-left animate-bar-run rounded-full bg-accent"
                      style={
                        {
                          "--cycle": `${CYCLE_MS}ms`,
                          animationPlayState: paused ? "paused" : "running",
                        } as CSSProperties
                      }
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

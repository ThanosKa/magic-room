import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompareSlider } from "@/components/compare-slider";
import { FAQSection } from "@/components/faq-section";
import { HomeHero } from "@/components/home/home-hero";
import { HOME_FAQ } from "@/components/home/home-faq";
import { RevealRoot } from "@/components/home/reveal-root";
import { THEMES } from "@/lib/constants";
import { generateHref } from "@/lib/design-selection";
import { isPriorityDesignSlug } from "@/lib/seo/priority-pages";
import { cn } from "@/lib/utils";
import type { Theme } from "@/types";

const IMG = "/images/designs";

/*
 * Links to /generate don't prefetch: for signed-out visitors the tool
 * redirects to the Clerk sign-in on another origin, and every prefetch of
 * that redirect fails with a CORS error in the console.
 */

const STEPS = [
  {
    title: "Upload one photo",
    body: "Any angle, any light, any mess. A phone snapshot of the room as it is today is enough.",
  },
  {
    title: "Pick a room and a style",
    body: "Fourteen styles across fourteen room types. Add a note if you want a green sofa or more plants.",
  },
  {
    title: "Get your redesign",
    body: "Google Gemini keeps your walls, windows and layout, and restyles everything else in 30–60 seconds. Run it again for another take.",
  },
];

const FACTS = [
  {
    value: "0",
    label: "photos stored. Your image is processed in memory and deleted as soon as your result comes back.",
  },
  {
    value: "€0.33",
    label: "per standard design on the starter pack. No subscription, and credits never expire.",
  },
  {
    value: "60s",
    label: "is about the longest a run takes. Most finish sooner, with no queue and no polling.",
  },
];

const POPULAR = [
  { slug: "modern-living-room", label: "Modern living room" },
  { slug: "scandinavian-living-room", label: "Scandinavian living room" },
  { slug: "scandinavian-bedroom", label: "Scandinavian bedroom" },
  { slug: "farmhouse-kitchen", label: "Farmhouse kitchen" },
  { slug: "coastal-living-room", label: "Coastal living room" },
  { slug: "art-deco-bedroom", label: "Art Deco bedroom" },
  { slug: "modern-bathroom", label: "Modern bathroom" },
  { slug: "modern-sunroom", label: "Modern sunroom" },
];

const COMPARE = [
  { href: "/alternatives/roomgpt", label: "Magic Room vs RoomGPT" },
  { href: "/alternatives/reimaginehome", label: "Magic Room vs Reimagine Home" },
  { href: "/alternatives/interior-ai", label: "Magic Room vs Interior AI" },
  { href: "/alternatives/decorai", label: "Magic Room vs DecorAI" },
  { href: "/alternatives", label: "Every AI design tool, compared" },
  { href: "/virtual-staging", label: "AI virtual staging for real estate" },
];

/**
 * Every style tile shows that style's living room. It links to the style's
 * design page when that page is indexable; otherwise (pruned pages are never
 * linked, see PRUNED.md) it opens the tool with the style already chosen.
 */
const STYLE_TILES = (Object.entries(THEMES) as [Theme, string][]).map(([slug, name]) => {
  const designSlug = `${slug}-living-room`;
  const hasPage = isPriorityDesignSlug(designSlug);
  return {
    slug,
    name,
    href: hasPage ? `/design/${designSlug}` : generateHref({ theme: slug, roomType: "living-room" }),
    meta: hasPage ? "View ideas" : "Try this style",
    hasPage,
  };
});

const reveal = (delayMs = 0, y?: number): CSSProperties =>
  ({
    "--reveal-delay": `${delayMs}ms`,
    ...(y !== undefined && { "--reveal-y": `${y}px` }),
  }) as CSSProperties;

const SECTION = "py-22 sm:py-26 lg:py-38";
const H2 =
  "max-w-[24ch] font-serif text-[clamp(40px,4.3vw,66px)] font-normal leading-none tracking-[-0.022em] [&_em]:italic";
const TEXT_LINK =
  "inline-flex min-h-11 items-center text-[15px] font-medium tracking-[-0.01em] underline decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 motion-reduce:transition-none";

function Label({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      data-reveal
      className={cn(
        "mb-[22px] flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-ink-3 before:h-px before:w-7 before:bg-current before:content-['']",
        className,
      )}
    >
      {children}
    </p>
  );
}

function HeadSplit({ children, note, noteClassName }: { children: ReactNode; note: ReactNode; noteClassName?: string }) {
  return (
    <div className="mb-10 grid items-end gap-5 sm:mb-16 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-12">
      <div>{children}</div>
      <p
        data-reveal
        className={cn("m-0 max-w-[28rem] text-base leading-relaxed text-ink-2 lg:justify-self-end", noteClassName)}
      >
        {note}
      </p>
    </div>
  );
}

function ListRow({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex min-h-[60px] items-center justify-between gap-4 border-b border-line text-base tracking-[-0.015em] text-ink sm:text-lg"
      >
        <span className="transition-transform duration-300 ease-out group-hover:translate-x-2 motion-reduce:transition-none">
          {children}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 flex-none text-ink-3 transition-[transform,color] duration-350 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
        />
      </Link>
    </li>
  );
}

export function HomeContent() {
  return (
    <RevealRoot>
      <HomeHero />

      {/* How it works */}
      <section aria-labelledby="how-title" className={SECTION}>
        <div className="container-page">
          <Label>How it works</Label>
          <h2 id="how-title" data-reveal className={cn(H2, "text-ink [&_em]:text-ink-3")}>
            Three steps. <em>About a minute.</em>
          </h2>
          <ol className="mt-12 grid gap-2 sm:mt-20 lg:grid-cols-3 lg:gap-10">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                data-reveal
                style={reveal(i * 110)}
                className="grid grid-cols-[56px_minmax(0,1fr)] gap-x-2 border-t border-line pb-5 pt-6 sm:block sm:pb-0 sm:pt-7"
              >
                <span className="row-span-2 block font-serif text-[40px] leading-[0.9] tracking-[-0.03em] text-ink-3 sm:text-[64px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2 mt-1 text-lg font-medium tracking-[-0.015em] text-ink sm:mb-3 sm:mt-9 sm:text-xl">
                  {step.title}
                </h3>
                <p className="max-w-[32ch] text-[15.5px] leading-relaxed text-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Styles (night band) */}
      <section
        aria-labelledby="styles-title"
        className={cn(SECTION, "mx-2 rounded-3xl bg-night text-cream sm:mx-4 sm:rounded-4xl")}
      >
        <div className="container-page">
          <HeadSplit
            noteClassName="text-cream-2"
            note="Every style below started as the same plain living room. Each one works on fourteen room types, from kitchens to walk-in closets."
          >
            <Label className="text-cream/45">The styles</Label>
            <h2 id="styles-title" data-reveal className={cn(H2, "text-cream [&_em]:text-cream/50")}>
              Fourteen styles. <em>One room.</em>
            </h2>
          </HeadSplit>

          <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {STYLE_TILES.map((tile, i) => (
              <li key={tile.slug} data-reveal style={reveal((i % 4) * 90)}>
                <Link
                  href={tile.href}
                  prefetch={tile.hasPage ? undefined : false}
                  className="group relative isolate block aspect-[4/5] overflow-hidden rounded-2xl bg-cream/[0.06] text-cream after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:top-[45%] after:z-[1] after:bg-linear-to-b after:from-transparent after:to-night/75 after:content-[''] sm:rounded-xl"
                >
                  <Image
                    src={`${IMG}/${tile.slug}-living-room.jpg`}
                    alt={`${tile.name} living room`}
                    fill
                    sizes="(min-width: 1024px) 300px, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <span className="absolute inset-x-3.5 bottom-3 z-[2] flex items-baseline justify-between gap-3 sm:inset-x-[18px] sm:bottom-4">
                    <span className="font-serif text-[21px] leading-none tracking-[-0.015em] sm:text-[26px]">
                      {tile.name}
                    </span>
                    <span className="hidden translate-y-1 items-center gap-1 text-xs font-medium text-cream/70 opacity-0 transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none sm:inline-flex">
                      {tile.meta}
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
            <li data-reveal style={reveal(180)}>
              <div className="flex aspect-[4/5] flex-col justify-between rounded-2xl bg-cream/[0.08] p-4 sm:rounded-xl sm:p-6">
                <span className="font-serif text-[clamp(72px,8vw,120px)] leading-[0.85] tracking-[-0.04em]">196</span>
                <span className="max-w-[18ch] text-[15px] leading-[1.45] text-cream-2">
                  style and room combinations, all on every plan.
                </span>
              </div>
            </li>
            <li data-reveal style={reveal(270)}>
              <Link
                href="/generate"
                prefetch={false}
                className="group flex aspect-[4/5] flex-col justify-between rounded-2xl bg-cream p-4 text-ink transition-[background-color,transform] duration-250 ease-out hover:bg-[#fff8ee] active:scale-[0.98] motion-reduce:transition-none sm:rounded-xl sm:p-6"
              >
                <span className="font-serif text-[clamp(32px,3vw,44px)] leading-none tracking-[-0.02em]">
                  Try it on <em className="italic text-accent">your</em> room
                </span>
                <span className="grid size-[52px] place-items-center self-end rounded-full bg-ink text-cream transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none">
                  <ArrowRight aria-hidden="true" className="size-4" />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Before and after */}
      <section aria-labelledby="cmp-title" className={SECTION}>
        <div className="container-page">
          <HeadSplit note="One run, one photo. The window, the corner and the room's proportions stay put; the tired furniture and peeling walls don't.">
            <Label>Before and after</Label>
            <h2 id="cmp-title" data-reveal className={cn(H2, "text-ink [&_em]:text-ink-3")}>
              Drag the line. <em>See the difference.</em>
            </h2>
          </HeadSplit>
          <div data-reveal style={reveal(0, 48)}>
            <CompareSlider
              before={{ src: "/images/room-before.png", alt: "Room before AI redesign" }}
              after={{ src: "/images/room-after.png", alt: "Room after AI redesign" }}
              sizes="(min-width: 1240px) 1144px, 100vw"
              className="aspect-[4/5] rounded-[22px] sm:aspect-[16/10] sm:rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* Facts */}
      <section aria-label="Privacy, price and speed" className="bg-paper-2 py-22 lg:py-30">
        <div className="container-page">
          <ul className="grid gap-10 lg:grid-cols-3 lg:gap-12">
            {FACTS.map((fact, i) => (
              <li key={fact.value} data-reveal style={reveal(i * 130)} className="flex flex-col gap-5">
                <span className="font-serif text-[clamp(72px,8.4vw,128px)] leading-[0.85] tracking-[-0.04em] text-ink tabular-nums">
                  {fact.value}
                </span>
                <span className="max-w-[30ch] text-[15.5px] leading-[1.55] text-ink-2">{fact.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Explore */}
      <section aria-labelledby="explore-title" className={SECTION}>
        <div className="container-page">
          <Label>Explore</Label>
          <h2 id="explore-title" data-reveal className={cn(H2, "text-ink [&_em]:text-ink-3")}>
            Ideas to start from. <em>Tools to compare.</em>
          </h2>
          <div className="mt-12 grid gap-16 sm:mt-[72px] lg:grid-cols-2 lg:gap-[72px]">
            <div data-reveal>
              <div className="flex items-center justify-between gap-4 pb-2">
                <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-3">Popular design ideas</h3>
                <Link href="/design" className={cn(TEXT_LINK, "text-sm text-ink decoration-ink/35 hover:decoration-ink")}>
                  All styles
                </Link>
              </div>
              <ul className="border-t border-line">
                {POPULAR.map((p) => (
                  <ListRow key={p.slug} href={`/design/${p.slug}`}>
                    {p.label}
                  </ListRow>
                ))}
              </ul>
            </div>
            <div data-reveal style={reveal(120)}>
              <div className="flex items-center justify-between gap-4 pb-2">
                <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-ink-3">Which AI design tool?</h3>
                <Link
                  href="/blog/best-ai-interior-design-tools-2026"
                  className={cn(TEXT_LINK, "text-sm text-ink decoration-ink/35 hover:decoration-ink")}
                >
                  2026 guide
                </Link>
              </div>
              <p className="mb-5 mt-1 max-w-[40ch] text-[15px] leading-[1.55] text-ink-2">
                Pick Magic Room when photo privacy, one-time pricing and keeping your real layout matter. The
                others run on subscriptions and keep your uploads.
              </p>
              <ul className="border-t border-line">
                {COMPARE.map((c) => (
                  <ListRow key={c.href} href={c.href}>
                    {c.label}
                  </ListRow>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FAQSection items={HOME_FAQ} />

      {/* Closing */}
      <section
        aria-labelledby="close-title"
        className="relative isolate mx-2 mb-2 flex min-h-[78vh] items-end overflow-hidden rounded-3xl sm:mx-4 sm:mb-4 sm:min-h-[86vh] sm:rounded-4xl"
      >
        <Image src={`${IMG}/luxury-living-room.jpg`} alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-night/20 via-night/35 via-40% to-night/80"
        />
        <div className="w-full px-[clamp(24px,5vw,80px)] pb-[clamp(40px,6vw,80px)]">
          <h2
            id="close-title"
            data-reveal
            className="mb-9 max-w-[13ch] font-serif text-[clamp(48px,7.4vw,124px)] font-normal leading-[0.92] tracking-[-0.03em] text-cream [text-shadow:0_16px_38px_rgb(0_0_0/0.32)] [&_em]:italic [&_em]:text-cream/70"
          >
            Your next room is <em>one photo</em> away.
          </h2>
          <div data-reveal style={reveal(140)} className="flex flex-wrap items-center gap-x-7 gap-y-1">
            <Button asChild variant="cream" size="lg" className="group gap-4 pl-6 pr-[7px]">
              <Link href="/generate" prefetch={false}>
                Redesign my room
                <span className="grid size-[38px] place-items-center rounded-full bg-ink text-cream">
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-[3px] motion-reduce:transition-none"
                  />
                </span>
              </Link>
            </Button>
            <Link href="/pricing" className={cn(TEXT_LINK, "text-cream decoration-cream/35 hover:decoration-cream")}>
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </RevealRoot>
  );
}

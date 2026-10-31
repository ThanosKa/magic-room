import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[78vh] flex-col items-center justify-center py-16 text-center md:py-24">
      <h1 className="font-serif text-[clamp(128px,22vw,280px)] leading-[0.85] tracking-[-0.04em] text-ink">
        404
      </h1>
      <h2 className="mt-8 font-serif text-[clamp(32px,4vw,52px)] leading-[1.05] tracking-[-0.02em] text-ink">
        Page not found
      </h2>
      <p className="mt-4 max-w-[34rem] text-[17px] leading-[1.55] text-pretty text-ink-2">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been removed or doesn&apos;t exist.
      </p>
      <div className="mt-10 flex w-full flex-col items-center gap-x-8 gap-y-5 sm:w-auto sm:flex-row">
        <Button asChild size="lg" className="group w-full pr-2 sm:w-auto">
          <Link href="/">
            Go back home
            <span
              aria-hidden
              className="ml-1 flex size-[34px] items-center justify-center rounded-full bg-cream text-ink"
            >
              <ArrowRight className="size-4 transition-transform duration-160 ease-out group-hover:translate-x-[3px] motion-reduce:transition-none" />
            </span>
          </Link>
        </Button>
        <Button asChild variant="link">
          <Link href="/generate">Generate Designs</Link>
        </Button>
      </div>
    </div>
  );
}

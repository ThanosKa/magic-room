import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CtaSectionProps {
    heading: string;
    subtext: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
}

/**
 * Closing call to action: a rounded night band inset from the page edges,
 * cream serif heading, cream pill (with an ink arrow chip) and a cream text
 * link. Ported from the test page's closing section, without the photo.
 */
export function CtaSection({
    heading,
    subtext,
    primaryLabel = "Generate Designs",
    primaryHref = "/generate",
    secondaryLabel = "View Pricing",
    secondaryHref = "/pricing",
}: CtaSectionProps) {
    return (
        <section className="mx-3 mb-3 mt-16 overflow-hidden rounded-3xl bg-night text-cream sm:mx-4 sm:mb-4 sm:rounded-4xl md:mt-24">
            <div className="container-page py-20 text-center md:py-28">
                <h2 className="mx-auto max-w-[18ch] font-serif text-[clamp(40px,5.6vw,80px)] font-normal leading-[0.98] tracking-[-0.025em] text-cream text-balance">
                    {heading}
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed tracking-[-0.01em] text-cream-2 text-pretty">
                    {subtext}
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-x-8 gap-y-4 sm:flex-row">
                    <Button
                        asChild
                        variant="cream"
                        size="lg"
                        className="group gap-4 pl-7 pr-[7px]"
                    >
                        <Link href={primaryHref}>
                            {primaryLabel}
                            <span className="grid size-[38px] place-items-center rounded-full bg-ink text-cream">
                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-[3px] motion-reduce:transition-none"
                                />
                            </span>
                        </Link>
                    </Button>
                    {secondaryLabel && secondaryHref && (
                        <Link
                            href={secondaryHref}
                            className="inline-flex min-h-11 items-center text-[15px] font-medium tracking-[-0.01em] text-cream underline decoration-cream/35 decoration-1 underline-offset-[6px] transition-[text-decoration-color] duration-300 hover:decoration-cream motion-reduce:transition-none"
                        >
                            {secondaryLabel}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

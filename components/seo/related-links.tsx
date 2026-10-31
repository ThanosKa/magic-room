import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IContextualLink } from "@/lib/seo/internal-links";

interface RelatedLinksProps {
    heading: string;
    intro?: string;
    links: IContextualLink[];
    /** "cards" for a grid with descriptions, "inline" for a compact chip row. */
    variant?: "cards" | "inline";
    /**
     * Required, not defaulted: the section's background has to match whatever
     * sits above it on the page, and every call site already passes one. A
     * default here would only ever be silently wrong.
     */
    className: string;
}

/**
 * Contextual internal-link block.
 *
 * Every anchor carries the target page's real query phrase — no "learn more",
 * no "click here". Used to spread link equity out of the header/footer template
 * and into the long tail of design, blog and comparison pages.
 *
 * Look: serif heading, then either hairline rows with an arrow that slides on
 * hover ("cards", from the test page's Explore lists) or soft pills ("inline").
 */
export function RelatedLinks({
    heading,
    intro,
    links,
    variant = "cards",
    className,
}: RelatedLinksProps) {
    if (links.length === 0) return null;

    return (
        <section className={className}>
            <div className="container-page">
                <div className="mx-auto max-w-5xl">
                    <h2 className="max-w-[24ch] font-serif text-[clamp(30px,3.2vw,44px)] font-normal leading-[1.05] tracking-[-0.02em] text-ink text-balance">
                        {heading}
                    </h2>
                    {intro && (
                        <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-2">{intro}</p>
                    )}

                    {variant === "cards" ? (
                        <div className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group flex flex-col border-t border-line py-5 pr-1"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-[17px] font-medium leading-snug tracking-[-0.015em] text-ink">
                                            {link.label}
                                        </h3>
                                        <ArrowUpRight
                                            aria-hidden="true"
                                            className="mt-0.5 size-[18px] shrink-0 text-ink-3 transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
                                        />
                                    </div>
                                    {link.description && (
                                        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                                            {link.description}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <ul className="mt-6 flex flex-wrap gap-2.5">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="inline-flex min-h-10 items-center rounded-full bg-ink/5 px-4 text-sm tracking-[-0.005em] text-ink transition-[background-color,transform] duration-160 ease-out hover:bg-ink/10 active:scale-[0.97] motion-reduce:transition-none"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}

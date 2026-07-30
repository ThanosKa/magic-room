import React from "react";
import Link from "next/link";
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
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{heading}</h2>
                    {intro && (
                        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-400">{intro}</p>
                    )}

                    {variant === "cards" ? (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-primary dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary"
                                >
                                    <h3 className="font-semibold text-slate-900 group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                                        {link.label}
                                    </h3>
                                    {link.description && (
                                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                            {link.description}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <ul className="mt-6 flex flex-wrap gap-3">
                            {links.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="inline-block rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-primary"
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

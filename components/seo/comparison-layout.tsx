import React from "react";
import { cn } from "@/lib/utils";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";

/**
 * Layout pieces shared by the comparison pages (/alternatives hub,
 * /alternatives/<competitor>, /vs/<competitor>). Look only: none of these add
 * text, so the pages' copy and SEO stay exactly what each page passes in.
 *
 * Everything sits on a 5xl measure inside `container-page`, the same measure
 * RelatedLinks uses, so all blocks share one left edge.
 */

/** Ink text link with a hairline underline that firms up on hover. */
export const LINK_CLASS =
    "text-ink underline decoration-ink/30 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-200 ease-out hover:decoration-ink motion-reduce:transition-none";

/** Soft pill for rows of cross-links (same as RelatedLinks "inline"). */
export const CHIP_CLASS =
    "inline-flex min-h-10 items-center rounded-full bg-ink/5 px-4 text-sm tracking-[-0.005em] text-ink transition-[background-color,transform] duration-160 ease-out hover:bg-ink/10 active:scale-[0.97] motion-reduce:transition-none";

export const H1_CLASS =
    "animate-rise font-serif text-[clamp(44px,6.4vw,92px)] font-normal leading-[0.96] tracking-[-0.025em] text-ink text-balance";

export const H2_CLASS =
    "font-serif text-[clamp(32px,3.4vw,48px)] font-normal leading-[1.04] tracking-[-0.02em] text-ink text-balance";

/** Smaller serif heading for blocks inside a section (h3 level). */
export const H3_CLASS =
    "font-serif text-[24px] font-normal leading-tight tracking-[-0.01em] text-ink md:text-[26px]";

/** Small uppercase label, used for h4 column labels. */
export const LABEL_CLASS =
    "text-[11px] font-medium uppercase tracking-[0.18em] text-ink-3";

export const LEAD_CLASS = "text-[19px] leading-[1.55] tracking-[-0.01em] text-ink-2 text-pretty";

export const BODY_CLASS = "text-base leading-relaxed text-ink-2 text-pretty";

/** 6px accent dot, the Magic Room marker in tables and cards. */
export function AccentDot({ className }: { className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-accent align-middle",
                className
            )}
        />
    );
}

function Measure({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className="container-page">
            <div className={cn("mx-auto max-w-5xl", className)}>{children}</div>
        </div>
    );
}

export function PageBreadcrumb({ items }: { items: { name: string; href: string }[] }) {
    return (
        <Measure className="pt-2">
            <BreadcrumbNav items={items} />
        </Measure>
    );
}

/** Opening block: the page passes its own H1 and intro. Copy column stays at reading width. */
export function ComparisonHero({ children }: { children: React.ReactNode }) {
    return (
        <section className="pb-16 pt-6 md:pb-24 md:pt-12">
            <Measure>
                <div className="max-w-3xl">{children}</div>
            </Measure>
        </section>
    );
}

interface SectionProps {
    children: React.ReactNode;
    /** "band" = paper-2 rounded band inset from the page edges. Holds CompareTable (its tints work on paper-2); FeatureComparisonTable belongs on paper, its phone layout uses paper-2 boxes. */
    tone?: "paper" | "band";
    /** Hairline above the content (paper sections that follow another paper section). */
    rule?: boolean;
    className?: string;
}

export function Section({ children, tone = "paper", rule = true, className }: SectionProps) {
    if (tone === "band") {
        return (
            <section
                className={cn(
                    "mx-3 rounded-3xl bg-paper-2 py-16 sm:mx-4 sm:rounded-4xl md:py-24",
                    className
                )}
            >
                <Measure>{children}</Measure>
            </section>
        );
    }
    return (
        <section className={cn("py-16 md:py-24", rule && "pt-0 md:pt-0", className)}>
            <Measure className={cn(rule && "border-t border-line pt-14 md:pt-20")}>{children}</Measure>
        </section>
    );
}

/** A hairline on the shared measure, for blocks that bring their own section (RelatedLinks). */
export function Rule() {
    return (
        <Measure>
            <hr className="border-line" />
        </Measure>
    );
}

interface SplitProps {
    heading: React.ReactNode;
    intro?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Editorial two-column block: heading and intro on the left (sticky on
 * desktop), the content on the right at reading width. One column on phones.
 */
export function Split({ heading, intro, children }: SplitProps) {
    return (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.55fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28">
                <h2 className={H2_CLASS}>{heading}</h2>
                {intro && <p className={cn(BODY_CLASS, "mt-5")}>{intro}</p>}
            </div>
            <div>{children}</div>
        </div>
    );
}

export interface CompareColumn {
    label: React.ReactNode;
    /** Shown above each cell on phones (CSS only, so it is not page text). */
    mobileLabel: string;
    /** The Magic Room column: tinted, with an accent dot in the header. */
    highlight?: boolean;
    className?: string;
}

export interface CompareRow {
    key: string;
    cells: React.ReactNode[];
    /** The Magic Room row (hub table): tinted. */
    highlight?: boolean;
}

interface CompareTableProps {
    columns: CompareColumn[];
    rows: CompareRow[];
    /** Below this width (≥768px) the table scrolls inside its own box. */
    minWidthClass?: string;
}

/**
 * Comparison table in the look of FeatureComparisonTable. From 768px it is a
 * real table in a hairline box that scrolls inside itself if it gets too
 * narrow. Below 768px the same cells restack into one block per row (first
 * cell as the serif title, each other cell under a small column label drawn
 * by CSS), so the text in the page is the same at every width.
 */
export function CompareTable({ columns, rows, minWidthClass = "md:min-w-[640px]" }: CompareTableProps) {
    return (
        <div className="max-md:border-t max-md:border-line md:overflow-x-auto md:overscroll-x-contain md:rounded-xl md:border md:border-line md:bg-background">
            <table className={cn("w-full border-collapse text-[15px] leading-relaxed max-md:block", minWidthClass)}>
                <thead className="max-md:hidden">
                    <tr className="border-b border-line bg-paper-2">
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                className={cn(
                                    "px-5 py-4 text-left align-bottom text-xs font-medium uppercase tracking-[0.14em] text-ink-3",
                                    col.highlight && "bg-ink/[0.04] text-ink",
                                    col.className
                                )}
                            >
                                {col.highlight && <AccentDot />}
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="max-md:block">
                    {rows.map((row) => (
                        <tr
                            key={row.key}
                            className={cn(
                                "border-b border-line align-top last:border-0 max-md:block max-md:py-5 max-md:last:border-b",
                                row.highlight &&
                                    "bg-ink/[0.04] max-md:my-3 max-md:rounded-xl max-md:border-0 max-md:px-4 max-md:last:border-0"
                            )}
                        >
                            {row.cells.map((cell, i) => {
                                const col = columns[i];
                                if (i === 0) {
                                    return (
                                        <td
                                            key={i}
                                            className="px-5 py-4 font-medium text-ink max-md:mb-2 max-md:block max-md:p-0 max-md:font-serif max-md:text-[22px] max-md:font-normal max-md:leading-tight max-md:tracking-[-0.01em]"
                                        >
                                            {cell}
                                        </td>
                                    );
                                }
                                return (
                                    <td
                                        key={i}
                                        data-label={col?.mobileLabel}
                                        className={cn(
                                            "px-5 py-4 text-ink-2",
                                            "max-md:block max-md:px-0 max-md:py-1.5 max-md:before:mb-0.5 max-md:before:block max-md:before:text-[11px] max-md:before:font-medium max-md:before:uppercase max-md:before:tracking-[0.16em] max-md:before:text-ink-3 max-md:before:content-[attr(data-label)]",
                                            col?.highlight &&
                                                "bg-ink/[0.04] text-ink max-md:my-1.5 max-md:rounded-lg max-md:px-3.5 max-md:py-2.5 max-md:before:text-ink"
                                        )}
                                    >
                                        {cell}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

import React from "react";
import { cn } from "@/lib/utils";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";

export const LINK_CLASS =
    "text-ink underline decoration-ink/30 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-200 ease-out hover:decoration-ink motion-reduce:transition-none";

export const CHIP_CLASS =
    "inline-flex min-h-10 items-center rounded-full bg-ink/5 px-4 text-sm tracking-[-0.005em] text-ink transition-[background-color,transform] duration-160 ease-out hover:bg-ink/10 active:scale-[0.97] motion-reduce:transition-none";

export const H1_CLASS =
    "animate-rise font-serif text-[clamp(44px,6.4vw,92px)] font-normal leading-[0.96] tracking-[-0.025em] text-ink text-balance";

export const H2_CLASS =
    "font-serif text-[clamp(32px,3.4vw,48px)] font-normal leading-[1.04] tracking-[-0.02em] text-ink text-balance";

export const H3_CLASS =
    "font-serif text-[24px] font-normal leading-tight tracking-[-0.01em] text-ink md:text-[26px]";

export const LABEL_CLASS =
    "text-[11px] font-medium uppercase tracking-[0.18em] text-ink-3";

export const LEAD_CLASS = "text-[19px] leading-[1.55] tracking-[-0.01em] text-ink-2 text-pretty";

export const BODY_CLASS = "text-base leading-relaxed text-ink-2 text-pretty";

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
    tone?: "paper" | "band";
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
    mobileLabel: string;
    highlight?: boolean;
    className?: string;
}

export interface CompareRow {
    key: string;
    cells: React.ReactNode[];
    highlight?: boolean;
}

interface CompareTableProps {
    columns: CompareColumn[];
    rows: CompareRow[];
    minWidthClass?: string;
}

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

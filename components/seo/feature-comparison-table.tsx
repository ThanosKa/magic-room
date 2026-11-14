import React from "react";

import type { ICompetitorData } from "@/lib/seo/competitor-data";

interface ComparisonRow {
    feature: string;
    magicRoom: string;
    competitor: string;
}

interface FeatureComparisonTableProps {
    competitor: ICompetitorData;
}

/**
 * Every competitor cell comes from that competitor's entry in
 * `lib/seo/competitor-data.ts`, where each claim names its source and date.
 * Do not add rows with a generic competitor column: a claim that is true of
 * one vendor is false of another.
 */
function buildRows(competitor: ICompetitorData): ComparisonRow[] {
    return [
        {
            feature: "Starting price",
            magicRoom: "€9.99 one-time for 20 credits (~€0.50/Quick design)",
            competitor: competitor.pricing,
        },
        {
            feature: "Free trial",
            magicRoom: "1 free credit on signup — no card required",
            competitor: competitor.pricingModel.freeTier,
        },
        {
            feature: "Credits expire",
            magicRoom: "No — credits never expire",
            competitor: competitor.pricingModel.creditsExpire,
        },
        {
            feature: "Commercial rights",
            magicRoom: "Full commercial rights on every design",
            competitor: competitor.pricingModel.commercialRights,
        },
        {
            feature: "Image storage",
            magicRoom: "Never stored — processed in memory only",
            competitor: competitor.imageStorage,
        },
        {
            feature: "AI model",
            magicRoom: "Google Gemini and OpenAI multimodal models",
            competitor: competitor.aiModel,
        },
    ];
}

export function FeatureComparisonTable({ competitor }: FeatureComparisonTableProps) {
    const rows = buildRows(competitor);
    const competitorName = competitor.name;
    return (
        <>
            {/* Stacked rows for phones: hairline list, nothing to scroll */}
            <div className="border-t border-line md:hidden">
                {rows.map((row, index) => (
                    <div key={index} className="border-b border-line py-5">
                        <h4 className="mb-3 font-serif text-[22px] font-normal leading-tight tracking-[-0.01em] text-ink">
                            {row.feature}
                        </h4>
                        <div className="space-y-2.5 text-[15px] leading-relaxed">
                            <div className="rounded-lg bg-paper-2 px-3.5 py-2.5">
                                <span className="font-medium text-ink">
                                    <span aria-hidden="true" className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-accent align-middle" />
                                    Magic Room: </span>
                                <span className="text-ink-2">{row.magicRoom}</span>
                            </div>
                            <div className="px-3.5">
                                <span className="font-medium text-ink-2">{competitorName}: </span>
                                <span className="text-ink-3">{row.competitor}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table for tablet and desktop. If it ever gets too narrow it
                scrolls inside its own box, never the page. */}
            <div className="hidden overflow-x-auto overscroll-x-contain rounded-xl border border-line bg-background md:block">
                <table className="w-full min-w-[640px] border-collapse text-[15px] leading-relaxed">
                    <thead>
                        <tr className="border-b border-line bg-paper-2">
                            <th className="w-1/3 px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-ink-3">
                                Feature
                            </th>
                            <th className="w-1/3 bg-ink/[0.04] px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-ink">
                                <span aria-hidden="true" className="mr-2 inline-block size-1.5 -translate-y-px rounded-full bg-accent align-middle" />
                                Magic Room
                            </th>
                            <th className="w-1/3 px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-ink-3">
                                {competitorName}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr
                                key={index}
                                className="border-b border-line align-top last:border-0"
                            >
                                <td className="px-5 py-4 font-medium text-ink">
                                    {row.feature}
                                </td>
                                <td className="bg-ink/[0.04] px-5 py-4 text-ink">
                                    {row.magicRoom}
                                </td>
                                <td className="px-5 py-4 text-ink-2">
                                    {row.competitor}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

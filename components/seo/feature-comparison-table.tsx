import React from "react";

interface ComparisonRow {
    feature: string;
    magicRoom: string;
    competitor: string;
}

const ROWS: ComparisonRow[] = [
    {
        feature: "Starting price",
        magicRoom: "€9.99 one-time for 20 credits (~€0.50/Quick design)",
        competitor: "Subscription, typically billed monthly",
    },
    {
        feature: "Pricing model",
        magicRoom: "One-time credit packages — no subscription",
        competitor: "Subscription-based for most functionality",
    },
    {
        feature: "Free trial",
        magicRoom: "1 free credit on signup — no card required",
        competitor: "Limited free tier with watermark or low cap",
    },
    {
        feature: "Credits expire",
        magicRoom: "No — credits never expire",
        competitor: "Monthly credits often reset each billing period",
    },
    {
        feature: "Commercial rights",
        magicRoom: "Full commercial rights on every paid design",
        competitor: "Often restricted to higher-tier plans",
    },
    {
        feature: "Image storage",
        magicRoom: "Never stored — processed in memory only",
        competitor: "Varies — most store uploaded images on servers",
    },
    {
        feature: "Privacy policy",
        magicRoom: "Explicit no-storage guarantee",
        competitor: "Does not typically make equivalent commitment",
    },
    {
        feature: "AI model",
        magicRoom: "Google Gemini and OpenAI multimodal (architecture-aware)",
        competitor: "Diffusion-based models (variable structure preservation)",
    },
    {
        feature: "Design themes",
        magicRoom: "14 themes with design-principle guidance",
        competitor: "Style presets without detailed design guidance",
    },
    {
        feature: "Room types",
        magicRoom: "14 room types (196 style × room combinations)",
        competitor: "Fewer room types, less granular control",
    },
    {
        feature: "Speed",
        magicRoom: "One redesign in 30–60 seconds",
        competitor: "Single output; slower on higher-quality settings",
    },
    {
        feature: "Output quality",
        magicRoom: "Preserves room geometry and materials accurately",
        competitor: "Variable — can alter room dimensions inconsistently",
    },
];

interface FeatureComparisonTableProps {
    competitorName: string;
    competitorPricing?: string;
}

export function FeatureComparisonTable({ competitorName, competitorPricing }: FeatureComparisonTableProps) {
    const rows: ComparisonRow[] = competitorPricing
        ? ROWS.map((row) =>
            row.feature === "Starting price"
                ? { ...row, competitor: competitorPricing }
                : row
        )
        : ROWS;
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

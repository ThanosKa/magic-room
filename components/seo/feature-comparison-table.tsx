import React from "react";

interface ComparisonRow {
    feature: string;
    magicRoom: string;
    competitor: string;
}

const ROWS: ComparisonRow[] = [
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
        feature: "Pricing model",
        magicRoom: "One-time credit packages — no subscription",
        competitor: "Subscription-based for most functionality",
    },
    {
        feature: "Credits expire",
        magicRoom: "No — credits never expire",
        competitor: "Monthly credits often reset each billing period",
    },
    {
        feature: "AI model",
        magicRoom: "Google Gemini multimodal (architecture-aware)",
        competitor: "Diffusion-based models (variable structure preservation)",
    },
    {
        feature: "Design themes",
        magicRoom: "8 themes with design-principle guidance",
        competitor: "Style presets without detailed design guidance",
    },
    {
        feature: "Output quality",
        magicRoom: "Preserves room geometry and materials accurately",
        competitor: "Variable — can alter room dimensions inconsistently",
    },
];

interface FeatureComparisonTableProps {
    competitorName: string;
}

export function FeatureComparisonTable({ competitorName }: FeatureComparisonTableProps) {
    return (
        <>
            {/* Card layout for mobile */}
            <div className="flex flex-col gap-4 md:hidden">
                {ROWS.map((row, index) => (
                    <div
                        key={index}
                        className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                    >
                        <h4 className="mb-3 font-semibold text-slate-700 dark:text-slate-300">
                            {row.feature}
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium text-primary">Magic Room: </span>
                                <span className="text-slate-600 dark:text-slate-400">{row.magicRoom}</span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{competitorName}: </span>
                                <span className="text-slate-600 dark:text-slate-400">{row.competitor}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table layout for tablet and desktop */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                            <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                                Feature
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-primary w-1/3">
                                Magic Room
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                                {competitorName}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {ROWS.map((row, index) => (
                            <tr
                                key={index}
                                className="border-b border-slate-100 last:border-0 dark:border-slate-800/50"
                            >
                                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                                    {row.feature}
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                    {row.magicRoom}
                                </td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
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

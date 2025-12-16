"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock, Zap, Wand2, LucideIcon } from "lucide-react";

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    image: string;
}

const FEATURES: Feature[] = [
    {
        id: "privacy",
        title: "Privacy First",
        description: "Your photos are automatically deleted after processing. We never store your personal data or images.",
        icon: Lock,
        image: "/images/feature-privacy.png", // We might need to handle these images if they don't exist, will fallback or use placeholders
    },
    {
        id: "speed",
        title: "Lightning Fast",
        description: "Get 4-8 stunning design variations in under 60 seconds. Powered by the latest SDXL Lightning models.",
        icon: Zap,
        image: "/images/feature-speed.png",
    },
    {
        id: "quality",
        title: "Pro Quality",
        description: "Photorealistic results that understand interior design principles, lighting, and spatial awareness.",
        icon: Wand2,
        image: "/images/feature-quality.png",
    },
];

export function FeatureTabs() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="bg-slate-50 py-24 dark:bg-slate-900/50">
            <div className="container px-4 md:px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900 dark:text-white">
                        Why Choose Magic Room?
                    </h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">
                        Professional-grade AI design with privacy at its core.
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    {/* Left: Tabs */}
                    <div className="flex flex-col gap-6">
                        {FEATURES.map((feature, index) => (
                            <button
                                key={feature.id}
                                onClick={() => setActiveTab(index)}
                                className={`group relative flex flex-col gap-2 rounded-2xl border p-6 text-left transition-all ${activeTab === index
                                        ? "border-purple-200 bg-white ring-1 ring-purple-100 dark:border-purple-900 dark:bg-slate-800 dark:ring-purple-900 shadow-sm"
                                        : "border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${activeTab === index
                                                ? "bg-purple-600 text-white"
                                                : "bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-purple-900/30 dark:group-hover:text-purple-400"
                                            }`}
                                    >
                                        <feature.icon className="h-6 w-6" />
                                    </div>
                                    <h3
                                        className={`text-xl font-bold transition-colors ${activeTab === index
                                                ? "text-slate-900 dark:text-white"
                                                : "text-slate-600 dark:text-slate-400"
                                            }`}
                                    >
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="mt-2 text-slate-600 dark:text-slate-400 pl-16">
                                    {feature.description}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Right: Feature Image */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 lg:aspect-[4/3] shadow-2xl ring-1 ring-slate-900/5">
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-transparent" />

                        {/* We use a colored placeholder if image is missing to avoid broken UI */}
                        <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
                            {/* Create a visual representation for each feature using gradients/icons if images don't exist */}
                            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-500 ${activeTab === 0 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                <div className="text-center p-8">
                                    <Lock className="w-32 h-32 mx-auto text-purple-200 dark:text-purple-900/20 mb-4" />
                                    <p className="text-sm font-medium text-slate-400">Secure & Private Processing</p>
                                </div>
                            </div>
                            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-500 ${activeTab === 1 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                <div className="text-center p-8">
                                    <Zap className="w-32 h-32 mx-auto text-amber-200 dark:text-amber-900/20 mb-4" />
                                    <p className="text-sm font-medium text-slate-400">GPU Accelerated Generation</p>
                                </div>
                            </div>
                            <div className={`w-full h-full flex items-center justify-center transition-opacity duration-500 ${activeTab === 2 ? 'opacity-100' : 'opacity-0 hidden'}`}>
                                <div className="text-center p-8">
                                    <Wand2 className="w-32 h-32 mx-auto text-blue-200 dark:text-blue-900/20 mb-4" />
                                    <p className="text-sm font-medium text-slate-400">High Fidelity Export</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

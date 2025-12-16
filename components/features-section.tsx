"use client";

import { Lock, Zap, Wand2 } from "lucide-react";

export function FeaturesSection() {
    return (
        <section className="bg-slate-50 py-16 dark:bg-slate-900/50">
            <div className="container px-4 md:px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-slate-900 dark:text-white">
                        Why Choose Magic Room?
                    </h2>
                    <p className="mt-4 text-slate-600 dark:text-slate-400">
                        Professional-grade AI design with privacy at its core.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <Lock className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            Privacy First
                        </h3>
                        <p className="mt-3 text-slate-600 dark:text-slate-400">
                            Your photos are automatically deleted after processing. We never
                            store your personal data or images.
                        </p>
                    </div>

                    <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            Lightning Fast
                        </h3>
                        <p className="mt-3 text-slate-600 dark:text-slate-400">
                            Get stunning design variations in under 60 seconds. Powered
                            by Google Gemini 2.5 Flash.
                        </p>
                    </div>

                    <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <Wand2 className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            Pro Quality
                        </h3>
                        <p className="mt-3 text-slate-600 dark:text-slate-400">
                            Photorealistic results that understand interior design
                            principles, lighting, and spatial awareness.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

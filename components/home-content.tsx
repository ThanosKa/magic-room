"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PageTransition } from "@/components/animated-card";
import { HeroComparison } from "@/components/hero-comparison";
import { FeaturesSection } from "@/components/features-section";
import { FAQSection } from "@/components/faq-section";

export default function HomeContent() {

    return (
        <PageTransition>
            <section className="relative overflow-hidden bg-white pb-16 pt-8 dark:bg-slate-950 md:pb-32 md:pt-12">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="mt-8 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl">
                            Transform Your Room in <br className="hidden md:block" />
                            <span className="text-primary">Seconds</span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                            Upload a photo of your space and let our AI generate stunning
                            design variations. Privacy-first, instant results, and
                            professional quality.
                        </p>

                        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Link href="/generate">
                                <Button
                                    size="lg"
                                    className="h-12 bg-primary px-8 text-lg hover:bg-primary/90 text-white"
                                >
                                    Generate Designs
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-12 px-8 text-lg"
                                >
                                    View Pricing
                                </Button>
                            </Link>
                        </div>

                        <div className="mt-16 w-full max-w-6xl">
                            <HeroComparison
                                beforeImage="/images/room-before.png"
                                afterImage="/images/room-after.png"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-50 blur-3xl dark:bg-primary/10" />
            </section>

            <FeaturesSection />

            <FAQSection />

            <section className="border-t border-slate-200 bg-white py-24 dark:border-slate-800 dark:bg-slate-950">
                <div className="container px-4 text-center md:px-6">
                    <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-4xl text-slate-900 dark:text-white">
                        Ready to Redesign Your Space?
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">
                        Join thousands of users transforming their homes with Magic Room.
                    </p>
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link href="/generate">
                            <Button
                                size="lg"
                                className="h-12 bg-primary px-8 text-lg hover:bg-primary/90 text-white"
                            >
                                Start Creating Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                View Pricing
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PageTransition>
    );
}

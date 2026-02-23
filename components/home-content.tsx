"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PageTransition } from "@/components/animated-card";
import { HeroComparison } from "@/components/hero-comparison";
import { FeaturesSection } from "@/components/features-section";
import { FAQSection } from "@/components/faq-section";
import { Card, CardContent } from "@/components/ui/card";

const POPULAR_DESIGNS = [
    { slug: "modern-living-room", label: "Modern Living Room" },
    { slug: "scandinavian-bedroom", label: "Scandinavian Bedroom" },
    { slug: "industrial-kitchen", label: "Industrial Kitchen" },
    { slug: "minimalist-bathroom", label: "Minimalist Bathroom" },
    { slug: "bohemian-living-room", label: "Bohemian Living Room" },
    { slug: "luxury-bedroom", label: "Luxury Bedroom" },
    { slug: "tropical-living-room", label: "Tropical Living Room" },
    { slug: "vintage-dining-room", label: "Vintage Dining Room" },
];

export default function HomeContent() {

    return (
        <PageTransition>
            <section className="relative overflow-hidden bg-white pb-12 pt-8 dark:bg-slate-950 md:pb-20 md:pt-12">
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

            <section className="border-t border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="container px-4 md:px-6">
                    <div className="mb-8 flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
                            Popular Design Styles
                        </h2>
                        <Link
                            href="/design"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            View all design styles
                        </Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {POPULAR_DESIGNS.map((design) => (
                            <Link key={design.slug} href={`/design/${design.slug}`}>
                                <Card className="h-full border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                                    <CardContent className="p-4">
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {design.label}
                                        </p>
                                        <p className="mt-1 text-sm text-primary">
                                            Generate designs
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <FAQSection />

            <section className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
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

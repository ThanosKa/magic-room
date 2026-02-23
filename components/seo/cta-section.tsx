import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CtaSectionProps {
    heading: string;
    subtext: string;
    primaryLabel?: string;
    primaryHref?: string;
    secondaryLabel?: string;
    secondaryHref?: string;
}

export function CtaSection({
    heading,
    subtext,
    primaryLabel = "Generate Designs",
    primaryHref = "/generate",
    secondaryLabel = "View Pricing",
    secondaryHref = "/pricing",
}: CtaSectionProps) {
    return (
        <section className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
            <div className="container px-4 text-center md:px-6">
                <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight md:text-4xl text-slate-900 dark:text-white">
                    {heading}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-400">
                    {subtext}
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Link href={primaryHref}>
                        <Button
                            size="lg"
                            className="h-12 bg-primary px-8 text-lg hover:bg-primary/90 text-white"
                        >
                            {primaryLabel}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    {secondaryLabel && secondaryHref && (
                        <Link href={secondaryHref}>
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                {secondaryLabel}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

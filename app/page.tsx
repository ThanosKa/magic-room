"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Lock, ArrowRight, Wand2 } from "lucide-react";
import { PageTransition } from "@/components/animated-card";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { FAQSection } from "@/components/faq-section";

export default function Home() {
  const { user } = useUser();

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pb-16 pt-24 dark:bg-slate-950 md:pb-32 md:pt-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            {/* Pill Badge */}
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary dark:border-primary/30 dark:bg-primary/10 dark:text-primary">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              AI Interior Design Assistant
            </div>

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

            {/* Before/After Demo */}
            <div className="mt-16 w-full max-w-5xl">
              <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                <BeforeAfterSlider
                  beforeImage="/images/room-before.png"
                  afterImage="/images/room-after.png"
                  className="aspect-[4/3] w-full sm:aspect-[16/9]"
                />
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
                Drag the slider to see the transformation
              </p>
            </div>
          </div>
        </div>

        {/* Background Gradients */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-50 blur-3xl dark:bg-primary/10" />
      </section>

      {/* Features Section */}
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

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
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
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Lightning Fast
              </h3>
              <p className="mt-3 text-slate-600 dark:text-slate-400">
                Get 4-8 stunning design variations in under 60 seconds. Powered
                by the latest SDXL Lightning models.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
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

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
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

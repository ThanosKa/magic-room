"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Lock, Zap, Check, ArrowRight } from "lucide-react";
import { AnimatedCard, PageTransition } from "@/components/animated-card";

export default function Home() {
  const { user } = useUser();

  return (
    <PageTransition>
      <>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-purple-50 to-white dark:from-slate-950 dark:to-slate-900">
          <div className="container flex flex-col items-center justify-center px-4 py-20 md:py-32">
            <div className="flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 dark:bg-purple-900/30">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                AI-Powered Interior Design
              </span>
            </div>

            <h1 className="mt-8 max-w-3xl text-center text-4xl font-bold tracking-tight md:text-6xl">
              Transform Your Room in{" "}
              <span className="text-purple-600 dark:text-purple-400">
                Seconds
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-center text-lg text-slate-600 dark:text-slate-300">
              Upload a photo of your space and let our AI generate stunning
              design variations. Privacy-first, instant results, 4-8 unique
              options every time.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {user ? (
                <Link href="/generate">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Generate Designs <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/generate">
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            {/* Decorative gradient */}
            <div className="pointer-events-none absolute -right-1/2 top-1/2 h-96 w-96 bg-purple-200 opacity-20 blur-3xl dark:bg-purple-900 dark:opacity-10" />
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-950 md:py-32">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Why Choose Magic Room?
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Professional-grade AI design with privacy at its core
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <AnimatedCard className="p-8 dark:border-slate-700" delay={0.1}>
                <Lock className="h-8 w-8 text-purple-600" />
                <h3 className="mt-4 text-lg font-semibold">Privacy First</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Your images are automatically deleted after processing. We
                  never store personal data.
                </p>
              </AnimatedCard>

              {/* Feature 2 */}
              <AnimatedCard className="p-8 dark:border-slate-700" delay={0.2}>
                <Zap className="h-8 w-8 text-purple-600" />
                <h3 className="mt-4 text-lg font-semibold">Lightning Fast</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Get 4-8 design variations in 30-60 seconds. No waiting, no
                  queues.
                </p>
              </AnimatedCard>

              {/* Feature 3 */}
              <AnimatedCard className="p-8 dark:border-slate-700" delay={0.3}>
                <Sparkles className="h-8 w-8 text-purple-600" />
                <h3 className="mt-4 text-lg font-semibold">AI-Powered</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Built on SDXL Lightning, the fastest photorealistic design
                  model available.
                </p>
              </AnimatedCard>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="border-t border-slate-200 bg-slate-50 py-20 dark:border-slate-800 dark:bg-slate-950 md:py-32">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Simple, Transparent Pricing
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Start free, upgrade when you're ready
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {/* Free Plan */}
              <Card className="flex flex-col p-8 dark:border-slate-700">
                <h3 className="text-lg font-semibold">Free Trial</h3>
                <p className="mt-2 text-3xl font-bold">
                  1{" "}
                  <span className="text-lg text-slate-600 dark:text-slate-400">
                    credit
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Perfect to try it out
                </p>

                <Button className="mt-6 w-full" variant="outline">
                  Get Started
                </Button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">1 design generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">4-8 variations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">All room types</span>
                  </div>
                </div>
              </Card>

              {/* Pro Plan */}
              <Card className="relative flex flex-col border-purple-500 bg-gradient-to-b from-purple-50 to-white p-8 dark:border-purple-600 dark:from-purple-950/30 dark:to-slate-900">
                <div className="absolute -top-3 left-4 inline-block bg-purple-600 px-4 py-1 text-sm font-semibold text-white rounded-full">
                  Popular
                </div>

                <h3 className="text-lg font-semibold">Pro Pack</h3>
                <p className="mt-2 text-3xl font-bold">
                  150{" "}
                  <span className="text-lg text-slate-600 dark:text-slate-400">
                    credits
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  $19.99 one-time
                </p>

                <Button className="mt-6 w-full bg-purple-600 hover:bg-purple-700">
                  Buy Credits
                </Button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">150 generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">50 requests/hour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority processing</span>
                  </div>
                </div>
              </Card>

              {/* Ultimate Plan */}
              <Card className="flex flex-col p-8 dark:border-slate-700">
                <h3 className="text-lg font-semibold">Ultimate Pack</h3>
                <p className="mt-2 text-3xl font-bold">
                  300{" "}
                  <span className="text-lg text-slate-600 dark:text-slate-400">
                    credits
                  </span>
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  $29.99 one-time
                </p>

                <Button className="mt-6 w-full" variant="outline">
                  Buy Credits
                </Button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">300 generations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited requests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Bulk discount</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-950 md:py-32">
          <div className="container px-4 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to Transform Your Space?
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Start with your free credit today
            </p>

            <Link href={user ? "/generate" : "/generate"}>
              <Button
                size="lg"
                className="mt-8 bg-purple-600 hover:bg-purple-700"
              >
                Generate Your First Design
              </Button>
            </Link>
          </div>
        </section>
      </>
    </PageTransition>
  );
}

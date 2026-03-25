"use client";

import React from "react";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Twitter, Linkedin } from "lucide-react";

export function AboutContent() {
  return (
    <>
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <BreadcrumbNav
          items={[
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
          ]}
        />

        <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">
          About Magic Room
        </h1>

        {/* Mission */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Our Mission
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Magic Room exists for one reason: to make professional-quality
            interior design accessible to everyone. Hiring an interior designer
            can cost thousands of dollars and take weeks. We believe anyone
            should be able to visualize a beautifully designed room in under a
            minute — no budget required.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Upload a photo of any room, pick a style, and our AI returns a
            redesigned version in seconds. It&apos;s that simple.
          </p>
        </section>

        {/* Founder */}
        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            The Founder
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Hi, I&apos;m{" "}
            <strong className="text-slate-900 dark:text-white">
              Thanos Kazakis
            </strong>{" "}
            — a software developer building at the intersection of AI and
            design. I started Magic Room because I kept seeing the same problem:
            great AI models existed, but nobody had made interior design
            genuinely easy to use. I built the tool I wished existed.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="https://x.com/KazakisThanos"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Twitter className="h-4 w-4" />
                @KazakisThanos
              </Button>
            </Link>
            <Link
              href="https://github.com/ThanosKa/magic-room"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            </Link>
            <Link
              href="https://www.linkedin.com/in/thanos-kazakis-922977205/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Magic Room is powered by{" "}
            <strong className="text-slate-900 dark:text-white">
              Google Gemini
            </strong>{" "}
            — a state-of-the-art multimodal AI that understands both images and
            text. When you upload a photo, it&apos;s sent directly to the model
            alongside your chosen style. The AI analyzes the room&apos;s
            structure, lighting, and proportions, then generates a redesigned
            version that respects the original layout.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            We take privacy seriously. Your images are processed entirely
            in-memory and never stored on our servers. We retain only your email
            address and credit balance — nothing else.
          </p>
        </section>

        {/* Why build this */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Why Build This?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Professional interior design should not be a luxury reserved for
            people with large budgets. Whether you&apos;re renting a studio
            apartment or planning a full home renovation, you deserve to see
            your options before committing. Magic Room lowers that barrier from
            thousands of dollars to a few credits.
          </p>
        </section>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/generate">
            <Button
              size="lg"
              className="h-12 bg-primary px-8 text-lg hover:bg-primary/90 text-white"
            >
              Try Magic Room for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <CtaSection
        heading="Ready to redesign your space?"
        subtext="Upload a photo of any room and see it transformed in under a minute."
        primaryLabel="Try for Free"
        primaryHref="/generate"
        secondaryLabel="View Pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}

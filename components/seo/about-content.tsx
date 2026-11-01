"use client";

import React from "react";
import Link from "next/link";
import { CtaSection } from "@/components/seo/cta-section";
import {
    ComparisonHero,
    H1_CLASS,
    H2_CLASS,
    PageBreadcrumb,
    Section,
} from "@/components/seo/comparison-layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Twitter, Linkedin } from "lucide-react";

const PROSE = "mt-5 text-lg leading-relaxed text-ink-2 text-pretty";
const STRONG = "font-medium text-ink";

export function AboutContent() {
  return (
    <>
      <PageBreadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <ComparisonHero>
        <h1 className={H1_CLASS}>About Magic Room</h1>
      </ComparisonHero>

      {/* Mission */}
      <Section>
        <div className="max-w-3xl">
          <h2 className={H2_CLASS}>Our Mission</h2>
          <p className={PROSE}>
            Magic Room exists for one reason: to make professional-quality
            interior design accessible to everyone. Hiring an interior designer
            can cost thousands of dollars and take weeks. We believe anyone
            should be able to visualize a beautifully designed room in under a
            minute — no budget required.
          </p>
          <p className={PROSE}>
            Upload a photo of any room, pick a style, and our AI returns a
            redesigned version in seconds. It&apos;s that simple.
          </p>
        </div>
      </Section>

      {/* Founder */}
      <Section tone="band">
        <div className="max-w-3xl">
          <h2 className={H2_CLASS}>The Founder</h2>
          <p className={PROSE}>
            Hi, I&apos;m <strong className={STRONG}>Thanos Kazakis</strong> — a
            software developer building at the intersection of AI and design. I
            started Magic Room because I kept seeing the same problem: great AI
            models existed, but nobody had made interior design genuinely easy
            to use. I built the tool I wished existed.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link
                href="https://x.com/KazakisThanos"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="size-4" />
                @KazakisThanos
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link
                href="https://github.com/ThanosKa/magic-room"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" />
                GitHub
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link
                href="https://www.linkedin.com/in/thanos-kazakis-922977205/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="size-4" />
                LinkedIn
              </Link>
            </Button>
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section rule={false}>
        <div className="max-w-3xl">
          <h2 className={H2_CLASS}>How It Works</h2>
          <p className={PROSE}>
            Magic Room is powered by{" "}
            <strong className={STRONG}>Google Gemini and OpenAI image models</strong> —
            state-of-the-art multimodal AI that understands both images and
            text. When you upload a photo, it&apos;s sent directly to the model
            alongside your chosen style. The AI analyzes the room&apos;s
            structure, lighting, and proportions, then generates a redesigned
            version that respects the original layout.
          </p>
          <p className={PROSE}>
            We take privacy seriously. Your images are processed entirely
            in-memory and never stored on our servers. We retain only your email
            address and credit balance — nothing else.
          </p>
        </div>
      </Section>

      {/* Why build this */}
      <Section>
        <div className="max-w-3xl">
          <h2 className={H2_CLASS}>Why Build This?</h2>
          <p className={PROSE}>
            Professional interior design should not be a luxury reserved for
            people with large budgets. Whether you&apos;re renting a studio
            apartment or planning a full home renovation, you deserve to see
            your options before committing. Magic Room lowers that barrier from
            thousands of dollars to a few credits.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/generate">
                Try Magic Room for Free
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Section>

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

"use client";

import React from "react";
import Link from "next/link";
import { IBlogPost, IBlogSection } from "@/lib/seo/blog-data";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
import { PageTransition } from "@/components/page-transition";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BlogPostContentProps {
    post: IBlogPost;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function renderSection(section: IBlogSection, index: number): React.ReactNode {
    switch (section.type) {
        case "paragraph":
            return (
                <p key={index} className="text-slate-600 dark:text-slate-400">
                    {section.content}
                </p>
            );
        case "h2":
            return (
                <h2
                    key={index}
                    className="text-2xl font-bold text-slate-900 dark:text-white"
                >
                    {section.text}
                </h2>
            );
        case "h3":
            return (
                <h3
                    key={index}
                    className="text-xl font-semibold text-slate-900 dark:text-white"
                >
                    {section.text}
                </h3>
            );
        case "ordered-list":
            return (
                <ol key={index} className="list-decimal space-y-2 pl-6 text-slate-600 dark:text-slate-400">
                    {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ol>
            );
        case "unordered-list":
            return (
                <ul key={index} className="list-disc space-y-2 pl-6 text-slate-600 dark:text-slate-400">
                    {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            );
        case "cta":
            return (
                <div
                    key={index}
                    className="rounded-lg border border-primary/20 bg-primary/5 p-6 dark:bg-primary/10"
                >
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                        {section.heading}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {section.subtext}
                    </p>
                    <Link href="/generate" className="mt-4 inline-block">
                        <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                            Get started
                            <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            );
        default:
            return null;
    }
}

export function BlogPostContent({ post }: BlogPostContentProps) {
    const breadcrumbItems = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: post.title, href: `/blog/${post.slug}` },
    ];

    // Insert CTA after the 4th section
    const sectionsWithCta = post.sections;

    return (
        <PageTransition>
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="container px-4 md:px-6">
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
            </div>

            {/* Article */}
            <article className="bg-white py-12 dark:bg-slate-950 md:py-16">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl">
                        {/* Header */}
                        <header className="mb-10">
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
                                {post.title}
                            </h1>
                            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <span>Magic Room Team</span>
                                <span aria-hidden="true">·</span>
                                <time dateTime={post.publishedDate}>
                                    {formatDate(post.publishedDate)}
                                </time>
                                <span aria-hidden="true">·</span>
                                <span>{post.readingTime} min read</span>
                            </div>
                        </header>

                        {/* Body */}
                        <div className="space-y-6">
                            {sectionsWithCta.map((section, index) => renderSection(section, index))}
                        </div>

                        {/* Related design pages */}
                        {post.relatedDesignSlugs.length > 0 && (
                            <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Related design tools
                                </h3>
                                <ul className="mt-3 space-y-2">
                                    {post.relatedDesignSlugs.map((slug) => (
                                        <li key={slug}>
                                            <Link
                                                href={`/design/${slug}`}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                {slug
                                                    .split("-")
                                                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                                                    .join(" ")}{" "}
                                                Design Ideas
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </article>

            {/* FAQ */}
            {post.faqs && post.faqs.length > 0 && (
                <section className="bg-slate-50 py-12 dark:bg-slate-900/50 md:py-16">
                    <div className="container px-4 md:px-6">
                        <div className="mx-auto max-w-3xl">
                            <h2 className="mb-8 text-2xl font-bold text-slate-900 dark:text-white">
                                Frequently asked questions
                            </h2>
                            <Accordion type="single" collapsible className="space-y-2">
                                {post.faqs.map((faq, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`faq-${index}`}
                                        className="rounded-lg border border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <AccordionTrigger className="text-left text-sm font-medium text-slate-900 hover:no-underline dark:text-white">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-sm text-slate-600 dark:text-slate-400">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </div>
                </section>
            )}

            <CtaSection
                heading="Generate your room redesign"
                subtext="Upload a photo and see your room transformed in any design style. One free credit with every account."
            />
        </PageTransition>
    );
}

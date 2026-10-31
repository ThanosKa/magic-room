"use client";

import React from "react";
import Link from "next/link";
import { IBlogPost, IBlogSection } from "@/lib/seo/blog-data";
import { IContextualLink } from "@/lib/seo/internal-links";
import { humanizeDesignSlug } from "@/lib/seo/slug-format";
import { isPriorityDesignSlug } from "@/lib/seo/priority-pages";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { CtaSection } from "@/components/seo/cta-section";
import { RelatedLinks } from "@/components/seo/related-links";
import { PageTransition } from "@/components/page-transition";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface BlogPostContentProps {
    post: IBlogPost;
    relatedPostLinks?: IContextualLink[];
    comparisonLinks?: IContextualLink[];
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// Reading column: about 68 characters per line, the measure long-form type is
// comfortable at. Header, body and related designs share the same left edge.
const MEASURE = "max-w-[68ch]";

// Body copy is ink at 82% rather than ink-2 (68%): long articles read better
// with a little more contrast than the short secondary text elsewhere.
const BODY_TEXT = "text-[17px] leading-[1.72] text-ink/[0.82] md:text-[18px]";

function renderSection(section: IBlogSection, index: number): React.ReactNode {
    switch (section.type) {
        case "paragraph":
            return (
                <p key={index} className={`${BODY_TEXT} text-pretty`}>
                    {section.content}
                </p>
            );
        case "h2":
            return (
                <h2
                    key={index}
                    className="mt-8 font-serif text-[clamp(30px,3.4vw,42px)] font-normal leading-[1.05] tracking-[-0.02em] text-ink text-balance first:mt-0"
                >
                    {section.text}
                </h2>
            );
        case "h3":
            return (
                <h3
                    key={index}
                    className="mt-4 font-serif text-[clamp(24px,2.4vw,28px)] font-normal leading-[1.15] tracking-[-0.015em] text-ink text-balance first:mt-0"
                >
                    {section.text}
                </h3>
            );
        case "ordered-list":
            return (
                <ol key={index} className={`${BODY_TEXT} list-decimal space-y-2.5 pl-6 marker:text-ink-3`}>
                    {section.items.map((item, i) => (
                        <li key={i} className="pl-1.5">
                            {item}
                        </li>
                    ))}
                </ol>
            );
        case "unordered-list":
            return (
                <ul key={index} className={`${BODY_TEXT} list-disc space-y-2.5 pl-6 marker:text-ink-3`}>
                    {section.items.map((item, i) => (
                        <li key={i} className="pl-1.5">
                            {item}
                        </li>
                    ))}
                </ul>
            );
        case "cta":
            return (
                <div
                    key={index}
                    className="my-4 flex flex-col gap-5 rounded-xl border border-line bg-paper-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:p-7"
                >
                    <div>
                        <h3 className="font-serif text-[26px] font-normal leading-[1.1] tracking-[-0.015em] text-ink text-balance">
                            {section.heading}
                        </h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{section.subtext}</p>
                    </div>
                    <Button asChild className="group shrink-0 gap-2 self-start sm:self-auto">
                        <Link href="/generate">
                            Get started
                            <ArrowRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-[3px] motion-reduce:transition-none"
                            />
                        </Link>
                    </Button>
                </div>
            );
        case "table":
            return (
                // Scrolls inside its own hairline box on narrow screens, never the page.
                <div key={index} className="my-2 overflow-x-auto rounded-xl border border-line bg-background">
                    <table className="w-full min-w-[600px] border-collapse text-left text-[15px] leading-snug">
                        <thead className="bg-paper-2">
                            <tr>
                                {section.headers.map((header, i) => (
                                    <th
                                        key={i}
                                        className="border-b border-line px-4 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-3"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {section.rows.map((row, ri) => (
                                <tr key={ri} className="border-b border-line last:border-0">
                                    {row.map((cell, ci) => (
                                        <td
                                            key={ci}
                                            className={
                                                ci === 0
                                                    ? "px-4 py-3 align-top font-medium text-ink"
                                                    : "px-4 py-3 align-top text-ink-2"
                                            }
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        case "blockquote":
            return (
                <blockquote key={index} className="my-4 border-l-2 border-accent pl-6">
                    <p className="font-serif text-[clamp(24px,2.6vw,30px)] italic leading-[1.25] tracking-[-0.01em] text-ink text-pretty">
                        &ldquo;{section.quote}&rdquo;
                    </p>
                    <footer className="mt-3 text-sm text-ink-3">— {section.attribution}</footer>
                </blockquote>
            );
        default:
            return null;
    }
}

export function BlogPostContent({ post, relatedPostLinks = [], comparisonLinks = [] }: BlogPostContentProps) {
    const breadcrumbItems = [
        { name: "Home", href: "/" },
        { name: "Blog", href: "/blog" },
        { name: post.title, href: `/blog/${post.slug}` },
    ];

    // Only link indexable design pages (pruned combos are noindex; lib/seo/pruned.ts).
    const linkedDesignSlugs = post.relatedDesignSlugs.filter(isPriorityDesignSlug);

    // Insert CTA after the 4th section
    const sectionsWithCta = post.sections;

    return (
        <PageTransition>
            {/* Every block sits in the same centred 5xl column as RelatedLinks,
                so breadcrumb, article, link lists and FAQ share one left edge. */}
            <div className="container-page">
                <div className="mx-auto max-w-5xl">
                    <BreadcrumbNav items={breadcrumbItems} />
                </div>
            </div>

            {/* Article */}
            <article className="container-page pb-16 pt-8 md:pb-24 md:pt-14">
                <div className="mx-auto max-w-5xl">
                    {/* Header */}
                    <header className="mb-10 max-w-4xl md:mb-14">
                        <h1 className="animate-rise font-serif text-[clamp(42px,5.6vw,80px)] font-normal leading-[0.98] tracking-[-0.025em] text-ink text-balance">
                            {post.title}
                        </h1>
                        <div
                            className="mt-6 flex animate-rise flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium tracking-[0.01em] text-ink-3"
                            style={{ animationDelay: "90ms" }}
                        >
                            <span className="whitespace-nowrap text-ink-2">{post.authorName ?? "Thanos Kazakis"}</span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={post.publishedDate} className="whitespace-nowrap">
                                {formatDate(post.publishedDate)}
                            </time>
                            {post.updatedDate && post.updatedDate !== post.publishedDate && (
                                <>
                                    <span aria-hidden="true">·</span>
                                    <span className="whitespace-nowrap">
                                        Updated <time dateTime={post.updatedDate}>{formatDate(post.updatedDate)}</time>
                                    </span>
                                </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span className="whitespace-nowrap">{post.readingTime} min read</span>
                        </div>
                    </header>

                    {/* Body */}
                    <div className={`${MEASURE} flex flex-col gap-6 border-t border-line pt-10 md:pt-12`}>
                        {sectionsWithCta.map((section, index) => renderSection(section, index))}
                    </div>

                    {/* Related design pages.
                    Anchor now carries the target page's real query phrase
                    ("Modern Living Room design ideas") rather than a
                    generic call to action. */}
                    {linkedDesignSlugs.length > 0 && (
                        <div className={`${MEASURE} mt-14 border-t border-line pt-8`}>
                            <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink-3">
                                Try these designs on your own room
                            </h3>
                            <ul className="mt-4 flex flex-wrap gap-2.5">
                                {linkedDesignSlugs.map((slug) => (
                                    <li key={slug}>
                                        <Link
                                            href={`/design/${slug}`}
                                            className="inline-flex min-h-10 items-center rounded-full bg-ink/5 px-4 text-sm tracking-[-0.005em] text-ink transition-[background-color,transform] duration-160 ease-out hover:bg-ink/10 active:scale-[0.97] motion-reduce:transition-none"
                                        >
                                            {humanizeDesignSlug(slug)} design ideas
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </article>

            {/* Blog -> blog. Every post previously had exactly one inbound
                internal link (the /blog index), which is the reason the whole
                blog cluster sat in "Discovered - currently not indexed". */}
            <RelatedLinks heading="Related guides" links={relatedPostLinks} className="bg-paper-2 py-16 md:py-24" />

            {/* Blog -> comparison cluster, with query-phrase anchors.
                The old block linked to /alternatives/[slug] using the anchor
                "Magic Room vs [name]", which is the /vs/[slug] page's query
                phrase — the anchor text and the target were mismatched on every
                one of the 13 posts. */}
            <RelatedLinks
                heading="Compare AI interior design tools"
                intro="Magic Room is one of several AI room redesign tools. These pages break down the differences in AI model, photo retention, and what a given number of designs actually costs."
                links={comparisonLinks}
                className="bg-background py-16 md:py-24"
            />

            {/* FAQ, in the homepage FAQ layout (title left and sticky, list right). */}
            {post.faqs && post.faqs.length > 0 && (
                <section className="border-t border-line bg-background py-16 md:py-24">
                    <div className="container-page">
                        <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-[72px]">
                            <h2 className="max-w-[14ch] font-serif text-[clamp(36px,4vw,56px)] font-normal leading-none tracking-[-0.022em] text-ink text-balance lg:sticky lg:top-28">
                                Frequently asked questions
                            </h2>
                            <Accordion type="single" collapsible className="w-full border-t border-line">
                                {post.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`}>
                                        <AccordionTrigger className="min-h-[72px] py-[18px] text-[clamp(20px,1.9vw,26px)] leading-[1.15]">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="max-w-[58ch] text-base leading-relaxed">
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

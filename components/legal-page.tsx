import React from "react";
import { PageTransition } from "@/components/page-transition";
import { cn } from "@/lib/utils";

/*
 * Shared layout for the privacy and terms pages: serif title and "last
 * updated" line on the left (sticky from 1024px), the text in one readable
 * column on the right. The pages pass plain <section>/<h2>/<h3>/<p>/<ul>/<a>
 * markup; all typography comes from the descendant rules below, so the page
 * files carry text only.
 */
const proseClasses = cn(
  // Body
  "max-w-[68ch] text-[16.5px] leading-[1.7] text-ink-2",
  // Sections: hairline between them, even rhythm inside
  "[&>section+section]:mt-12 [&>section+section]:border-t [&>section+section]:border-line [&>section+section]:pt-12",
  "[&_section>*+*]:mt-4",
  // Headings
  "[&_h2]:font-serif [&_h2]:text-[clamp(28px,3vw,36px)] [&_h2]:leading-[1.1] [&_h2]:tracking-[-0.015em] [&_h2]:text-ink",
  "[&_section>h2+*]:mt-6",
  "[&_h3]:text-[17px] [&_h3]:font-medium [&_h3]:leading-snug [&_h3]:text-ink",
  "[&_section>h3]:mt-8 [&_section>h2+h3]:mt-6 [&_section>h3+*]:mt-3",
  // Lists, emphasis, links
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:marker:text-ink-3 [&_li]:pl-1 [&_li+li]:mt-2",
  "[&_strong]:font-medium [&_strong]:text-ink",
  "[&_a]:text-ink [&_a]:underline [&_a]:decoration-ink/30 [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a]:transition-[text-decoration-color] [&_a]:duration-160 [&_a]:ease-out [&_a]:hover:decoration-ink motion-reduce:[&_a]:transition-none"
);

interface LegalPageProps {
  title: string;
  /** The "Last Updated: …" line, rendered as the page's first h2. */
  updated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <PageTransition>
      <article className="container-page pb-24 pt-10 md:pb-32 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16">
          <header className="lg:sticky lg:top-32 lg:self-start">
            <h1 className="font-serif text-[clamp(48px,6vw,88px)] leading-[0.95] tracking-[-0.025em] text-ink">
              {title}
            </h1>
            <h2 className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink/5 px-3.5 py-1.5 text-[13px] font-medium text-ink-2">
              <span aria-hidden className="size-1.5 rounded-full bg-accent" />
              {updated}
            </h2>
          </header>
          <div className={proseClasses}>{children}</div>
        </div>
      </article>
    </PageTransition>
  );
}

/** Paragraph style for the opening paragraph of a legal page. */
export const legalLeadClass = "text-[19px] leading-[1.6] text-ink";

/** The contact box at the end of a legal page. */
export const legalContactClass =
  "space-y-1 rounded-xl border border-line bg-paper-2 p-6 text-ink";

import type { ReactNode } from "react";

export interface FaqSectionItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FaqSectionItem[];
  /** Small label above the heading. */
  label?: string;
  /** The H2. Wrap a part in <em> for the italic serif emphasis. */
  heading?: ReactNode;
  id?: string;
}

/**
 * Two-column FAQ: sticky serif heading on the left (from 1024px), questions on
 * the right. Native <details>, so every answer is in the HTML (the FAQPage
 * JSON-LD on the same page must match visible text) and it works without JS.
 * The + turns into an × when a question is open.
 */
export function FAQSection({
  items,
  label = "Questions",
  heading = (
    <>
      Asked <em>often.</em>
    </>
  ),
  id = "faq-title",
}: FAQSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="bg-background pb-22 pt-[72px] sm:pb-26 lg:pb-38"
    >
      <div className="container-page grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-[72px]">
        <div className="lg:sticky lg:top-30">
          <p
            data-reveal
            className="mb-[22px] flex items-center gap-3 text-xs font-medium uppercase tracking-[0.18em] text-ink-3 before:h-px before:w-7 before:bg-current before:content-['']"
          >
            {label}
          </p>
          <h2
            id={id}
            data-reveal
            className="font-serif text-[clamp(40px,4.3vw,66px)] font-normal leading-none tracking-[-0.022em] text-ink [&_em]:italic [&_em]:text-ink-3"
          >
            {heading}
          </h2>
        </div>
        <div className="border-t border-line">
          {items.map((item) => (
            <details
              key={item.question}
              className="group border-b border-line"
            >
              <summary className="flex min-h-[76px] cursor-pointer list-none items-center justify-between gap-6 py-[18px] font-serif text-[clamp(22px,2vw,28px)] leading-[1.15] tracking-[-0.01em] text-ink transition-colors duration-200 hover:text-ink-2 motion-reduce:transition-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="relative size-3.5 flex-none transition-transform duration-350 ease-out group-open:rotate-45 motion-reduce:transition-none before:absolute before:left-0 before:top-[6.25px] before:h-[1.5px] before:w-3.5 before:bg-ink before:content-[''] after:absolute after:left-0 after:top-[6.25px] after:h-[1.5px] after:w-3.5 after:rotate-90 after:bg-ink after:content-['']"
                />
              </summary>
              <p className="mb-7 max-w-[58ch] pr-8 text-base leading-relaxed text-ink-2 group-open:animate-fade">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

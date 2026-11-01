"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

/**
 * Shown over the user's photo while the redesign is being made (30 to 60 s,
 * about 2 minutes on Ultra). Status lines appear on a schedule measured from
 * the start time and stretched to the tier's usual wait, so the screen is right
 * again as soon as a background tab comes back to the front.
 */

// The step times below are written for a one-minute wait.
const BASE_SECONDS = 60;

function waitSteps(styleName: string) {
    return [
        { at: 0, text: "Sending your photo" },
        { at: 4, text: "Reading the room's layout and light" },
        { at: 12, text: `Restyling it as ${styleName}` },
        { at: 24, text: "Placing furniture, materials and colour" },
        { at: 38, text: "Adding the finishing details" },
        { at: 55, text: "Taking a little longer than usual. Nearly there" },
    ];
}

function useElapsedSeconds(startedAt: number): number {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const tick = () => setNow(Date.now());
        const id = window.setInterval(tick, 1000);
        document.addEventListener("visibilitychange", tick);
        return () => {
            window.clearInterval(id);
            document.removeEventListener("visibilitychange", tick);
        };
    }, []);
    return Math.max(0, Math.floor((now - startedAt) / 1000));
}

function clock(seconds: number): string {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function WaitState({
    startedAt,
    styleName,
    expectedSeconds = BASE_SECONDS,
    expectedText = "30 to 60 seconds",
}: {
    startedAt: number;
    styleName: string;
    /** The tier's usual wait. */
    expectedSeconds?: number;
    /** The same wait in words: "30 to 60 seconds", "about 2 minutes". */
    expectedText?: string;
}) {
    const elapsed = useElapsedSeconds(startedAt);
    const pace = expectedSeconds / BASE_SECONDS;
    const steps = waitSteps(styleName).map((s) => ({ ...s, at: Math.round(s.at * pace) }));
    const reached = steps.filter((s) => elapsed >= s.at);
    const current = reached[reached.length - 1];
    const progress = Math.min(0.95, elapsed / expectedSeconds);

    return (
        <div className="w-full max-w-sm animate-lift-in rounded-xl bg-paper/95 p-5 shadow-float backdrop-blur-md sm:p-6">
            <div className="flex items-baseline justify-between gap-4">
                <p className="font-serif text-[26px] leading-none tracking-[-0.02em] text-ink">Designing your room</p>
                <span className="text-sm font-medium text-accent tabular-nums" aria-hidden="true">
                    {clock(elapsed)}
                </span>
            </div>

            <div className="mt-4 h-0.5 overflow-hidden rounded-full bg-ink/10" aria-hidden="true">
                <div
                    className="h-full origin-left rounded-full bg-accent transition-transform duration-1000 ease-linear motion-reduce:transition-none"
                    style={{ transform: `scaleX(${progress})` }}
                />
            </div>

            <ol className="mt-4 space-y-2 text-[14px] tracking-[-0.01em]">
                {reached.map((step) => {
                    const done = step !== current;
                    return (
                        <li
                            key={step.at}
                            className="flex animate-fade items-center gap-2.5 motion-reduce:animate-none"
                        >
                            {done ? (
                                <Check aria-hidden="true" className="size-3.5 shrink-0 text-ink-3" strokeWidth={2.5} />
                            ) : (
                                <span aria-hidden="true" className="mx-1 size-1.5 shrink-0 rounded-full bg-accent" />
                            )}
                            <span className={done ? "text-ink-3" : "text-ink"}>{step.text}</span>
                        </li>
                    );
                })}
            </ol>

            {/* One polite announcement per new line, not per second. */}
            <p className="sr-only" role="status" aria-live="polite">
                {current.text}
            </p>

            <p className="mt-4 border-t border-line pt-3 text-[13px] leading-snug text-ink-2">
                This usually takes {expectedText}. You can switch tabs; your design will be here when you come back.
            </p>
        </div>
    );
}

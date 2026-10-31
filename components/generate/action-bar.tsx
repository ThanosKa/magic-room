"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NOTE_MAX_LENGTH, QUALITY_OPTIONS } from "@/lib/constants";
import { cn, formatCredits } from "@/lib/utils";
import { useKeyboardInset } from "@/components/generate/use-keyboard-inset";
import type { Quality } from "@/types";

/*
 * The sticky bar at the bottom of the tool. It holds every choice that changes
 * the cost (quality) or the request (note), a summary of the room and style,
 * the message slot and the Generate button, so the price is always on screen
 * next to the button.
 *
 * Phone: two rows (quality; summary + note link + button), stuck to the bottom
 * of the screen. Desktop: one row in a floating card.
 */

const focusRingClass =
    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring";

interface ActionBarProps {
    quality: Quality;
    onQualityChange: (value: Quality) => void;
    note: string;
    onNoteChange: (value: string) => void;
    /** "Living Room · Modern" */
    summary: string;
    /** Locked while a design is being made. */
    generating: boolean;
    hasResult: boolean;
    canGenerate: boolean;
    onGenerate: () => void;
    /** What goes in the message slot right above the button. */
    messages: React.ReactNode;
}

export function ActionBar({
    quality,
    onQualityChange,
    note,
    onNoteChange,
    summary,
    generating,
    hasResult,
    canGenerate,
    onGenerate,
    messages,
}: ActionBarProps) {
    const [noteOpen, setNoteOpen] = useState(false);
    const [noteFocused, setNoteFocused] = useState(false);
    const noteRef = useRef<HTMLTextAreaElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    // Where focus goes after the note opens or closes (only after a click).
    const focusNext = useRef<"note" | "toggle" | null>(null);
    const keyboardInset = useKeyboardInset(noteOpen && noteFocused);
    const cost = QUALITY_OPTIONS[quality].credits;

    useEffect(() => {
        const target = focusNext.current === "note" ? noteRef.current : focusNext.current === "toggle" ? toggleRef.current : null;
        focusNext.current = null;
        target?.focus();
    }, [noteOpen]);

    const openNote = () => {
        focusNext.current = "note";
        setNoteOpen(true);
    };
    const closeNote = () => {
        focusNext.current = "toggle";
        setNoteFocused(false);
        setNoteOpen(false);
    };

    return (
        <div
            data-action-bar
            style={keyboardInset ? { bottom: keyboardInset } : undefined}
            className={cn(
                "sticky bottom-0 z-30 -mx-5 mt-8 border-t border-line bg-paper px-5 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6",
                "lg:bottom-4 lg:mx-0 lg:mt-12 lg:rounded-2xl lg:border lg:px-5 lg:py-4 lg:shadow-float"
            )}
        >
            {noteOpen && (
                <fieldset
                    disabled={generating}
                    className="mb-3 min-w-0 animate-lift-in motion-reduce:animate-none lg:max-w-2xl"
                >
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                        <label htmlFor="generate-note" className="text-[14px] font-medium tracking-[-0.01em] text-ink">
                            Note <span className="font-normal text-ink-3">(optional)</span>
                        </label>
                        <span className="flex items-center gap-2">
                            <span className="text-xs text-ink-3 tabular-nums" aria-hidden="true">
                                {note.length}/{NOTE_MAX_LENGTH}
                            </span>
                            <Button type="button" variant="ghost" size="sm" onClick={closeNote} className="-mr-2 h-8 px-3">
                                Done
                            </Button>
                        </span>
                    </div>
                    <Textarea
                        ref={noteRef}
                        id="generate-note"
                        value={note}
                        maxLength={NOTE_MAX_LENGTH}
                        rows={2}
                        onChange={(e) => onNoteChange(e.target.value)}
                        onFocus={() => setNoteFocused(true)}
                        onBlur={() => setNoteFocused(false)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") closeNote();
                        }}
                        placeholder="For example: a green sofa, more plants, warm lighting"
                        aria-describedby="generate-note-hint"
                        className="max-h-28 min-h-16 resize-none py-2.5"
                    />
                    <p id="generate-note-hint" className="mt-1.5 text-xs text-ink-3 max-sm:sr-only">
                        Up to {NOTE_MAX_LENGTH} characters. Leave it empty to let the style decide.
                    </p>
                </fieldset>
            )}

            <div
                id="generate-message"
                role="status"
                aria-live="polite"
                className="empty:hidden mb-3 space-y-2 lg:ml-auto lg:max-w-xl"
            >
                {messages}
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 lg:grid-cols-[auto_auto_minmax(0,1fr)_auto]">
                <QualitySwitch value={quality} onChange={onQualityChange} disabled={generating} />

                <div className="min-w-0 lg:contents">
                    <p
                        className="truncate text-[13px] font-medium leading-snug text-ink lg:order-3 lg:text-right lg:text-[14px]"
                        title={summary}
                    >
                        {summary}
                    </p>
                    <button
                        ref={toggleRef}
                        type="button"
                        onClick={noteOpen ? closeNote : openNote}
                        disabled={generating}
                        aria-expanded={noteOpen}
                        aria-controls={noteOpen ? "generate-note" : undefined}
                        className={cn(
                            "-ml-2 inline-flex h-8 cursor-pointer select-none items-center gap-1.5 rounded-full px-2 text-[13px] font-medium tracking-[-0.01em] text-ink transition-[background-color,transform] duration-160 ease-out hover:bg-ink/5 active:scale-[0.97] motion-reduce:transition-none",
                            "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
                            "lg:order-2 lg:ml-0 lg:h-10 lg:px-3.5 lg:text-[14px]"
                        )}
                    >
                        {noteOpen ? (
                            <>
                                <ChevronDown aria-hidden="true" className="size-4" />
                                Hide note
                            </>
                        ) : note.trim() ? (
                            <>
                                <Pencil aria-hidden="true" className="size-3.5" />
                                Edit note
                            </>
                        ) : (
                            <>
                                <Plus aria-hidden="true" className="size-4" />
                                Add a note
                            </>
                        )}
                    </button>
                </div>

                <Button
                    size="lg"
                    onClick={onGenerate}
                    disabled={!canGenerate}
                    aria-describedby="generate-message"
                    className="gap-2.5 px-5 lg:order-4 lg:min-w-[200px]"
                >
                    {generating ? (
                        <>
                            <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
                            Generating…
                        </>
                    ) : (
                        <>
                            {hasResult ? "Regenerate" : "Generate"}
                            <span className="rounded-full bg-cream/15 px-2 py-0.5 text-[12px] font-medium tabular-nums">
                                {formatCredits(cost)}
                            </span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

/** Standard / Premium as one segmented control (a native radio group), each with its cost. */
function QualitySwitch({
    value,
    onChange,
    disabled,
}: {
    value: Quality;
    onChange: (value: Quality) => void;
    disabled: boolean;
}) {
    return (
        <fieldset disabled={disabled} className="col-span-2 min-w-0 lg:order-1 lg:col-span-1">
            <legend className="sr-only">Quality</legend>
            <div className="grid grid-cols-2 rounded-full bg-ink/5 p-1 lg:inline-grid">
                {Object.values(QUALITY_OPTIONS).map((q) => {
                    const selected = value === q.id;
                    return (
                        <label
                            key={q.id}
                            title={q.description}
                            className={cn(
                                "inline-flex h-9 cursor-pointer select-none items-center justify-center gap-1.5 rounded-full px-3.5 text-[14px] tracking-[-0.01em] transition-[background-color,color,box-shadow] duration-160 ease-out motion-reduce:transition-none",
                                "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60",
                                focusRingClass,
                                selected ? "bg-paper text-ink shadow-float" : "text-ink-2 hover:text-ink"
                            )}
                        >
                            <input
                                type="radio"
                                name="quality"
                                value={q.id}
                                checked={selected}
                                onChange={() => onChange(q.id)}
                                className="sr-only"
                            />
                            <span className="font-medium">{q.id === "standard" ? "Standard" : "Premium"}</span>
                            <span className="text-[13px] text-ink-3 tabular-nums">{formatCredits(q.credits)}</span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}

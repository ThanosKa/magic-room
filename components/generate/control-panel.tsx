"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ChevronDown, ChevronUp, Loader2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NOTE_MAX_LENGTH, QUALITY_OPTIONS } from "@/lib/constants";
import { cn, formatCredits } from "@/lib/utils";
import { useKeyboardInset } from "@/components/generate/use-keyboard-inset";
import { QualitySwitch, RoomTypePicker, StylePicker } from "@/components/generate/option-pickers";
import type { Quality, RoomType, Theme } from "@/types";

/*
 * Every choice of the tool in one panel: room type, style, quality and the
 * note in a body that scrolls on its own, then a footer that never leaves the
 * screen with the message slot and the Generate button (with its cost).
 *
 * Desktop (>= 1024): a column beside the photo canvas, as tall as the canvas.
 * Phone: a bottom sheet. Collapsed it is only the footer (a summary of the
 * choices, the message slot and Generate); tapping or swiping the summary up
 * slides the body up from behind the footer. The body moves with `transform`
 * only (CSS transition); while a finger drags, it follows the finger directly
 * and the release snaps it open or shut with the same transition, so no
 * animation library is needed.
 */

const DESKTOP = "(min-width: 1024px)";
// A drag past a quarter of the body, or a flick faster than this (px/ms), opens or closes the sheet.
const FLICK_VELOCITY = 0.11;
const DRAG_SLOP = 6;

interface ControlPanelProps {
    roomType: RoomType;
    onRoomTypeChange: (value: RoomType) => void;
    theme: Theme;
    onThemeChange: (value: Theme) => void;
    quality: Quality;
    onQualityChange: (value: Quality) => void;
    note: string;
    onNoteChange: (value: string) => void;
    /** "Bedroom · Japandi · Standard" */
    summary: string;
    /** Locked while a design is being made. */
    generating: boolean;
    hasResult: boolean;
    canGenerate: boolean;
    onGenerate: () => void;
    /** What goes in the message slot right above the button. */
    messages: React.ReactNode;
    className?: string;
}

export function ControlPanel({
    roomType,
    onRoomTypeChange,
    theme,
    onThemeChange,
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
    className,
}: ControlPanelProps) {
    const [expanded, setExpandedState] = useState(false);
    // The open sheet is `fixed` to the bottom of the screen (wherever the page
    // was scrolled); its slot keeps the height it had so the page does not move.
    const [slotHeight, setSlotHeight] = useState<number | undefined>(undefined);
    const slotRef = useRef<HTMLDivElement>(null);
    const setExpanded = (open: boolean) => {
        if (open && slotRef.current) setSlotHeight(slotRef.current.offsetHeight);
        setExpandedState(open);
    };
    const [noteOpen, setNoteOpen] = useState(false);
    const [noteFocused, setNoteFocused] = useState(false);
    const bodyRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const noteRef = useRef<HTMLTextAreaElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    // Where focus goes after the note opens or closes (only after a click).
    const focusNext = useRef<"note" | "toggle" | null>(null);
    const keyboardInset = useKeyboardInset(noteOpen && noteFocused);
    const cost = QUALITY_OPTIONS[quality].credits;

    useEffect(() => {
        const target =
            focusNext.current === "note" ? noteRef.current : focusNext.current === "toggle" ? toggleRef.current : null;
        focusNext.current = null;
        target?.focus();
        if (target === noteRef.current) noteRef.current?.scrollIntoView?.({ block: "nearest" });
    }, [noteOpen]);

    // The open sheet holds the page still (the page behind is dimmed), on phones only.
    useEffect(() => {
        if (!expanded || window.matchMedia?.(DESKTOP).matches) return;
        const html = document.documentElement;
        const previous = html.style.overflow;
        html.style.overflow = "hidden";
        return () => {
            html.style.overflow = previous;
        };
    }, [expanded]);

    const openNote = () => {
        focusNext.current = "note";
        setNoteOpen(true);
    };
    const closeNote = () => {
        focusNext.current = "toggle";
        setNoteFocused(false);
        setNoteOpen(false);
    };

    const generate = () => {
        // The wait shows on the photo: get the sheet out of its way.
        setExpanded(false);
        onGenerate();
    };

    const drag = useSheetDrag({ bodyRef, backdropRef, expanded, setExpanded });

    return (
        <div
            ref={slotRef}
            style={expanded ? { minHeight: slotHeight } : undefined}
            className={cn(
                // Phone: stuck to the bottom of the screen, at the end of the tool.
                "sticky bottom-0 -mx-5 mt-auto sm:-mx-6",
                expanded ? "z-50" : "z-30",
                "lg:static lg:z-auto lg:mx-0 lg:mt-0 lg:flex lg:min-h-0 lg:flex-col",
                className,
            )}
        >
            <aside
                data-control-panel
                data-sheet={expanded ? "expanded" : "collapsed"}
                aria-label="Your choices"
                onKeyDown={(e) => {
                    if (e.key === "Escape" && expanded) setExpanded(false);
                }}
                style={
                    keyboardInset
                        ? ({
                              bottom: keyboardInset,
                              "--kb": `${keyboardInset}px`,
                          } as React.CSSProperties)
                        : undefined
                }
                className={cn(
                    "relative",
                    expanded && "max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0",
                    "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-clip lg:rounded-3xl lg:border lg:border-line lg:bg-paper",
                )}
            >
                {/* Phone only: dims the page behind the open sheet; a tap closes it. */}
                <div
                    ref={backdropRef}
                    aria-hidden="true"
                    onClick={() => setExpanded(false)}
                    className={cn(
                        "fixed inset-0 bg-night/40 transition-opacity duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none lg:hidden",
                        expanded ? "opacity-100" : "pointer-events-none opacity-0",
                    )}
                />

                <div
                    ref={bodyRef}
                    id="generate-choices"
                    data-panel-body
                    className={cn(
                        // Phone: a layer resting on top of the footer, slid down behind it when collapsed.
                        "absolute inset-x-0 bottom-full flex max-h-[calc(100svh-100%-76px-var(--kb,0px))] flex-col rounded-t-3xl bg-paper shadow-float",
                        "transition-[transform,visibility] duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-[visibility]",
                        !expanded && "translate-y-full invisible",
                        "lg:visible lg:static lg:max-h-none lg:min-h-0 lg:flex-1 lg:translate-y-0 lg:rounded-none lg:shadow-none lg:transition-none",
                    )}
                >
                    {/* Drag down (or tap) to close. */}
                    <div
                        aria-hidden="true"
                        {...drag.handleProps}
                        onClick={() => drag.tap(() => setExpanded(false))}
                        className="grid h-7 shrink-0 cursor-grab touch-none place-items-center lg:hidden"
                    >
                        <span className="h-1 w-10 rounded-full bg-ink/20" />
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-6 lg:px-5 lg:pt-5">
                        {/* Locked while a design is being made. */}
                        <fieldset disabled={generating} className="min-w-0 space-y-7">
                            <legend className="sr-only">Your choices</legend>
                            <RoomTypePicker value={roomType} onChange={onRoomTypeChange} />
                            <StylePicker value={theme} onChange={onThemeChange} />
                            <QualitySwitch value={quality} onChange={onQualityChange} />

                            <div className="min-w-0">
                                <button
                                    ref={toggleRef}
                                    type="button"
                                    onClick={noteOpen ? closeNote : openNote}
                                    aria-expanded={noteOpen}
                                    aria-controls={noteOpen ? "generate-note" : undefined}
                                    className={cn(
                                        "-ml-3 inline-flex h-10 cursor-pointer select-none items-center gap-1.5 rounded-full px-3 text-[14px] font-medium tracking-[-0.01em] text-ink transition-[background-color,transform] duration-160 ease-out hover:bg-ink/5 active:scale-[0.97] motion-reduce:transition-none",
                                        "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
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

                                {noteOpen && (
                                    <div className="mt-2 animate-lift-in motion-reduce:animate-none">
                                        <div className="mb-1.5 flex items-center justify-between gap-3">
                                            <label
                                                htmlFor="generate-note"
                                                className="text-[14px] font-medium tracking-[-0.01em] text-ink"
                                            >
                                                Note <span className="font-normal text-ink-3">(optional)</span>
                                            </label>
                                            <span className="flex items-center gap-2">
                                                <span className="text-xs text-ink-3 tabular-nums" aria-hidden="true">
                                                    {note.length}/{NOTE_MAX_LENGTH}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={closeNote}
                                                    className="-mr-2 h-8 px-3"
                                                >
                                                    Done
                                                </Button>
                                            </span>
                                        </div>
                                        <Textarea
                                            ref={noteRef}
                                            id="generate-note"
                                            value={note}
                                            maxLength={NOTE_MAX_LENGTH}
                                            rows={3}
                                            onChange={(e) => onNoteChange(e.target.value)}
                                            onFocus={() => setNoteFocused(true)}
                                            onBlur={() => setNoteFocused(false)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Escape") {
                                                    // Closes the note only, not the sheet around it.
                                                    e.stopPropagation();
                                                    closeNote();
                                                }
                                            }}
                                            placeholder="For example: a green sofa, more plants, warm lighting"
                                            aria-describedby="generate-note-hint"
                                            className="max-h-32 min-h-20 resize-none py-2.5"
                                        />
                                        <p id="generate-note-hint" className="mt-1.5 text-xs text-ink-3">
                                            Up to {NOTE_MAX_LENGTH} characters. Leave it empty to let the style decide.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </fieldset>
                    </div>
                </div>

                <div
                    data-panel-footer
                    className={cn(
                        "relative shrink-0 bg-paper px-5 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-6",
                        "border-t border-line",
                        expanded ? "rounded-none" : "rounded-t-3xl shadow-[0_-10px_30px_-14px_rgb(23_20_15/0.22)]",
                        "lg:rounded-none lg:px-5 lg:pb-5 lg:pt-4 lg:shadow-none",
                    )}
                >
                    {/* Phone only: the summary is the sheet's handle (tap, or swipe up and down). */}
                    <button
                        type="button"
                        {...drag.handleProps}
                        onClick={() => drag.tap(() => setExpanded(!expanded))}
                        aria-expanded={expanded}
                        aria-controls="generate-choices"
                        className="relative flex w-full cursor-pointer touch-none select-none flex-col items-stretch pb-3 pt-2 text-left lg:hidden"
                    >
                        <span
                            aria-hidden="true"
                            className={cn(
                                "mx-auto mb-2 h-1 w-10 rounded-full bg-ink/20 transition-opacity duration-200 ease-out motion-reduce:transition-none",
                                // Open, the body's own handle is the one at the top.
                                expanded && "opacity-0"
                            )}
                        />
                        <span className="flex items-center justify-between gap-3">
                            <span className="min-w-0 truncate text-[14px] font-medium tracking-[-0.01em] text-ink">
                                {summary}
                            </span>
                            <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-ink-2">
                                {expanded ? "Done" : "Change"}
                                <ChevronUp
                                    aria-hidden="true"
                                    className={cn(
                                        "size-4 transition-transform duration-[360ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
                                        expanded && "rotate-180",
                                    )}
                                />
                            </span>
                        </span>
                    </button>

                    <div id="generate-message" role="status" aria-live="polite" className="empty:hidden mb-3 space-y-2">
                        {messages}
                    </div>

                    <Button
                        size="lg"
                        onClick={generate}
                        disabled={!canGenerate}
                        aria-describedby="generate-message"
                        className="w-full gap-2.5"
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
            </aside>
        </div>
    );
}

/**
 * Swipe on the sheet's handles (phone only). While a finger drags, the body
 * follows it (inline transform, no transition, no re-render); on release a
 * quarter of the way or a flick decides open or shut, and removing the inline
 * styles lets the class transition carry the body from where the finger left it.
 * A press that does not move stays a tap (the handle's click).
 */
function useSheetDrag({
    bodyRef,
    backdropRef,
    expanded,
    setExpanded,
}: {
    bodyRef: React.RefObject<HTMLDivElement | null>;
    backdropRef: React.RefObject<HTMLDivElement | null>;
    expanded: boolean;
    setExpanded: (open: boolean) => void;
}) {
    const drag = useRef<{
        id: number;
        y0: number;
        t0: number;
        height: number;
        moved: boolean;
    } | null>(null);
    const swallowClick = useRef(false);

    const reset = () => {
        for (const el of [bodyRef.current, backdropRef.current]) {
            if (!el) continue;
            el.style.transition = "";
            el.style.transform = "";
            el.style.opacity = "";
            el.style.visibility = "";
        }
    };

    const onPointerDown = (e: ReactPointerEvent) => {
        // One finger at a time; the desktop panel does not move.
        if (drag.current || e.button !== 0 || window.matchMedia?.(DESKTOP).matches) return;
        const body = bodyRef.current;
        if (!body) return;
        drag.current = {
            id: e.pointerId,
            y0: e.clientY,
            t0: performance.now(),
            height: body.offsetHeight,
            moved: false,
        };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: ReactPointerEvent) => {
        const d = drag.current;
        const body = bodyRef.current;
        if (!d || d.id !== e.pointerId || !body) return;
        const dy = e.clientY - d.y0;
        if (!d.moved && Math.abs(dy) < DRAG_SLOP) return;
        d.moved = true;
        // The body stays attached to the footer: between fully open (0) and fully behind it (its height).
        const offset = Math.min(d.height, Math.max(0, (expanded ? 0 : d.height) + dy));
        body.style.transition = "none";
        body.style.visibility = "visible";
        body.style.transform = `translateY(${offset}px)`;
        const backdrop = backdropRef.current;
        if (backdrop) {
            backdrop.style.transition = "none";
            backdrop.style.opacity = String(1 - offset / Math.max(1, d.height));
        }
    };

    const onPointerEnd = (e: ReactPointerEvent) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        drag.current = null;
        if (!d.moved) return;
        swallowClick.current = true;
        const dy = e.clientY - d.y0;
        const velocity = dy / Math.max(1, performance.now() - d.t0);
        const cancelled = e.type === "pointercancel";
        reset();
        if (cancelled) return;
        if (expanded && (dy > d.height / 4 || velocity > FLICK_VELOCITY)) setExpanded(false);
        if (!expanded && (-dy > d.height / 4 || velocity < -FLICK_VELOCITY)) setExpanded(true);
    };

    return {
        handleProps: {
            onPointerDown,
            onPointerMove,
            onPointerUp: onPointerEnd,
            onPointerCancel: onPointerEnd,
        },
        /** Runs a handle's tap action, unless the click is the end of a drag. */
        tap: (action: () => void) => {
            if (swallowClick.current) {
                swallowClick.current = false;
                return;
            }
            action();
        },
    };
}

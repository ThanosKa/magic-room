"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { NOTE_MAX_LENGTH, QUALITY_OPTIONS, ROOM_TYPES, THEMES } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatCredits } from "@/lib/utils";
import type { Quality, RoomType, Theme } from "@/types";

/*
 * The tool's choices. Each group is a native radio group (arrow keys move the
 * choice, one tab stop per group); the inputs are visually hidden and their
 * labels carry the look, including the focus ring.
 */

const legendClass = "mb-3 flex w-full items-baseline gap-3 text-[15px] font-medium tracking-[-0.01em] text-ink";
const stepNumberClass = "font-serif text-[22px] leading-none text-ink-3 tabular-nums";
const focusRingClass =
    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring";

export function StepTitle({ step, title, aside }: { step: number; title: string; aside?: React.ReactNode }) {
    return (
        <>
            <span className={stepNumberClass} aria-hidden="true">
                {String(step).padStart(2, "0")}
            </span>
            <span>
                <span className="sr-only">Step {step}: </span>
                {title}
            </span>
            {aside && <span className="ml-auto text-sm font-normal text-ink-2">{aside}</span>}
        </>
    );
}

export function RoomTypePicker({
    value,
    onChange,
}: {
    value: RoomType;
    onChange: (value: RoomType) => void;
}) {
    return (
        <fieldset>
            <legend className={legendClass}>
                <StepTitle step={2} title="Room type" />
            </legend>
            <div className="flex flex-wrap gap-2">
                {(Object.entries(ROOM_TYPES) as [RoomType, string][]).map(([id, label]) => (
                    <label
                        key={id}
                        className={cn(
                            "inline-flex min-h-10 cursor-pointer select-none items-center rounded-full border px-4 text-[14px] tracking-[-0.01em] transition-[background-color,border-color,color,transform] duration-160 ease-out active:scale-[0.97] motion-reduce:transition-none",
                            "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:disabled]:active:scale-100",
                            focusRingClass,
                            value === id
                                ? "border-ink bg-ink text-cream"
                                : "border-line bg-paper text-ink hover:border-ink/40"
                        )}
                    >
                        <input
                            type="radio"
                            name="room-type"
                            value={id}
                            checked={value === id}
                            onChange={() => onChange(id)}
                            className="sr-only"
                        />
                        {label}
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

// Every style card shows that style's living-room design image.
function styleImage(theme: Theme): string {
    return `/images/designs/${theme}-living-room.jpg`;
}

export function StylePicker({ value, onChange }: { value: Theme; onChange: (value: Theme) => void }) {
    return (
        <fieldset>
            <legend className={legendClass}>
                <StepTitle step={3} title="Style" aside={THEMES[value]} />
            </legend>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                {(Object.entries(THEMES) as [Theme, string][]).map(([id, label]) => {
                    const selected = value === id;
                    return (
                        <label
                            key={id}
                            className={cn(
                                "group relative flex cursor-pointer select-none flex-col gap-1.5 rounded-lg transition-transform duration-160 ease-out active:scale-[0.97] motion-reduce:transition-none",
                                "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:disabled]:active:scale-100",
                                focusRingClass
                            )}
                        >
                            <input
                                type="radio"
                                name="style"
                                value={id}
                                checked={selected}
                                onChange={() => onChange(id)}
                                className="sr-only"
                            />
                            <span
                                className={cn(
                                    "relative block aspect-[4/3] overflow-hidden rounded-lg bg-paper-2 ring-offset-2 ring-offset-paper transition-shadow duration-160 ease-out motion-reduce:transition-none",
                                    selected ? "ring-2 ring-ink" : "ring-1 ring-line"
                                )}
                            >
                                <Image
                                    src={styleImage(id)}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1280px) 120px, (min-width: 1024px) 150px, (min-width: 640px) 25vw, 33vw"
                                    className={cn(
                                        "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none",
                                        !selected && "group-has-[:disabled]:grayscale-[0.4]"
                                    )}
                                />
                                {selected && (
                                    <span className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-ink text-cream shadow-float">
                                        <Check aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                                    </span>
                                )}
                            </span>
                            <span
                                className={cn(
                                    "truncate px-0.5 text-[13px] tracking-[-0.01em]",
                                    selected ? "font-medium text-ink" : "text-ink-2"
                                )}
                            >
                                {label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}

export function QualityPicker({ value, onChange }: { value: Quality; onChange: (value: Quality) => void }) {
    return (
        <fieldset>
            <legend className={legendClass}>
                <StepTitle step={4} title="Quality" />
            </legend>
            <div className="grid grid-cols-2 gap-2.5">
                {Object.values(QUALITY_OPTIONS).map((q) => {
                    const selected = value === q.id;
                    return (
                        <label
                            key={q.id}
                            className={cn(
                                "flex cursor-pointer select-none flex-col gap-0.5 rounded-lg border px-4 py-3 transition-[border-color,background-color,transform] duration-160 ease-out active:scale-[0.97] motion-reduce:transition-none",
                                "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:disabled]:active:scale-100",
                                focusRingClass,
                                selected ? "border-ink bg-paper-2" : "border-line bg-paper hover:border-ink/40"
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
                            <span className="flex items-baseline justify-between gap-2 text-[15px] font-medium tracking-[-0.01em] text-ink">
                                {q.id === "standard" ? "Standard" : "Premium"}
                                <span className="text-[13px] font-normal text-ink-2 tabular-nums">
                                    {formatCredits(q.credits)}
                                </span>
                            </span>
                            <span className="text-[13px] text-ink-3">{q.description}</span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}

export function NoteField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
                <label htmlFor="generate-note" className="text-[15px] font-medium tracking-[-0.01em] text-ink">
                    Note <span className="font-normal text-ink-3">(optional)</span>
                </label>
                <span className="text-xs text-ink-3 tabular-nums" aria-hidden="true">
                    {value.length}/{NOTE_MAX_LENGTH}
                </span>
            </div>
            <Textarea
                id="generate-note"
                value={value}
                maxLength={NOTE_MAX_LENGTH}
                onChange={(e) => onChange(e.target.value)}
                placeholder="For example: a green sofa, more plants, warm lighting"
                aria-describedby="generate-note-hint"
                className="min-h-20 resize-none"
            />
            <p id="generate-note-hint" className="mt-1.5 text-xs text-ink-3">
                Up to {NOTE_MAX_LENGTH} characters. Leave it empty to let the style decide.
            </p>
        </div>
    );
}

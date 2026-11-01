"use client";

import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { QUALITY_OPTIONS, ROOM_TYPES, THEMES } from "@/lib/constants";
import { cn, formatCredits } from "@/lib/utils";
import type { Quality, RoomType, Theme } from "@/types";

/*
 * The tool's choices, as they sit in the control panel: room type (a native
 * select, compact and the phone's own picker), style (a picture grid) and
 * quality (a segmented control). Style and quality are native radio groups
 * (arrow keys move the choice, one tab stop per group); their inputs are
 * visually hidden and the labels carry the look, including the focus ring.
 */

export const groupTitleClass = "text-[14px] font-medium tracking-[-0.01em] text-ink";
const focusRingClass =
    "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring";

export function RoomTypePicker({
    value,
    onChange,
}: {
    value: RoomType;
    onChange: (value: RoomType) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <label htmlFor="generate-room" className={groupTitleClass}>
                Room type
            </label>
            <span className="relative min-w-0 flex-1 sm:max-w-[220px]">
                <select
                    id="generate-room"
                    value={value}
                    onChange={(e) => onChange(e.target.value as RoomType)}
                    className={cn(
                        "h-11 w-full cursor-pointer appearance-none truncate rounded-full border border-input bg-paper pl-4 pr-10 text-[15px] tracking-[-0.01em] text-ink transition-[border-color] duration-160 ease-out hover:border-ink/40 motion-reduce:transition-none",
                        "disabled:cursor-not-allowed disabled:opacity-60"
                    )}
                >
                    {(Object.entries(ROOM_TYPES) as [RoomType, string][]).map(([id, label]) => (
                        <option key={id} value={id}>
                            {label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-2"
                />
            </span>
        </div>
    );
}

// Every style card shows that style's living-room design image.
function styleImage(theme: Theme): string {
    return `/images/designs/${theme}-living-room.jpg`;
}

export function StylePicker({ value, onChange }: { value: Theme; onChange: (value: Theme) => void }) {
    return (
        <fieldset className="min-w-0">
            <legend className={cn(groupTitleClass, "mb-3 flex w-full items-baseline justify-between gap-3")}>
                <span>Style</span>
                <span className="text-[13px] font-normal text-ink-2">{THEMES[value]}</span>
            </legend>
            <div className="grid grid-cols-3 gap-x-2 gap-y-3 sm:grid-cols-4 lg:grid-cols-3">
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
                                    sizes="(min-width: 1024px) 112px, (min-width: 640px) 25vw, 33vw"
                                    className={cn("object-cover", !selected && "group-has-[:disabled]:grayscale-[0.4]")}
                                />
                                {selected && (
                                    <span className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-ink text-cream shadow-float">
                                        <Check aria-hidden="true" className="size-3" strokeWidth={2.5} />
                                    </span>
                                )}
                            </span>
                            <span
                                className={cn(
                                    "line-clamp-2 px-0.5 text-[12px] leading-tight tracking-[-0.01em]",
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

export const QUALITY_NAMES: Record<Quality, string> = {
    standard: QUALITY_OPTIONS.standard.name,
    premium: QUALITY_OPTIONS.premium.name,
    ultra: QUALITY_OPTIONS.ultra.name,
};

/** Quick / Pro / Ultra as one segmented control (a native radio group), each with its cost. */
export function QualitySwitch({ value, onChange }: { value: Quality; onChange: (value: Quality) => void }) {
    return (
        <fieldset className="min-w-0">
            <legend className={cn(groupTitleClass, "mb-3")}>Quality</legend>
            <div className="grid grid-cols-3 rounded-full bg-ink/5 p-1">
                {Object.values(QUALITY_OPTIONS).map((q) => {
                    const selected = value === q.id;
                    return (
                        <label
                            key={q.id}
                            title={q.description}
                            className={cn(
                                // `relative` keeps the hidden radio inside the label: without it the radio
                                // sits outside the panel's scroll area and focusing it scrolls the page.
                                "relative inline-flex h-11 cursor-pointer select-none flex-col items-center justify-center rounded-full px-2 text-[14px] leading-tight tracking-[-0.01em] transition-[background-color,color,box-shadow] duration-160 ease-out motion-reduce:transition-none",
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
                            <span className="font-medium">{QUALITY_NAMES[q.id]}</span>
                            <span className="text-[12px] text-ink-3 tabular-nums">{formatCredits(q.credits)}</span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}

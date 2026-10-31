"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { ROOM_TYPES, THEMES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { RoomType, Theme } from "@/types";

/*
 * The tool's choices on the page (quality and the note live in the action bar). Each group is a native radio group (arrow keys move the
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
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-5 lg:gap-2 xl:grid-cols-7">
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
                                    sizes="(min-width: 1280px) 90px, (min-width: 1024px) 100px, (min-width: 640px) 25vw, 33vw"
                                    className={cn(
                                        "object-cover",
                                        !selected && "group-has-[:disabled]:grayscale-[0.4]"
                                    )}
                                />
                                {selected && (
                                    <span className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-ink text-cream shadow-float lg:right-1 lg:top-1 lg:size-5">
                                        <Check aria-hidden="true" className="size-3.5 lg:size-3" strokeWidth={2.5} />
                                    </span>
                                )}
                            </span>
                            <span
                                className={cn(
                                    "line-clamp-2 px-0.5 text-[13px] leading-tight tracking-[-0.01em] lg:text-[12px] xl:text-[11px] xl:tracking-[-0.02em]",
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

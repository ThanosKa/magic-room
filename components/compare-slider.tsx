"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface CompareImage {
    src: string;
    alt: string;
    /** Shown instead if `src` fails to load. */
    fallback?: string;
}

export interface CompareSliderProps {
    before: CompareImage;
    after: CompareImage;
    /**
     * Aspect ratio of the frame as a number (`width / height` of the photo, e.g.
     * a portrait upload). Without it the frame is 4:3, or whatever an `aspect-*`
     * class in `className` says (responsive classes work).
     */
    aspectRatio?: number;
    /** next/image `sizes` for both images. */
    sizes?: string;
    /** Preload both images (above-the-fold sliders only). */
    priority?: boolean;
    /** Accessible name of the slider. */
    label?: string;
    /** Width, radius, aspect, margins. The slider fills its width; the aspect ratio sets the height. */
    className?: string;
}

const STEP = 5;
const BIG_STEP = 10;
const TOUCH_SLOP = 6; // px a finger must move sideways (more than up/down) to start dragging
const TAP_RADIUS = 10; // px a finger may wobble and still count as a tap
const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * Before/after comparison. Drag (mouse, pen or one finger), tap, or use the
 * keyboard on the hidden native range: arrows move 5%, Shift+arrows and
 * Page Up/Down 10%, Home/End jump to the edges. Styles live in app/motion.css.
 */
export function CompareSlider({
    before,
    after,
    aspectRatio,
    sizes = "100vw",
    priority = false,
    label = "Compare before and after",
    className,
}: CompareSliderProps) {
    const [pos, setPos] = useState(50);
    const box = useRef<HTMLDivElement>(null);
    // The one pointer allowed to drag; any other finger is ignored until it lifts.
    // `engaged` is false while a finger has not yet shown it is moving sideways.
    const drag = useRef<{ id: number; x0: number; y0: number; engaged: boolean } | null>(null);
    const value = Math.round(pos);

    const setFromX = (clientX: number) => {
        const r = box.current?.getBoundingClientRect();
        if (!r || r.width === 0) return;
        setPos(clamp(((clientX - r.left) / r.width) * 100));
    };

    const end = (e: PointerEvent) => {
        if (drag.current?.id === e.pointerId) drag.current = null;
    };

    const onPointerDown = (e: PointerEvent) => {
        if (drag.current || e.button !== 0) return;
        // A mouse or pen jumps straight to the press. A finger waits for a
        // sideways move or a tap, so starting a page scroll on the image does
        // not jump the divider (the browser keeps vertical pans: touch-action: pan-y).
        const touch = e.pointerType === "touch";
        drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, engaged: !touch };
        e.currentTarget.setPointerCapture?.(e.pointerId);
        if (!touch) setFromX(e.clientX);
    };

    const onPointerMove = (e: PointerEvent) => {
        const d = drag.current;
        if (d?.id !== e.pointerId) return;
        if (!d.engaged) {
            const dx = Math.abs(e.clientX - d.x0);
            const dy = Math.abs(e.clientY - d.y0);
            if (dx < TOUCH_SLOP || dx <= dy) return;
            d.engaged = true;
        }
        setFromX(e.clientX);
    };

    const onPointerUp = (e: PointerEvent) => {
        const d = drag.current;
        if (d?.id !== e.pointerId) return;
        const tap = Math.hypot(e.clientX - d.x0, e.clientY - d.y0) < TAP_RADIUS;
        if (d.engaged || tap) setFromX(e.clientX);
        end(e);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const step = e.shiftKey ? BIG_STEP : STEP;
        const next: Record<string, number> = {
            ArrowLeft: value - step,
            ArrowDown: value - step,
            ArrowRight: value + step,
            ArrowUp: value + step,
            PageDown: value - BIG_STEP,
            PageUp: value + BIG_STEP,
            Home: 0,
            End: 100,
        };
        if (!(e.key in next)) return;
        e.preventDefault(); // the native range would step by 1 on top of ours
        setPos(clamp(next[e.key]));
    };

    return (
        <div
            ref={box}
            data-compare=""
            className={cn("compare aspect-[4/3]", className)}
            style={{ "--pos": `${pos}%`, aspectRatio } as CSSProperties}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={end}
        >
            <CompareLayer image={after} sizes={sizes} priority={priority} />
            <div className="compare-before">
                <CompareLayer image={before} sizes={sizes} priority={priority} />
            </div>
            <span className="compare-tag compare-tag-left">Before</span>
            <span className="compare-tag compare-tag-right">After</span>
            <div className="compare-handle" aria-hidden="true">
                <span className="compare-knob">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M7 5l-4 5 4 5M13 5l4 5-4 5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>
            <input
                className="compare-range"
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(e) => setPos(Number(e.target.value))}
                onKeyDown={onKeyDown}
                aria-label={label}
                aria-valuetext={`${value}% before, ${100 - value}% after`}
            />
        </div>
    );
}

function CompareLayer({ image, sizes, priority }: { image: CompareImage; sizes: string; priority: boolean }) {
    // Remember which src failed, so a new src (e.g. a new result) is tried again.
    const [failed, setFailed] = useState<string | null>(null);
    const src = failed === image.src && image.fallback ? image.fallback : image.src;
    return (
        <Image
            src={src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
            onError={() => setFailed(image.src)}
        />
    );
}

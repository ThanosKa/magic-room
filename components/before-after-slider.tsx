"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    className?: string;
}

export function BeforeAfterSlider({
    beforeImage,
    afterImage,
    className = "",
}: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    const handleTouchStart = () => {
        setIsResizing(true);
    };

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent | MouseEvent) => {
        if (!isResizing || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
    }, [isResizing]);

    const handleTouchMove = useCallback((e: React.TouchEvent | TouchEvent) => {
        if (!isResizing || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const touchX = e instanceof TouchEvent ? e.touches[0].clientX : (e as React.TouchEvent).touches[0].clientX;
        const x = Math.max(0, Math.min(touchX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("touchend", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isResizing, handleMouseMove, handleTouchMove, handleMouseUp]);

    return (
        <div
            ref={containerRef}
            className={`relative select-none overflow-hidden rounded-xl border border-slate-200 shadow-2xl dark:border-slate-800 ${className}`}
        >
            <div className="absolute inset-0">
                <Image
                    src={afterImage}
                    alt="After design"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute top-4 right-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    After
                </div>
            </div>

            <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <Image
                    src={beforeImage}
                    alt="Before design"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    Before
                </div>
            </div>

            <div
                className="absolute inset-y-0 w-1 bg-white cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div className="absolute top-1/2 -ml-4 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg text-purple-600">
                    <MoveHorizontal className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
}

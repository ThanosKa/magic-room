"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
    gradientSize?: number;
    gradientColor?: string;
    gradientOpacity?: number;
}

export function MagicCard({
    children,
    className,
    gradientSize = 200,
    gradientColor = "#8B5CF6", // Purple-500
    gradientOpacity = 0.1, // Subtle for light mode
    ...props
}: MagicCardProps) {
    const mouseX = useMotionValue(-gradientSize);
    const mouseY = useMotionValue(-gradientSize);

    function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    }

    function handleMouseLeave() {
        mouseX.set(-gradientSize);
        mouseY.set(-gradientSize);
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group relative flex h-full w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
                className
            )}
            {...props}
        >
            <div className="relative z-10 h-full w-full">{children}</div>
            <motion.div
                className="pointer-events-none absolute -inset-px z-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              ${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 100%
            )
          `,
                    opacity: gradientOpacity,
                }}
            />
        </div>
    );
}

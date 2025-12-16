"use client";

import Image from "next/image";

interface HeroComparisonProps {
    beforeImage: string;
    afterImage: string;
    className?: string;
}

export function HeroComparison({
    beforeImage,
    afterImage,
    className = "",
}: HeroComparisonProps) {
    return (
        <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
            {/* Before Image */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="absolute left-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    Before
                </div>
                <div className="aspect-[4/3] w-full relative">
                    <Image
                        src={beforeImage}
                        alt="Original room"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* After Image */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="absolute right-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white backdrop-blur shadow-sm">
                    After
                </div>
                <div className="aspect-[4/3] w-full relative">
                    <Image
                        src={afterImage}
                        alt="After"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    );
}

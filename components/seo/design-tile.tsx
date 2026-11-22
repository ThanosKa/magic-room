import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DesignTileProps {
    href: string;
    image: string;
    title: string;
    description: string;
    sizes: string;
    aspect?: string;
}

export function DesignTile({
    href,
    image,
    title,
    description,
    sizes,
    aspect = "aspect-[4/5]",
}: DesignTileProps) {
    return (
        <Link
            href={href}
            className="group block rounded-xl transition-transform duration-160 ease-out active:scale-[0.98] motion-reduce:transition-none"
        >
            <div className={cn("relative overflow-hidden rounded-xl bg-paper-2", aspect)}>
                <Image
                    src={image}
                    alt=""
                    fill
                    sizes={sizes}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                />
            </div>
            <div className="mt-3.5 flex items-start justify-between gap-3">
                <h3 className="font-serif text-[20px] font-normal leading-[1.1] tracking-[-0.015em] text-ink text-balance sm:text-[23px]">
                    {title}
                </h3>
                <ArrowUpRight
                    aria-hidden="true"
                    className="mt-0.5 size-[18px] shrink-0 text-ink-3 transition-[transform,color] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none"
                />
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-2 text-pretty">{description}</p>
        </Link>
    );
}

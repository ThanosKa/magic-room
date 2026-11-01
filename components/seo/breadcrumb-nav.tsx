import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbNavProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
    return (
        <nav aria-label="Breadcrumb" className="py-4">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] tracking-[-0.005em] text-ink-3">
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-2">
                        {index > 0 && (
                            <span className="text-ink/25" aria-hidden="true">
                                /
                            </span>
                        )}
                        {index === items.length - 1 ? (
                            <span className="text-ink-2" aria-current="page">
                                {item.name}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="inline-flex min-h-6 items-center rounded-sm underline decoration-transparent decoration-1 underline-offset-4 transition-[color,text-decoration-color] duration-200 ease-out hover:text-ink hover:decoration-ink/35 motion-reduce:transition-none"
                            >
                                {item.name}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

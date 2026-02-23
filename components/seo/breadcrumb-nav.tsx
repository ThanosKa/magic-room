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
            <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-1">
                        {index > 0 && (
                            <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
                                /
                            </span>
                        )}
                        {index === items.length - 1 ? (
                            <span className="text-slate-700 dark:text-slate-300" aria-current="page">
                                {item.name}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="hover:text-primary transition-colors"
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

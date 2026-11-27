import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { IBlogPost } from "@/lib/seo/blog-data";
import { formatPostDate } from "@/lib/seo/post-date";

interface BlogCardProps {
    post: IBlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group block rounded-xl transition-transform duration-160 ease-out active:scale-[0.98] motion-reduce:transition-none"
        >
            <Card className="h-full transition-colors duration-300 ease-out group-hover:border-ink/25 group-hover:bg-paper motion-reduce:transition-none">
                <CardContent className="flex h-full flex-col p-6">
                    <h2 className="font-serif text-[24px] font-normal leading-[1.08] tracking-[-0.015em] text-ink text-balance">
                        {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-2">
                        {post.excerpt}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-4 text-xs font-medium tracking-[0.02em] text-ink-3">
                        <time dateTime={post.publishedDate} className="whitespace-nowrap">{formatPostDate(post.publishedDate)}</time>
                        <span aria-hidden="true">·</span>
                        <span className="whitespace-nowrap">{post.readingTime} min read</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

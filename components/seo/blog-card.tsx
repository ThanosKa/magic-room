import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { IBlogPost } from "@/lib/seo/blog-data";

interface BlogCardProps {
    post: IBlogPost;
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`}>
            <Card className="h-full border-slate-200 bg-white transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex h-full flex-col p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm text-slate-600 dark:text-slate-400">
                        {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
                        <span aria-hidden="true">·</span>
                        <span>{post.readingTime} min read</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

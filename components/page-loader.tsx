"use client";

import { Loader2 } from "lucide-react";

export function PageLoader() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}

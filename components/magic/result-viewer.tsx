"use client";

import { cn } from "@/lib/utils";
import { Download, RefreshCw, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface MagicResultViewerProps {
    originalImage?: string;
    resultImage: string;
    onGenerateAgain: () => void;
    className?: string;
}

export function MagicResultViewer({
    originalImage,
    resultImage,
    onGenerateAgain,
    className,
}: MagicResultViewerProps) {
    const [showOriginal, setShowOriginal] = useState(false);

    const handleDownload = async () => {
        try {
            const response = await fetch(resultImage);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `magic-room-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success("Design saved to downloads");
        } catch (err) {
            toast.error("Failed to download image");
        }
    };

    return (
        <div className={cn("relative h-full w-full overflow-hidden rounded-2xl bg-slate-100 shadow-2xl dark:bg-slate-900", className)}>
            <div className="relative h-full w-full">
                {/* Main Image Display */}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={showOriginal ? "original" : "result"}
                        src={showOriginal ? originalImage : resultImage}
                        alt={showOriginal ? "Original Room" : "Redesigned Room"}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="h-full w-full object-cover"
                    />
                </AnimatePresence>

                {/* Top Controls Overlay */}
                <div className="absolute left-0 right-0 top-0 flex justify-between bg-gradient-to-b from-black/50 to-transparent p-6 text-white opacity-0 transition-opacity hover:opacity-100">
                    <div className="flex items-center gap-2">
                        <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-medium backdrop-blur-md">
                            {showOriginal ? "Original" : "Generative AI Result"}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {originalImage && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
                                onMouseDown={() => setShowOriginal(true)}
                                onMouseUp={() => setShowOriginal(false)}
                                onTouchStart={() => setShowOriginal(true)}
                                onTouchEnd={() => setShowOriginal(false)}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Hold to Compare
                            </Button>
                        )}
                    </div>
                </div>

                {/* Bottom Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Your Dream Room</h3>
                        <p className="text-sm text-white/80">generated with Gemini 2.5</p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={onGenerateAgain}
                            className="border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/60 hover:text-white"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            New Design
                        </Button>

                        <Button
                            size="lg"
                            onClick={handleDownload}
                            className="bg-white text-black hover:bg-slate-200"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { cn } from "@/lib/utils";
import { Upload, X, FileImage, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { fileToBase64 } from "@/lib/supabase-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    onFileSelect: (base64: string) => void;
    className?: string;
}

export function MagicFileUpload({ onFileSelect, className }: FileUploadProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            if (file.size > 10 * 1024 * 1024) {
                toast.error("File is too large (max 10MB)");
                return;
            }

            try {
                const base64 = await fileToBase64(file);
                setPreview(base64);
                onFileSelect(base64);
                toast.success("Image uploaded!");
            } catch (err) {
                toast.error("Failed to process image");
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
        maxFiles: 1,
        multiple: false,
    });

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onFileSelect(""); // Clear in parent
    };

    return (
        <div
            className={cn("relative w-full transition-all duration-300", className)}
        >
            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key="upload-zone"
                    >
                        <div
                            {...getRootProps()}
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                            className={cn(
                                "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center transition-all duration-300 hover:border-purple-400 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-purple-600 dark:hover:bg-slate-900",
                                isDragActive &&
                                "border-purple-500 bg-purple-50 scale-[1.02] shadow-2xl dark:bg-purple-950/20"
                            )}
                        >
                            <input {...getInputProps()} />

                            {/* Animated Icon */}
                            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100 transition-transform group-hover:scale-110 dark:bg-slate-800 dark:ring-slate-700">
                                <div className="absolute inset-0 animate-pulse rounded-full bg-purple-100 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-purple-900/30" />
                                <Upload className="h-10 w-10 text-purple-600 transition-colors group-hover:text-purple-700 dark:text-purple-400" />
                                {isDragActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white"
                                    >
                                        <Sparkles className="h-4 w-4" />
                                    </motion.div>
                                )}
                            </div>

                            {/* Text */}
                            <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Upload your room
                            </h3>
                            <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                                Drag & drop your photo here, or click to browse.
                                <br />
                                JPG, PNG, WebP up to 10MB
                            </p>

                            {/* Fake Button for affordance */}
                            <div className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform group-hover:translate-y-[-2px] group-hover:shadow-xl dark:bg-white dark:text-slate-900">
                                Select Photo
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key="preview-zone"
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950"
                    >
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                            <img
                                src={preview}
                                alt="Preview"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={handleClear}
                                className="absolute right-4 top-4 h-8 w-8 rounded-full shadow-lg opacity-0 transition-all group-hover:opacity-100 hover:scale-110"
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                                <FileImage className="h-4 w-4" />
                                <span className="text-sm font-medium">Original Image</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

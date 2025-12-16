"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { useGenerationStore } from "@/stores/generation-store";
import { AuthGuard } from "@/components/auth-guard";
import { RoomType, Theme, Quality } from "@/types";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ROOM_TYPES, THEMES } from "@/lib/constants";
import {
    Download,
    RefreshCw,
    Loader2,
    ImagePlus,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { fileToBase64 } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";

const THEME_IMAGES: Record<Theme, string> = {
    modern: "/themes/theme_modern.png",
    minimalist: "/themes/theme_minimalist.png",
    scandinavian: "/themes/theme_scandinavian.png",
    industrial: "/themes/theme_industrial.png",
    tropical: "/themes/theme_tropical.png",
    bohemian: "/themes/theme_bohemian.png",
    vintage: "/themes/theme_modern.png",
    luxury: "/themes/theme_modern.png",
};

export default function GenerateContent() {
    return (
        <AuthGuard>
            <GeneratePageContent />
        </AuthGuard>
    );
}

function GeneratePageContent() {
    const { user: clerkUser } = useUser();
    const { credits, refreshUser } = useUserStore();
    const {
        activeGeneration,
        uploadedImageUrl,
        setUploadedImage,
        clearUploadedImage,
        setActiveGeneration,
    } = useGenerationStore();

    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [roomType, setRoomType] = useState<RoomType>("living-room");
    const [quality, setQuality] = useState<Quality>("standard");
    const [theme, setTheme] = useState<Theme>("modern");
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            if (file.size > 10 * 1024 * 1024) {
                return;
            }

            try {
                setActiveGeneration(null);

                const base64 = await fileToBase64(file);
                setUploadedImage(base64, "");
                setOriginalImage(base64);
            } catch {
            }
        },
        [setUploadedImage, setActiveGeneration]
    );

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        open: openUpload,
    } = useDropzone({
        onDrop,
        accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
        maxFiles: 1,
        noClick: true,
        noKeyboard: true,
    });

    const handleGenerate = useCallback(async () => {
        const requiredCredits = quality === "premium" ? 2 : 1;
        if (!originalImage || credits < requiredCredits) {
            return;
        }

        setIsGenerating(true);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    base64Image: originalImage,
                    roomType,
                    theme,
                    quality,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate");
            }

            const data = await response.json();

            if (data.success && data.outputUrls?.length > 0) {
                setActiveGeneration({
                    id: data.predictionId,
                    status: "succeeded",
                    outputUrls: data.outputUrls,
                });
                if (clerkUser?.id) refreshUser(clerkUser.id);
            } else {
                throw new Error(data.error || "No images generated");
            }
        } catch {
        } finally {
            setIsGenerating(false);
        }
    }, [
        originalImage,
        credits,
        roomType,
        theme,
        quality,
        setActiveGeneration,
        clerkUser?.id,
        refreshUser,
    ]);

    const handleReset = useCallback(() => {
        clearUploadedImage();
        setActiveGeneration(null);
        setOriginalImage(null);
        setIsGenerating(false);
    }, [clearUploadedImage, setActiveGeneration]);

    const handleDownload = async () => {
        const url = activeGeneration?.outputUrls?.[0];
        if (!url) return;

        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `magic-room-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
        }
    };

    const hasResult =
        activeGeneration?.status === "succeeded" &&
        activeGeneration.outputUrls?.length;

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8 lg:py-12">
            <div className="mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                    Redesign your <span className="text-primary">room</span> in seconds
                </h1>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
                <div className="space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Design Studio
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Customize your room details below.
                        </p>
                    </div>

                    <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
                        <div className="space-y-3">
                            <div className="text-base font-semibold">1. Room Type</div>
                            <Select
                                value={roomType}
                                onValueChange={(v) => setRoomType(v as RoomType)}
                            >
                                <SelectTrigger className="h-11 cursor-pointer">
                                    <SelectValue placeholder="Select a room type" />
                                </SelectTrigger>
                                <SelectContent position="popper" className="z-[100]">
                                    <SelectGroup>
                                        {Object.entries(ROOM_TYPES).map(([key, label]) => (
                                            <SelectItem
                                                key={key}
                                                value={key}
                                                className="cursor-pointer"
                                            >
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <div className="text-base font-semibold">2. Quality</div>
                            <Select
                                value={quality}
                                onValueChange={(v) => setQuality(v as Quality)}
                            >
                                <SelectTrigger className="h-14 w-full cursor-pointer">
                                    <SelectValue placeholder="Select quality">
                                        {quality === "standard" ? (
                                            <span>Standard Quality <span className="text-muted-foreground">- 1 credit</span></span>
                                        ) : (
                                            <span>Premium Quality <span className="text-muted-foreground">- 2 credits</span></span>
                                        )}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent position="popper" className="z-[100]">
                                    <SelectGroup>
                                        <SelectItem value="standard" className="cursor-pointer">
                                            <div className="flex flex-col">
                                                <span>Standard Quality</span>
                                                <span className="text-muted-foreground text-sm">1 credit</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="premium" className="cursor-pointer">
                                            <div className="flex items-start justify-between w-full">
                                                <div className="flex flex-col">
                                                    <span>Premium Quality</span>
                                                    <span className="text-muted-foreground text-sm">2 credits</span>
                                                </div>
                                                <Badge variant="default" className="ml-2">PREMIUM</Badge>
                                            </div>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <div className="text-base font-semibold">3. Choose Style</div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {Object.entries(THEMES).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => setTheme(key as Theme)}
                                        className={cn(
                                            "group relative flex flex-col overflow-hidden rounded-lg border-2 transition-all hover:border-primary/50 cursor-pointer",
                                            theme === key
                                                ? "border-primary bg-primary/5 ring-0"
                                                : "border-input bg-transparent"
                                        )}
                                    >b
                                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                            <Image
                                                src={THEME_IMAGES[key as Theme]}
                                                alt={label}
                                                fill
                                                className={cn(
                                                    "object-cover transition-transform duration-300 group-hover:scale-110",
                                                    theme !== key && "opacity-80 grayscale-[0.3]"
                                                )}
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                            />
                                            {theme === key && (
                                                <div className="absolute inset-0 bg-primary/10" />
                                            )}
                                        </div>
                                        <div
                                            className={cn(
                                                "w-full py-2 text-center text-xs font-medium transition-colors",
                                                theme === key
                                                    ? "text-primary font-bold"
                                                    : "text-muted-foreground"
                                            )}
                                        >
                                            {label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div
                        {...getRootProps()}
                        className="relative w-full overflow-hidden rounded-2xl border bg-muted/20 shadow-sm min-h-[400px] flex flex-col"
                    >
                        {hasResult ? (
                            <div
                                className="relative group w-full h-full cursor-pointer"
                                onClick={() =>
                                    setFullscreenImage(activeGeneration!.outputUrls![0])
                                }
                            >
                                <Image
                                    src={activeGeneration!.outputUrls![0]}
                                    alt="Generated design"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-contain max-h-[70vh] bg-black/5"
                                />
                                {isGenerating && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="h-12 w-12 animate-spin text-white" />
                                            <p className="text-white font-medium">Loading...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : uploadedImageUrl ? (
                            <div
                                className="relative w-full h-full min-h-[300px] bg-black/5 flex items-center justify-center group cursor-pointer"
                                onClick={() => setFullscreenImage(uploadedImageUrl)}
                            >
                                <Image
                                    src={uploadedImageUrl}
                                    alt="Uploaded room"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto max-h-[60vh] object-contain"
                                />

                                {isGenerating && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="h-12 w-12 animate-spin text-white" />
                                            <p className="text-white font-medium">Loading...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center p-10 text-center transition-all cursor-pointer border-2 border-dashed border-transparent hover:border-primary/20 hover:bg-muted/30",
                                    isDragActive && "border-primary bg-primary/5"
                                )}
                                onClick={openUpload}
                            >
                                <input {...getInputProps()} />
                                <div className="mb-6 rounded-full bg-muted p-6 transition-transform group-hover:scale-110">
                                    <ImagePlus className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold">Upload your room</h3>
                                <p className="mt-2 max-w-sm text-muted-foreground">
                                    Drag & drop an image here, or click to browse.
                                    <br />
                                    We recommend high quality photos.
                                </p>
                                <Button variant="outline" className="mt-8 pointer-events-none">
                                    Select Image
                                </Button>
                            </div>
                        )}
                    </div>

                    {(uploadedImageUrl || hasResult) && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-end gap-3 p-4">
                                {hasResult ? (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={handleReset}
                                            className="cursor-pointer"
                                        >
                                            Upload New
                                        </Button>

                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            onClick={handleDownload}
                                            className="cursor-pointer"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>

                                        <Button
                                            size="lg"
                                            onClick={handleGenerate}
                                            disabled={isGenerating || credits < (quality === "premium" ? 2 : 1)}
                                            className="h-12 bg-primary px-8 text-lg hover:bg-primary/90 text-white cursor-pointer"
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="mr-2 h-4 w-4" />
                                                    Regenerate
                                                </>
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    uploadedImageUrl && (
                                        <div className="flex items-center gap-3 ml-auto">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={handleReset}
                                                className="cursor-pointer"
                                            >
                                                Upload New
                                            </Button>
                                            <Button
                                                size="lg"
                                                className="min-w-[200px] h-12 bg-primary px-8 text-lg hover:bg-primary/90 text-white shadow-lg cursor-pointer"
                                                onClick={handleGenerate}
                                                disabled={isGenerating || credits < (quality === "premium" ? 2 : 1)}
                                            >
                                                {isGenerating ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        Generate Design
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {fullscreenImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setFullscreenImage(null)}
                >
                    <Image
                        src={fullscreenImage}
                        alt="Fullscreen view"
                        width={1024}
                        height={768}
                        className="max-w-full max-h-[90vh] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
}

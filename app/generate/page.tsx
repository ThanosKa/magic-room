"use client";

import React, { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { useGenerationStore } from "@/stores/generation-store";
import { AuthGuard } from "@/components/auth-guard";
import { RoomType, Theme } from "@/types";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROOM_TYPES, THEMES } from "@/lib/constants";
import {
  Upload,
  Download,
  RefreshCw,
  Loader2,
  ImagePlus,
  Wand2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { fileToBase64 } from "@/lib/supabase-client";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Theme images mapping
const THEME_IMAGES: Record<Theme, string> = {
  modern: "/themes/theme_modern.png",
  minimalist: "/themes/theme_minimalist.png",
  scandinavian: "/themes/theme_scandinavian.png",
  industrial: "/themes/theme_industrial.png",
  tropical: "/themes/theme_tropical.png",
  bohemian: "/themes/theme_bohemian.png",
  vintage: "/themes/theme_modern.png", // Fallback
  luxury: "/themes/theme_modern.png", // Fallback
};

export default function GeneratePage() {
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

  // Store the original uploaded image separately
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roomType, setRoomType] = useState<RoomType>("living-room");
  const [theme, setTheme] = useState<Theme>("modern");

  // File upload
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        // toast.error("File is too large (max 10MB)");
        return;
      }

      try {
        // Crucial: Clear previous results when uploading new image
        setActiveGeneration(null);

        const base64 = await fileToBase64(file);
        setUploadedImage(base64, "");
        setOriginalImage(base64); // Store original
        // toast.success("Image uploaded!");
      } catch {
        // toast.error("Failed to process image");
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
    noClick: true, // we trigger manually
    noKeyboard: true,
  });

  // Generate design - ALWAYS use originalImage
  const handleGenerate = useCallback(async () => {
    if (!originalImage || credits < 1) {
      // toast.error("Please upload an image and ensure you have credits");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: originalImage, // Always use original
          roomType,
          theme,
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
        // toast.success("Design generated!");
        if (clerkUser?.id) refreshUser(clerkUser.id);
      } else {
        throw new Error(data.error || "No images generated");
      }
    } catch (err) {
      // toast.error(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setIsGenerating(false);
    }
  }, [
    originalImage,
    credits,
    roomType,
    theme,
    setActiveGeneration,
    clerkUser?.id,
    refreshUser,
  ]);

  // Reset entirely (Clear everything)
  const handleReset = useCallback(() => {
    clearUploadedImage();
    setActiveGeneration(null);
    setOriginalImage(null);
    setIsGenerating(false);
  }, [clearUploadedImage, setActiveGeneration]);

  // Download result
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
      // toast.success("Downloaded!");
    } catch {
      // toast.error("Failed to download");
    }
  };

  const hasResult =
    activeGeneration?.status === "succeeded" &&
    activeGeneration.outputUrls?.length;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 lg:py-12">
      {/* Headline */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Redesign your <span className="text-primary">room</span> in seconds
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
        {/* LEFT COLUMN: Controls */}
        <div className="space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Design Studio
            </h2>
            <p className="mt-2 text-muted-foreground">
              Customize your room details below.
            </p>
          </div>

          {/* Controls Card */}
          <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
            {/* Room Type Select */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">1. Room Type</Label>
              <Select
                value={roomType}
                onValueChange={(v) => setRoomType(v as RoomType)}
              >
                <SelectTrigger className="h-11 cursor-pointer">
                  <SelectValue placeholder="Select a room type" />
                </SelectTrigger>
                <SelectContent>
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

            {/* Theme Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">2. Choose Style</Label>
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
                  >
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

        {/* RIGHT COLUMN: Visual Stage (Upload + Preview + Actions) */}
        <div className="flex flex-col gap-6">
          {/* Main Visual Area */}
          <div
            {...getRootProps()}
            className="relative w-full overflow-hidden rounded-2xl border bg-muted/20 shadow-sm min-h-[400px] flex flex-col"
          >
            {/* Case 1: Result is showing */}
            {hasResult ? (
              <div className="relative group w-full h-full">
                <img
                  src={activeGeneration!.outputUrls![0]}
                  alt="Generated design"
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
              /* Case 2: Image Uploaded (Preview) */
              <div className="relative w-full h-full min-h-[300px] bg-black/5 flex items-center justify-center group">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded room"
                  className="w-full h-auto max-h-[60vh] object-contain"
                />

                {/* Loading overlay during generation */}
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-12 w-12 animate-spin text-white" />
                      <p className="text-white font-medium">Loading...</p>
                    </div>
                  </div>
                )}

                {/* Change Image overlay - only when not generating */}
                {!isGenerating && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                    onClick={openUpload}
                  >
                    <Button
                      variant="secondary"
                      size="lg"
                      className="gap-2 pointer-events-none"
                    >
                      <Upload className="h-4 w-4" /> Change Image
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Case 3: Empty State (Upload Zone) */
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

          {/* Action Dock - Only render when there's content */}
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
                      disabled={isGenerating || credits < 1}
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
                  // Generate Actions - only show when image is uploaded
                  uploadedImageUrl && (
                    <Button
                      size="lg"
                      className="w-full md:w-auto min-w-[200px] h-12 bg-primary px-8 text-lg hover:bg-primary/90 text-white shadow-lg cursor-pointer ml-auto"
                      onClick={handleGenerate}
                      disabled={isGenerating || credits < 1}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-5 w-5" />
                          Generate Design
                        </>
                      )}
                    </Button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

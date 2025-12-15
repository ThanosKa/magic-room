"use client";

import React, { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { useGenerationStore } from "@/stores/generation-store";
import { AuthGuard } from "@/components/auth-guard";
import { RoomType, Theme } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROOM_TYPES, THEMES } from "@/lib/constants";
import { Upload, Download, RefreshCw, Loader2 } from "lucide-react";
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
        toast.error("File is too large (max 10MB)");
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        setUploadedImage(base64, "");
        setOriginalImage(base64); // Store original
        toast.success("Image uploaded!");
      } catch {
        toast.error("Failed to process image");
      }
    },
    [setUploadedImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
  });

  // Generate design - ALWAYS use originalImage
  const handleGenerate = useCallback(async () => {
    if (!originalImage || credits < 1) {
      toast.error("Please upload an image and ensure you have credits");
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
        toast.success("Design generated!");
        if (clerkUser?.id) refreshUser(clerkUser.id);
      } else {
        throw new Error(data.error || "No images generated");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setIsGenerating(false);
    }
  }, [originalImage, credits, roomType, theme, setActiveGeneration, clerkUser?.id, refreshUser]);

  // Reset everything
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
      toast.success("Downloaded!");
    } catch {
      toast.error("Failed to download");
    }
  };

  const hasResult = activeGeneration?.status === "succeeded" && activeGeneration.outputUrls?.length;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Redesign your <span className="text-primary">room</span> in seconds
        </h1>
        <p className="mt-3 text-muted-foreground">
          Upload a room, specify the room type, and select your room theme to redesign.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left Column - Controls */}
        <div className="space-y-8">
          {/* Credits Banner */}
          {credits <= 0 && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-center">
              <p className="text-sm text-destructive">
                You have no credits left.{" "}
                <a href="/pricing" className="font-medium underline">
                  Buy more here
                </a>{" "}
                to generate your room.
              </p>
            </div>
          )}

          {/* Upload Section */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Upload a photo of your room</Label>
            <div
              {...getRootProps()}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-input hover:border-primary/50"
              )}
            >
              <input {...getInputProps()} />
              <Button className="mb-3">
                <Upload className="mr-2 h-4 w-4" />
                Upload an Image
              </Button>
              <p className="text-sm text-muted-foreground">
                ...or drag and drop an image.
              </p>
            </div>
          </div>

          {/* Room Type Select */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Room Type</Label>
            <Select value={roomType} onValueChange={(v) => setRoomType(v as RoomType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ROOM_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme Selection with Images */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Room Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(THEMES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key as Theme)}
                  className={cn(
                    "group relative flex flex-col items-center overflow-hidden rounded-lg border-2 transition-all",
                    theme === key
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-input hover:border-primary/50"
                  )}
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={THEME_IMAGES[key as Theme]}
                      alt={label}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                  <span className="py-2 text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={!uploadedImageUrl || isGenerating || credits < 1}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Render designs"
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              Cost: <strong>1 credit</strong>
            </span>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="flex items-center justify-center rounded-xl border bg-muted/30 p-4">
          {hasResult ? (
            <div className="relative w-full overflow-hidden rounded-lg">
              <img
                src={activeGeneration.outputUrls![0]}
                alt="Generated design"
                className="w-full rounded-lg"
              />
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Again
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          ) : uploadedImageUrl ? (
            <div className="relative w-full overflow-hidden rounded-lg">
              <img
                src={uploadedImageUrl}
                alt="Uploaded room"
                className="w-full rounded-lg"
              />
              {isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-3 text-sm font-medium">Generating your design...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
              <div className="mb-4 h-16 w-16 rounded-lg bg-muted" />
              <p className="text-sm">Upload an image to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

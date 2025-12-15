"use client";

import React, { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { useGenerationStore } from "@/stores/generation-store";
import { AuthGuard } from "@/components/auth-guard";
import { RoomUploader } from "@/components/room-uploader";
import { DesignOptions } from "@/components/design-options";
import { ResultsViewer } from "@/components/results-viewer";
import { GenerationLoading } from "@/components/generation-loading";
import { RoomType, Theme } from "@/types";
import { toast } from "sonner";

/**
 * Generate page - main interface for room design generation
 * Protected by AuthGuard - requires user to be signed in
 * 
 * Uses OpenRouter with synchronous generation - no polling needed.
 */
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

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDesigns = useCallback(
    async (options: {
      roomType: RoomType;
      theme: Theme;
      customPrompt?: string;
    }) => {
      // uploadedImageUrl is now base64, no path needed
      if (!uploadedImageUrl || credits < 1) {
        toast.error("Please upload an image and ensure you have credits");
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        // Show loading toast
        const loadingToast = toast.loading(
          "Generating your design... This may take up to 60 seconds."
        );

        // Call API with base64 image (no more imageUrl/imagePath)
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64Image: uploadedImageUrl,
            roomType: options.roomType,
            theme: options.theme,
            customPrompt: options.customPrompt,
          }),
        });

        toast.dismiss(loadingToast);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate design");
        }

        const data = await response.json();

        // OpenRouter returns results synchronously
        if (data.success && data.outputUrls && data.outputUrls.length > 0) {
          setActiveGeneration({
            id: data.predictionId,
            status: "succeeded",
            outputUrls: data.outputUrls,
          });

          toast.success(
            `Generated ${data.outputUrls.length} design variation${data.outputUrls.length > 1 ? "s" : ""}!`
          );

          // Refresh user credits
          if (clerkUser?.id) {
            refreshUser(clerkUser.id);
          }
        } else {
          throw new Error(data.error || "No images generated");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate designs";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsGenerating(false);
      }
    },
    [uploadedImageUrl, credits, setActiveGeneration, clerkUser?.id, refreshUser]
  );

  const handleGenerateAgain = useCallback(() => {
    clearUploadedImage();
    setActiveGeneration(null);
    setIsGenerating(false);
    setError(null);
  }, [clearUploadedImage, setActiveGeneration]);

  // Show loading state while generating
  if (isGenerating) {
    return (
      <div className="container mx-auto px-4 py-12">
        <GenerationLoading
          estimatedTime={60}
          onCancel={handleGenerateAgain}
        />
      </div>
    );
  }

  // Show results if available
  if (activeGeneration?.status === "succeeded" && activeGeneration.outputUrls) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ResultsViewer
          originalImage={uploadedImageUrl || undefined}
          generationId={activeGeneration.id}
          results={activeGeneration.outputUrls}
          onGenerateAgain={handleGenerateAgain}
        />
      </div>
    );
  }

  // Main generation interface
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Create Your Perfect Design
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Upload a photo and let AI transform your space
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <RoomUploader
            onUploadComplete={(base64) => setUploadedImage(base64, "")}
          />
        </div>

        {/* Options Section */}
        <div className="lg:col-span-1">
          <DesignOptions
            imageUrl={uploadedImageUrl || undefined}
            isLoading={isGenerating}
            credits={credits}
            onGenerate={handleGenerateDesigns}
          />
        </div>

        {/* Results Section */}
        <div className="lg:col-span-1">
          <ResultsViewer
            originalImage={uploadedImageUrl || undefined}
            results={activeGeneration?.outputUrls || []}
            isLoading={false}
            error={error || undefined}
            onGenerateAgain={handleGenerateAgain}
          />
        </div>
      </div>

      {/* Mobile Responsive Layout */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

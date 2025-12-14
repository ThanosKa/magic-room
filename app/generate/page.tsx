"use client";

import React, { useEffect, useState, useCallback } from "react";
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
    isPolling,
    uploadedImageUrl,
    uploadedImagePath,
    setUploadedImage,
    clearUploadedImage,
    setActiveGeneration,
    setIsPolling,
  } = useGenerationStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  // Note: User credits are fetched globally by UserDataProvider in layout

  // Poll generation status
  useEffect(() => {
    if (!isPolling || !activeGeneration?.id) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/generate/${activeGeneration.id}`);
        if (!response.ok) throw new Error("Failed to fetch status");

        const data = await response.json();

        // Update active generation with new status
        setActiveGeneration({
          ...activeGeneration,
          status: data.status,
          outputUrls: data.outputUrls || [],
          error: data.error,
        });

        setPollCount((prev) => prev + 1);

        // Stop polling if generation is complete
        if (data.status === "succeeded" || data.status === "failed") {
          setIsPolling(false);
          setIsGenerating(false);

          if (data.status === "succeeded") {
            toast.success(
              `Generated ${
                activeGeneration.outputUrls?.length || 1
              } design variation!`
            );
            // Refresh user credits
            if (clerkUser?.id) {
              refreshUser(clerkUser.id);
            }
          } else if (data.status === "failed") {
            setError(data.error || "Generation failed");
            toast.error("Generation failed. Credit refunded.");
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
        // Continue polling even on error
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [
    isPolling,
    activeGeneration,
    clerkUser?.id,
    setActiveGeneration,
    setIsPolling,
    refreshUser,
  ]);

  const handleGenerateDesigns = useCallback(
    async (options: {
      roomType: RoomType;
      theme: Theme;
      customPrompt?: string;
    }) => {
      if (!uploadedImageUrl || !uploadedImagePath || credits < 1) {
        toast.error("Please upload an image and ensure you have credits");
        return;
      }

      setIsGenerating(true);
      setError(null);
      setPollCount(0);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: uploadedImageUrl,
            imagePath: uploadedImagePath,
            roomType: options.roomType,
            theme: options.theme,
            customPrompt: options.customPrompt,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to start generation");
        }

        const data = await response.json();

        // Set active generation and start polling
        setActiveGeneration({
          id: data.generationId,
          status: "starting",
          outputUrls: [],
        });
        setIsPolling(true);

        toast.success("Generation started! Generating your designs...");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate designs";
        setError(errorMessage);
        setIsGenerating(false);
        toast.error(errorMessage);
      }
    },
    [
      uploadedImageUrl,
      uploadedImagePath,
      credits,
      setActiveGeneration,
      setIsPolling,
    ]
  );

  const handleGenerateAgain = useCallback(() => {
    clearUploadedImage();
    setActiveGeneration(null);
    setIsPolling(false);
    setIsGenerating(false);
    setError(null);
    setPollCount(0);
  }, [clearUploadedImage, setActiveGeneration, setIsPolling]);

  // Show loading state while generating or polling
  if (isGenerating || isPolling) {
    return (
      <div className="container mx-auto px-4 py-12">
        <GenerationLoading estimatedTime={45} onCancel={handleGenerateAgain} />
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
            onUploadComplete={(url, path) => setUploadedImage(url, path)}
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
            isPolling={isPolling}
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

"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
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

const MAX_POLL_ATTEMPTS = 40; // 2 minutes at 3s intervals (40 * 3 = 120s)
const POLL_INTERVAL = 3000; // 3 seconds

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
  const generationIdRef = useRef<string | null>(null);

  // Note: User credits are fetched globally by UserDataProvider in layout

  // Poll generation status
  useEffect(() => {
    if (!isPolling || !generationIdRef.current) return;

    const generationId = generationIdRef.current;
    console.log(`[Polling] Started for generation ID: ${generationId}`);

    const pollInterval = setInterval(async () => {
      setPollCount((prev) => {
        const nextCount = prev + 1;
        console.log(
          `[Polling] Attempt ${nextCount}/${MAX_POLL_ATTEMPTS} - Fetching status...`
        );

        // Check if exceeded max attempts
        if (nextCount > MAX_POLL_ATTEMPTS) {
          console.error(
            `[Polling] Timeout: Exceeded ${MAX_POLL_ATTEMPTS} polling attempts (${
              (MAX_POLL_ATTEMPTS * POLL_INTERVAL) / 1000
            }s)`
          );
          clearInterval(pollInterval);
          setIsPolling(false);
          setIsGenerating(false);
          setError("Generation timed out. Please try again.");
          toast.error(
            "Generation took too long. Your credit has been refunded."
          );
          return nextCount;
        }

        return nextCount;
      });

      try {
        const response = await fetch(`/api/generate/${generationId}`);
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        console.log(
          `[Polling] Status received:`,
          data.status,
          `- Output URLs: ${data.outputUrls?.length || 0}`
        );

        // Update active generation with new status
        setActiveGeneration({
          id: generationId,
          status: data.status,
          outputUrls: data.outputUrls || [],
          error: data.error,
        });

        // Stop polling if generation is complete
        if (data.status === "succeeded" || data.status === "failed") {
          clearInterval(pollInterval);
          setIsPolling(false);
          setIsGenerating(false);

          if (data.status === "succeeded") {
            console.log(
              `[Polling] Success! Generated ${
                data.outputUrls?.length || 0
              } variations`
            );
            toast.success(
              `Generated ${data.outputUrls?.length || 1} design variation!`
            );
            // Refresh user credits
            if (clerkUser?.id) {
              refreshUser(clerkUser.id);
            }
          } else if (data.status === "failed") {
            console.error(`[Polling] Generation failed:`, data.error);
            setError(data.error || "Generation failed");
            toast.error("Generation failed. Credit refunded.");
          }
        }
      } catch (err) {
        console.error(`[Polling] Error on attempt:`, err);
        // Continue polling even on error
      }
    }, POLL_INTERVAL);

    return () => {
      clearInterval(pollInterval);
      console.log(`[Polling] Cleanup - stopped polling`);
    };
  }, [
    isPolling,
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
        console.log("[Generate] Starting generation with options:", options);
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
        console.log("[Generate] Received prediction ID:", data.predictionId);

        // Set active generation and start polling
        setActiveGeneration({
          id: data.predictionId,
          status: "starting",
          outputUrls: [],
        });
        generationIdRef.current = data.predictionId;
        setPollCount(0);
        setIsPolling(true);

        toast.success("Generation started! Generating your designs...");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate designs";
        console.error("[Generate] Error:", errorMessage);
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
    generationIdRef.current = null;
    setIsPolling(false);
    setIsGenerating(false);
    setError(null);
    setPollCount(0);
  }, [clearUploadedImage, setActiveGeneration, setIsPolling]);

  // Show loading state while generating or polling
  if (isGenerating || isPolling) {
    return (
      <div className="container mx-auto px-4 py-12">
        <GenerationLoading
          estimatedTime={45}
          pollCount={pollCount}
          maxPolls={MAX_POLL_ATTEMPTS}
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

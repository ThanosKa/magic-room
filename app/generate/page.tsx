"use client";

import React, { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { useGenerationStore } from "@/stores/generation-store";
import { AuthGuard } from "@/components/auth-guard";
import { RoomType, Theme } from "@/types";
import { toast } from "sonner";
import { MagicFileUpload } from "@/components/magic/file-upload";
import { MagicOptionsPanel } from "@/components/magic/options-panel";
import { MagicResultViewer } from "@/components/magic/result-viewer";
import { MagicCard } from "@/components/magic/magic-card";
import { Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
  const [roomType, setRoomType] = useState<RoomType>("living-room");
  const [theme, setTheme] = useState<Theme>("modern");
  const [customPrompt, setCustomPrompt] = useState("");

  const handleGenerateDesigns = useCallback(async () => {
    if (!uploadedImageUrl || credits < 1) {
      toast.error("Please upload an image and ensure you have credits");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image: uploadedImageUrl,
          roomType,
          theme,
          customPrompt: customPrompt.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate design");
      }

      const data = await response.json();

      if (data.success && data.outputUrls && data.outputUrls.length > 0) {
        setActiveGeneration({
          id: data.predictionId,
          status: "succeeded",
          outputUrls: data.outputUrls,
        });

        toast.success("Design generated successfully!");

        if (clerkUser?.id) {
          refreshUser(clerkUser.id);
        }
      } else {
        throw new Error(data.error || "No images generated");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [uploadedImageUrl, credits, roomType, theme, customPrompt, setActiveGeneration, clerkUser?.id, refreshUser]);

  const handleGenerateAgain = useCallback(() => {
    clearUploadedImage();
    setActiveGeneration(null);
    setIsGenerating(false);
  }, [clearUploadedImage, setActiveGeneration]);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row bg-slate-50 dark:bg-black overflow-hidden sticky top-16">
      {/* Left Sidebar - Options */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full border-b border-slate-200 lg:h-full lg:w-[400px] lg:border-b-0 lg:border-r dark:border-slate-800"
      >
        <MagicOptionsPanel
          roomType={roomType}
          setRoomType={setRoomType}
          theme={theme}
          setTheme={setTheme}
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
          onGenerate={handleGenerateDesigns}
          isGenerating={isGenerating}
          credits={credits}
          disabled={!uploadedImageUrl}
          className="h-full"
        />
      </motion.div>

      {/* Right Canvas - Upload/Result */}
      <main className="relative flex-1 bg-slate-100 p-4 lg:p-8 dark:bg-black">
        <div className="h-full w-full max-w-6xl mx-auto flex items-center justify-center">
          {activeGeneration?.status === "succeeded" && activeGeneration.outputUrls ? (
            // Result State
            <MagicResultViewer
              originalImage={uploadedImageUrl || undefined}
              resultImage={activeGeneration.outputUrls[0]}
              onGenerateAgain={handleGenerateAgain}
              className="h-full max-h-[800px] w-full"
            />
          ) : (
            // Upload/Preview State
            <MagicCard className="h-full max-h-[800px] w-full items-center justify-center p-8 lg:p-12">
              {isGenerating ? (
                <div className="flex flex-col items-center gap-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-purple-200 opacity-75 dark:bg-purple-900" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 shadow-xl dark:bg-slate-900">
                      <Sparkles className="h-10 w-10 animate-pulse text-purple-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Transforming your room...
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400">
                      Our AI is analyzing your space and applying the {theme} style.
                      <br />This usually takes about 30 seconds.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-2xl">
                  <MagicFileUpload
                    onFileSelect={(base64) => setUploadedImage(base64, "")}
                    className={uploadedImageUrl ? "h-full" : ""}
                  />
                </div>
              )}
            </MagicCard>
          )}
        </div>
      </main>
    </div>
  );
}

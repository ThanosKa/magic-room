"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useGenerationStore } from "@/stores/generation-store";
import { fileToBase64 } from "@/lib/supabase-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FORMATS = { "image/*": [".jpeg", ".jpg", ".png", ".webp"] };

interface RoomUploaderProps {
  onUploadComplete?: (base64: string) => void;
}

/**
 * RoomUploader component handles drag-and-drop image selection.
 * Images are converted to base64 for direct use with OpenRouter API.
 * No bucket upload needed - images stay local until generation.
 */
export function RoomUploader({ onUploadComplete }: RoomUploaderProps) {
  const {
    uploadedImageUrl,
    setUploadedImage,
    clearUploadedImage,
  } = useGenerationStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File too large. Maximum size is 10MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }

      try {
        setIsProcessing(true);
        setUploadProgress(0);
        toast.loading("Processing image...");

        // Convert to base64 (no upload to bucket needed)
        const base64 = await fileToBase64(file, (progress) => {
          setUploadProgress(progress);
        });

        // Store in Zustand (base64 as URL, empty path since no bucket)
        setUploadedImage(base64, "");
        onUploadComplete?.(base64);

        toast.dismiss();
        toast.success("Image ready for generation!");
      } catch (error) {
        toast.dismiss();
        toast.error("Failed to process image. Please try again.");
      } finally {
        setIsProcessing(false);
        setUploadProgress(0);
      }
    },
    [setUploadedImage, onUploadComplete]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        handleFileSelect(acceptedFiles[0]);
      }
    },
    [handleFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxFiles: 1,
    disabled: isProcessing,
  });

  const handleRemove = () => {
    clearUploadedImage();
    toast.info("Image removed.");
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold">Upload Room Photo</h3>

      {uploadedImageUrl ? (
        // Show uploaded image preview
        <Card className="relative overflow-hidden bg-slate-100 dark:bg-slate-900">
          <div className="relative aspect-square w-full">
            <img
              src={uploadedImageUrl}
              alt="Uploaded room"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex flex-col items-center gap-2 text-white">
                <CheckCircle className="h-8 w-8" />
                <span className="text-sm font-medium">Image ready</span>
              </div>
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={handleRemove}
            disabled={isProcessing}
            className="absolute right-2 top-2 rounded-full bg-red-500/90 p-2 text-white hover:bg-red-600 disabled:opacity-50"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </Card>
      ) : (
        // Drag and drop area
        <Card
          {...getRootProps()}
          className={`relative cursor-pointer border-2 border-dashed p-8 text-center transition-colors ${isDragActive
              ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30"
              : "border-slate-300 bg-slate-50 hover:border-purple-400 dark:border-slate-700 dark:bg-slate-900/50"
            } ${isProcessing ? "pointer-events-none opacity-50" : ""}`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-3">
            <Upload className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {isDragActive
                  ? "Drop your image here"
                  : "Drag & drop your room photo"}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                or click to browse (JPG, PNG, WebP - max 10MB)
              </p>
            </div>
          </div>

          {isProcessing && uploadProgress > 0 && (
            <div className="mt-4 w-full">
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full bg-purple-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                {uploadProgress}% processed
              </p>
            </div>
          )}
        </Card>
      )}

      {uploadedImageUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemove}
          disabled={isProcessing}
          className="w-full"
        >
          Change Image
        </Button>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import ReactCompareImage from "react-compare-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, RotateCcw, AlertCircle, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

interface ResultsViewerProps {
  originalImage?: string;
  generationId?: string;
  isLoading?: boolean;
  isPolling?: boolean;
  results?: string[];
  error?: string;
  onGenerateAgain: () => void;
}

export function ResultsViewer({
  originalImage,
  results = [],
  isLoading = false,
  isPolling = false,
  error,
  onGenerateAgain,
}: ResultsViewerProps) {
  const [selectedResult, setSelectedResult] = useState<string | null>(
    results.length > 0 ? results[0] : null
  );

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      toast.loading("Downloading image...");
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `magic-room-design-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.dismiss();
      toast.success("Image downloaded!");
    } catch (err) {
      toast.dismiss();
      console.error("Download error:", err);
      toast.error("Failed to download image.");
    }
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
        <div className="flex gap-4">
          <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-600 dark:text-red-400" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-200">
              Generation Failed
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {error}
            </p>
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              Your credit has been refunded.
            </p>
            <Button
              onClick={onGenerateAgain}
              size="sm"
              variant="outline"
              className="mt-4 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-950"
            >
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card className="border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <Eye className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          {isPolling
            ? "Generating your designs... This may take 30-60 seconds."
            : "Upload an image and click 'Generate Designs' to see results here."}
        </p>
        {isPolling && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
            <span className="text-sm font-medium text-purple-600">
              Processing...
            </span>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Your Design Variations</h3>

        {originalImage && selectedResult && (
          <Card className="overflow-hidden bg-slate-100 dark:bg-slate-900">
            <div className="relative w-full" style={{ aspectRatio: "1" }}>
              <ReactCompareImage
                leftImage={originalImage}
                rightImage={selectedResult}
                sliderLineWidth={2}
                sliderLineColor="#8B5CF6"
              />
            </div>
          </Card>
        )}

        {/* Selected Result Download Button */}
        {selectedResult && (
          <Button
            onClick={() => {
              const index = results.indexOf(selectedResult);
              handleDownload(selectedResult, index);
            }}
            className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
            size="sm"
          >
            <Download className="h-4 w-4" />
            Download Selected Design
          </Button>
        )}
      </div>

      {/* Results Grid */}
      <div className="space-y-3">
        <h4 className="font-medium text-slate-700 dark:text-slate-300">
          Generated Design{results.length > 1 ? "s" : ""} ({results.length})
        </h4>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {results.map((url, index) => (
            <div key={index} className="space-y-2">
              <button
                onClick={() => setSelectedResult(url)}
                className={`relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all ${
                  selectedResult === url
                    ? "border-purple-600 ring-2 ring-purple-300 dark:ring-purple-600"
                    : "border-slate-200 hover:border-purple-400 dark:border-slate-700"
                }`}
              >
                <Image
                  src={url}
                  alt={`Design variation ${index + 1}`}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </button>
              <Button
                onClick={() => handleDownload(url, index)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Again Button */}
      <Button
        onClick={onGenerateAgain}
        variant="outline"
        size="lg"
        className="w-full gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Generate Again
      </Button>
    </div>
  );
}

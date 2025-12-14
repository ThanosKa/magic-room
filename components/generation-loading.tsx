"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

interface GenerationLoadingProps {
  onCancel?: () => void;
  estimatedTime?: number;
}

const STATUS_MESSAGES = [
  "Uploading image...",
  "Starting generation...",
  "Processing your design...",
  "Almost done...",
  "Finalizing results...",
];

/**
 * GenerationLoading component displays loading state during design generation
 */
export function GenerationLoading({ onCancel, estimatedTime = 45 }: GenerationLoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Cycle through status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 15;
        return Math.min(prev + increment, 95);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const remainingTime = Math.max(0, estimatedTime - elapsedTime);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-8 dark:border-purple-900 dark:from-purple-950/30 dark:to-blue-950/30">
      <div className="space-y-6">
        {/* Status Message */}
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600 dark:text-purple-400" />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {STATUS_MESSAGES[messageIndex]}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This typically takes 30-60 seconds
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-right text-xs text-slate-600 dark:text-slate-400">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Estimated Time */}
        <div className="flex items-center justify-between rounded-lg bg-white/50 px-4 py-3 dark:bg-slate-900/50">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Estimated time remaining
          </span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            size="sm"
            className="w-full gap-2"
          >
            <X className="h-4 w-4" />
            Cancel Generation
          </Button>
        )}

        {/* Tips */}
        <div className="space-y-2 rounded-lg bg-blue-50/50 px-4 py-3 dark:bg-blue-950/20">
          <p className="text-xs font-medium text-blue-900 dark:text-blue-200">💡 Tips while you wait:</p>
          <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
            <li>• You'll get 4-8 unique design variations</li>
            <li>• Each can be customized further</li>
            <li>• All results are automatically saved</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

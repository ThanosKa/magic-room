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
  "Sending to AI...",
  "Processing your design...",
  "Transforming the room...",
  "Almost done...",
  "Finalizing results...",
];

export function GenerationLoading({
  onCancel,
  estimatedTime = 60,
}: GenerationLoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
      setProgress((prev) => {
        const targetProgress = Math.min(95, (elapsedTime / estimatedTime) * 100);
        return prev + (targetProgress - prev) * 0.1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [elapsedTime, estimatedTime]);

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
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Processing with AI
            </p>
            <p className="text-right text-xs text-slate-600 dark:text-slate-400">
              {Math.round(progress)}%
            </p>
          </div>
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
          <p className="text-xs font-medium text-blue-900 dark:text-blue-200">
            Tips while you wait:
          </p>
          <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
            <li>• AI is analyzing your room layout</li>
            <li>• Results will appear automatically</li>
            <li>• You can generate more variations after</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

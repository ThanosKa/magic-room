"use client";

import React, { useState } from "react";
import { RoomType, Theme } from "@/types";
import { ROOM_TYPES, THEMES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DesignOptionsProps {
  imageUrl?: string;
  isLoading?: boolean;
  credits?: number;
  onGenerate: (options: {
    roomType: RoomType;
    theme: Theme;
    customPrompt?: string;
  }) => void;
}

/**
 * DesignOptions component for selecting room type, theme, and custom prompt
 */
export function DesignOptions({
  imageUrl,
  isLoading,
  credits = 0,
  onGenerate,
}: DesignOptionsProps) {
  const [roomType, setRoomType] = useState<RoomType>("living-room");
  const [theme, setTheme] = useState<Theme>("modern");
  const [customPrompt, setCustomPrompt] = useState("");

  const canGenerate = imageUrl && credits > 0 && !isLoading;

  const handleGenerate = () => {
    if (!canGenerate) return;
    onGenerate({
      roomType,
      theme,
      customPrompt: customPrompt.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Design Preferences</h3>

        {/* Room Type Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Room Type
          </label>
          <Select value={roomType} onValueChange={(value) => setRoomType(value as RoomType)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select room type" />
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

        {/* Theme Selector */}
        <div className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Design Theme
          </label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {Object.entries(THEMES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTheme(key as Theme)}
                className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all ${
                  theme === key
                    ? "border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300"
                    : "border-slate-200 bg-white text-slate-700 hover:border-purple-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-purple-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="mt-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Custom Prompt (Optional)
          </label>
          <Textarea
            placeholder="E.g., 'Add more plants', 'Make it cozy', 'Contemporary style'"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isLoading}
            maxLength={500}
            className="resize-none"
            rows={3}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {customPrompt.length}/500 characters
          </p>
        </div>
      </div>

      {/* Generate Button */}
      <Card className="border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950/30">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Cost per generation
            </span>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              1 Credit
            </span>
          </div>

          {credits <= 0 && (
            <p className="text-sm text-red-600 dark:text-red-400">
              ⚠️ Insufficient credits. Please purchase more.
            </p>
          )}

          {!imageUrl && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              📸 Upload an image to get started.
            </p>
          )}

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate}
            size="lg"
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? "Generating..." : "Generate Designs"}
          </Button>
        </div>
      </Card>

      {credits > 0 && (
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          You have <span className="font-semibold text-purple-600 dark:text-purple-400">{credits}</span> credits remaining
        </p>
      )}
    </div>
  );
}

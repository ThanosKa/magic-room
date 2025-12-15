"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ROOM_TYPES, THEMES } from "@/lib/constants";
import { RoomType, Theme } from "@/types";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wand2 } from "lucide-react";

interface OptionsPanelProps {
    roomType: RoomType;
    setRoomType: (type: RoomType) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    customPrompt: string;
    setCustomPrompt: (prompt: string) => void;
    onGenerate: () => void;
    isGenerating: boolean;
    credits: number;
    disabled?: boolean;
    className?: string;
}

export function MagicOptionsPanel({
    roomType,
    setRoomType,
    theme,
    setTheme,
    customPrompt,
    setCustomPrompt,
    onGenerate,
    isGenerating,
    credits,
    disabled,
    className,
}: OptionsPanelProps) {
    return (
        <div className={cn("flex h-full flex-col bg-slate-50/50 p-6 dark:bg-slate-900/50", className)}>
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Configure Design
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Choose your style preferences
                </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-4 -mr-4">
                <div className="space-y-8 pr-4 pb-8">
                    {/* Room Type */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Room Type</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(ROOM_TYPES).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setRoomType(key as RoomType)}
                                    className={cn(
                                        "flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200",
                                        roomType === key
                                            ? "border-purple-600 bg-purple-600 text-white shadow-md transform scale-[1.02]"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:bg-purple-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-purple-700"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Theme */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Style Theme</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(THEMES).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setTheme(key as Theme)}
                                    className={cn(
                                        "relative overflow-hidden rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200",
                                        theme === key
                                            ? "border-blue-600 bg-blue-600 text-white shadow-md transform scale-[1.02]"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:border-blue-700"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Prompt */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">
                            Additional Details <span className="text-xs font-normal text-slate-400">(Optional)</span>
                        </Label>
                        <Textarea
                            placeholder="e.g. Add a large mirror, make it cozy, use warm lighting..."
                            value={customPrompt}
                            onChange={(e) => setCustomPrompt(e.target.value)}
                            className="resize-none border-slate-200 bg-white focus:border-purple-500 focus:ring-purple-500 dark:border-slate-800 dark:bg-slate-950"
                            rows={4}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Cost</span>
                    <span className="font-semibold text-purple-600">1 Credit</span>
                </div>

                <Button
                    size="lg"
                    onClick={onGenerate}
                    disabled={disabled || isGenerating}
                    className={cn(
                        "w-full bg-gradient-to-r from-purple-600 to-blue-600 text-lg font-semibold shadow-lg transition-all hover:shadow-purple-500/25",
                        isGenerating && "opacity-80"
                    )}
                >
                    {isGenerating ? (
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Designing...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Wand2 className="h-5 w-5" />
                            Generate Design
                        </div>
                    )}
                </Button>
            </div>
        </div>
    );
}

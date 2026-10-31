"use client";

import { useCallback, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { useGenerationStore } from "@/stores/generation-store";
import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { PhotoPanel, type ToolState } from "@/components/generate/photo-panel";
import { NoteField, QualityPicker, RoomTypePicker, StylePicker } from "@/components/generate/option-pickers";
import { QUALITY_OPTIONS, THEMES } from "@/lib/constants";
import { readDesignSelection } from "@/lib/design-selection";
import { MAX_PHOTO_FILE_SIZE, prepareRoomPhoto, type RoomPhoto } from "@/lib/room-photo";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
import type { Quality, RoomType, Theme } from "@/types";

/**
 * A message shown in the slot above the Generate button (`#generate-message`).
 * The slot is always on screen next to the main action, on desktop and phone.
 */
export interface ToolMessage {
    tone: "error" | "info";
    text: string;
    action?: { label: string; href: string };
}

export default function GenerateContent() {
    return (
        <AuthGuard>
            <GenerateTool />
        </AuthGuard>
    );
}

function GenerateTool() {
    const { user: clerkUser } = useUser();
    const { credits, refreshUser } = useUserStore();
    const { activeGeneration, setActiveGeneration } = useGenerationStore();
    const reducedMotion = usePrefersReducedMotion();

    // A deep link (/generate?style=japandi&room=bedroom) sets the starting choices.
    const preselected = readDesignSelection(useSearchParams());

    const [photo, setPhoto] = useState<RoomPhoto | null>(null);
    const [roomType, setRoomType] = useState<RoomType>(preselected.roomType ?? "living-room");
    const [theme, setTheme] = useState<Theme>(preselected.theme ?? "modern");
    const [quality, setQuality] = useState<Quality>("standard");
    const [note, setNote] = useState("");
    const [generationStartedAt, setGenerationStartedAt] = useState<number | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [message, setMessage] = useState<ToolMessage | null>(null);
    const photoRef = useRef<HTMLDivElement>(null);

    const resultUrl =
        activeGeneration?.status === "succeeded" ? (activeGeneration.outputUrls?.[0] ?? null) : null;
    const isGenerating = generationStartedAt !== null;
    const state: ToolState = !photo ? "empty" : isGenerating ? "generating" : resultUrl ? "result" : "ready";

    const cost = QUALITY_OPTIONS[quality].credits;
    const canGenerate = photo !== null && !isGenerating && credits >= cost;

    // On a phone the button sits below the choices: bring the photo (wait
    // state, then result) back into view when it changes.
    const showPhoto = useCallback(() => {
        const el = photoRef.current;
        if (!el || el.getBoundingClientRect().top >= 0) return;
        el.scrollIntoView({ block: "start", behavior: reducedMotion ? "auto" : "smooth" });
    }, [reducedMotion]);

    const handleFile = useCallback(
        async (file: File) => {
            if (file.size > MAX_PHOTO_FILE_SIZE) return;
            try {
                const prepared = await prepareRoomPhoto(file);
                setActiveGeneration(null);
                setPhoto(prepared);
                setMessage(null);
            } catch {}
        },
        [setActiveGeneration]
    );

    const handleGenerate = useCallback(async () => {
        if (!photo || isGenerating || credits < cost) return;

        setMessage(null);
        setGenerationStartedAt(Date.now());
        requestAnimationFrame(showPhoto);

        const customPrompt = note.trim();
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    base64Image: photo.dataUrl,
                    roomType,
                    theme,
                    quality,
                    ...(customPrompt ? { customPrompt } : {}),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate");
            }

            const data = await response.json();
            if (!(data.success && data.outputUrls?.length > 0)) {
                throw new Error(data.error || "No images generated");
            }

            setActiveGeneration({ id: data.predictionId, status: "succeeded", outputUrls: data.outputUrls });
            if (clerkUser?.id) refreshUser(clerkUser.id);
        } catch {
        } finally {
            setGenerationStartedAt(null);
        }
    }, [photo, isGenerating, credits, cost, note, roomType, theme, quality, setActiveGeneration, clerkUser?.id, refreshUser, showPhoto]);

    const handleDownload = useCallback(async () => {
        if (!resultUrl) return;
        try {
            const blob = await (await fetch(resultUrl)).blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `magic-room-${theme}-${roomType}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(blobUrl);
        } catch {}
    }, [resultUrl, theme, roomType]);

    return (
        <div data-tool-state={state} className="container-page pb-16 pt-6 sm:pt-10 lg:pb-24">
            <div className="mb-6 max-w-2xl sm:mb-10">
                <h1 className="font-serif text-[clamp(34px,5vw,64px)] font-normal leading-[1] tracking-[-0.025em] text-ink text-balance">
                    Redesign your <em className="italic">room</em> in seconds
                </h1>
                <p className="mt-3 hidden text-[17px] leading-relaxed tracking-[-0.01em] text-ink-2 sm:block">
                    Upload a photo, pick a room type and a style, and get a new design in about a minute.
                </p>
            </div>

            {/*
              Phone: one flex column (photo, choices, action bar), so the bar
              sticks to the bottom of the screen from the very top, even under
              a tall photo. Desktop: photo left (sticky), choices right with the
              bar sticking to the bottom of that column.
            */}
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14">
                <div ref={photoRef} className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
                    <PhotoPanel
                        state={state}
                        photo={photo}
                        resultUrl={resultUrl}
                        styleName={THEMES[theme]}
                        generationStartedAt={generationStartedAt}
                        fullscreen={fullscreen}
                        onFullscreenChange={setFullscreen}
                        onFile={handleFile}
                        onDownload={handleDownload}
                    />
                </div>

                <div className="contents lg:block lg:min-w-0">
                    {/* Locked while a design is being made. */}
                    <fieldset disabled={isGenerating} className="min-w-0 space-y-9">
                        <legend className="sr-only">Your choices</legend>
                        <RoomTypePicker value={roomType} onChange={setRoomType} />
                        <StylePicker value={theme} onChange={setTheme} />
                        <div className="space-y-5">
                            <QualityPicker value={quality} onChange={setQuality} />
                            <NoteField value={note} onChange={setNote} />
                        </div>
                    </fieldset>

                    <div className="sticky bottom-0 z-30 -mx-5 border-t border-line bg-paper px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 sm:-mx-6 sm:px-6 lg:-mx-4 lg:mt-8 lg:px-4">
                        <div id="generate-message" role="status" aria-live="polite" className="empty:hidden mb-3">
                            {message && (
                                <p
                                    className={cn(
                                        "rounded-lg border px-4 py-3 text-[14px] leading-snug",
                                        message.tone === "error"
                                            ? "border-destructive/30 bg-destructive/5 text-ink"
                                            : "border-line bg-paper-2 text-ink"
                                    )}
                                >
                                    {message.text}
                                    {message.action && (
                                        <a href={message.action.href} className="ml-2 font-medium underline underline-offset-4">
                                            {message.action.label}
                                        </a>
                                    )}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="min-w-0 flex-1 text-[13px] leading-snug text-ink-2">
                                {photo ? (
                                    <>
                                        <span className="block font-medium text-ink">
                                            Uses {cost} {cost === 1 ? "credit" : "credits"}
                                        </span>
                                        <span className="block">You have {credits}</span>
                                    </>
                                ) : (
                                    "Add a photo of your room to start."
                                )}
                            </p>
                            <Button size="lg" onClick={handleGenerate} disabled={!canGenerate} className="min-w-[180px]">
                                {isGenerating ? (
                                    <>
                                        <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
                                        Generating…
                                    </>
                                ) : resultUrl ? (
                                    "Regenerate"
                                ) : (
                                    "Generate design"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

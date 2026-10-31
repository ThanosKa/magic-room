"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { useGenerationStore } from "@/stores/generation-store";
import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { PhotoPanel, type ToolState } from "@/components/generate/photo-panel";
import { NoteField, QualityPicker, RoomTypePicker, StylePicker } from "@/components/generate/option-pickers";
import { QUALITY_OPTIONS, THEMES } from "@/lib/constants";
import { generateHref, readDesignSelection } from "@/lib/design-selection";
import { MAX_PHOTO_FILE_SIZE, prepareRoomPhoto, type RoomPhoto } from "@/lib/room-photo";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { formatCredits } from "@/lib/utils";
import {
    DOWNLOAD_FAILED_MESSAGE,
    generateFailureMessage,
    NETWORK_MESSAGE,
    notEnoughCreditsMessage,
    PHOTO_MESSAGES,
    ToolMessageView, type ToolMessage } from "@/components/generate/tool-messages";
import type { Quality, RoomType, Theme } from "@/types";

export default function GenerateContent() {
    return (
        <AuthGuard>
            <GenerateTool />
        </AuthGuard>
    );
}

function GenerateTool() {
    const { user: clerkUser } = useUser();
    const { signOut } = useClerk();
    const { user, credits, refreshUser } = useUserStore();
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
    // Only once the balance has loaded, so it never flashes "you have 0".
    const shortOfCredits = user !== null && credits < cost;
    const canGenerate = photo !== null && !isGenerating && credits >= cost;

    // "Sign in again" sends the user through sign-in and back to the tool
    // with the room type and style chosen at the moment of the click.
    const choicesRef = useRef({ theme, roomType });
    useEffect(() => {
        choicesRef.current = { theme, roomType };
    }, [theme, roomType]);
    const signInAgain = useCallback(
        () => signOut({ redirectUrl: generateHref(choicesRef.current) }),
        [signOut]
    );

    // On a phone the button sits below the choices: bring the photo (wait
    // state, then result) back into view when it changes.
    const showPhoto = useCallback(() => {
        const el = photoRef.current;
        if (!el || el.getBoundingClientRect().top >= 0) return;
        el.scrollIntoView({ block: "start", behavior: reducedMotion ? "auto" : "smooth" });
    }, [reducedMotion]);

    const handleFile = useCallback(
        async (file: File) => {
            if (file.size > MAX_PHOTO_FILE_SIZE) {
                setMessage(PHOTO_MESSAGES.tooLarge);
                return;
            }
            try {
                const prepared = await prepareRoomPhoto(file);
                setActiveGeneration(null);
                setPhoto(prepared);
                setMessage(null);
            } catch {
                setMessage(PHOTO_MESSAGES.unreadable);
            }
        },
        [setActiveGeneration]
    );

    const handleGenerate = useCallback(async () => {
        if (!photo || isGenerating || credits < cost) return;

        setMessage(null);
        setGenerationStartedAt(Date.now());
        requestAnimationFrame(showPhoto);

        const customPrompt = note.trim();
        const failure = { cost, signInAgain };
        let balanceRead = false;
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
            // A host timeout page is not JSON: the status alone decides then.
            const data = await response.json().catch(() => null);

            if (response.ok && data?.success && data.outputUrls?.length > 0) {
                setActiveGeneration({ id: data.predictionId, status: "succeeded", outputUrls: data.outputUrls });
            } else if (response.status === 402 && clerkUser?.id) {
                // Re-read the balance first: once it is below the cost, the
                // "Not enough credits" message shows it with the real number.
                await refreshUser(clerkUser.id);
                balanceRead = true;
                if (useUserStore.getState().credits >= cost) {
                    setMessage(generateFailureMessage(response.status, data, failure));
                }
            } else {
                setMessage(generateFailureMessage(response.status, data, failure));
            }
        } catch {
            setMessage(NETWORK_MESSAGE);
        } finally {
            setGenerationStartedAt(null);
            // The balance may have changed either way (charged, or refunded).
            if (!balanceRead && clerkUser?.id) refreshUser(clerkUser.id);
        }
    }, [photo, isGenerating, credits, cost, note, roomType, theme, quality, setActiveGeneration, clerkUser?.id, refreshUser, showPhoto, signInAgain]);

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
        } catch {
            setMessage(DOWNLOAD_FAILED_MESSAGE);
        }
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
                        onReject={(reason) =>
                            setMessage(reason === "too-many" ? PHOTO_MESSAGES.tooMany : PHOTO_MESSAGES.wrongType)
                        }
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
                        <div id="generate-message" role="status" aria-live="polite" className="empty:hidden mb-3 space-y-2">
                            {message && <ToolMessageView message={message} />}
                            {shortOfCredits && !isGenerating && (
                                <ToolMessageView
                                    message={notEnoughCreditsMessage(quality === "standard" ? "Standard" : "Premium", cost, credits)}
                                />
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="min-w-0 flex-1 text-[13px] leading-snug text-ink-2">
                                {photo ? (
                                    <>
                                        <span className="block font-medium text-ink">
                                            Uses {formatCredits(cost)}
                                        </span>
                                        <span className="block">You have {formatCredits(credits)}</span>
                                    </>
                                ) : (
                                    "Add a photo of your room to start."
                                )}
                            </p>
                            <Button
                                size="lg"
                                onClick={handleGenerate}
                                disabled={!canGenerate}
                                aria-describedby="generate-message"
                                className="min-w-[180px]"
                            >
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

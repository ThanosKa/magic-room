"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";
import { useGenerationStore } from "@/stores/generation-store";
import { AuthGuard } from "@/components/auth-guard";
import { ControlPanel } from "@/components/generate/control-panel";
import { PhotoPanel, type ToolState } from "@/components/generate/photo-panel";
import { QUALITY_NAMES } from "@/components/generate/option-pickers";
import { QUALITY_OPTIONS, ROOM_TYPES, THEMES } from "@/lib/constants";
import { generateHref, readDesignSelection } from "@/lib/design-selection";
import { MAX_PHOTO_FILE_SIZE, prepareRoomPhoto, type RoomPhoto } from "@/lib/room-photo";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";
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

    // On a phone the page may be scrolled past the photo: bring it (wait
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
        /*
          Desktop (>= 1024): the photo canvas on the left and the control panel
          on the right fill the screen under the header; the title sits above
          the panel. Phone: title, canvas, then the panel as a bottom sheet that
          sticks to the bottom of the screen (it is the tool's last child, so it
          stays inside the tool and never covers the site footer).
        */
        <div
            data-tool-state={state}
            className={cn(
                // Phone: at least a screen tall, so the sheet (pushed to the end) starts at the bottom of the screen.
                "mx-auto flex min-h-[calc(100svh-66px)] w-full max-w-[1440px] flex-col gap-4 px-5 pt-3 sm:min-h-[calc(100svh-76px)] sm:px-6 sm:pt-4",
                "lg:grid lg:h-[calc(100svh-76px)] lg:min-h-[600px] lg:grid-cols-[minmax(0,1fr)_360px] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-5 lg:gap-y-5 lg:px-12 lg:pb-6 xl:grid-cols-[minmax(0,1fr)_392px]"
            )}
        >
            <div className="lg:col-start-2 lg:row-start-1 lg:pt-2">
                <h1 className="font-serif text-[clamp(30px,4vw,40px)] font-normal leading-[1] tracking-[-0.025em] text-ink text-balance">
                    Redesign your <em className="italic">room</em> in seconds
                </h1>
                <p className="mt-2 hidden text-[15px] leading-snug tracking-[-0.01em] text-ink-2 sm:block">
                    Upload a photo, pick a room type and a style, and get a new design in about a minute.
                </p>
            </div>

            <div ref={photoRef} className="flex flex-1 scroll-mt-24 flex-col lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:min-h-0">
                <PhotoPanel
                    state={state}
                    photo={photo}
                    resultUrl={resultUrl}
                    styleName={THEMES[theme]}
                    wait={{ seconds: QUALITY_OPTIONS[quality].waitSeconds, text: QUALITY_OPTIONS[quality].waitText }}
                    generationStartedAt={generationStartedAt}
                    fullscreen={fullscreen}
                    onFullscreenChange={setFullscreen}
                    onFile={handleFile}
                    onReject={(reason) =>
                        setMessage(reason === "too-many" ? PHOTO_MESSAGES.tooMany : PHOTO_MESSAGES.wrongType)
                    }
                    onDownload={handleDownload}
                    className="flex-1"
                />
            </div>

            <ControlPanel
                roomType={roomType}
                onRoomTypeChange={setRoomType}
                theme={theme}
                onThemeChange={setTheme}
                quality={quality}
                onQualityChange={setQuality}
                note={note}
                onNoteChange={setNote}
                summary={`${ROOM_TYPES[roomType]} · ${THEMES[theme]} · ${QUALITY_NAMES[quality]}`}
                generating={isGenerating}
                hasResult={resultUrl !== null}
                canGenerate={canGenerate}
                onGenerate={handleGenerate}
                className="lg:col-start-2 lg:row-start-2"
                messages={
                    <>
                        {message && <ToolMessageView message={message} />}
                        {shortOfCredits && !isGenerating && (
                            <ToolMessageView message={notEnoughCreditsMessage(QUALITY_NAMES[quality], cost, credits)} />
                        )}
                    </>
                }
            />
        </div>
    );
}

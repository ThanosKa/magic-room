"use client";

import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Download, ImagePlus, Maximize2, RefreshCw } from "lucide-react";
import { CompareSlider } from "@/components/compare-slider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { WaitState } from "@/components/generate/wait-state";
import { StepTitle } from "@/components/generate/option-pickers";
import { cn } from "@/lib/utils";
import type { RoomPhoto } from "@/lib/room-photo";

/** What the tool is doing. Also set as `data-tool-state` on the tool's root. */
export type ToolState = "empty" | "ready" | "generating" | "result";

interface PhotoPanelProps {
    state: ToolState;
    photo: RoomPhoto | null;
    resultUrl: string | null;
    styleName: string;
    generationStartedAt: number | null;
    fullscreen: boolean;
    onFullscreenChange: (open: boolean) => void;
    onFile: (file: File) => void;
    /** A dropped or picked file the tool cannot take (not an image, or several). */
    onReject: (reason: "wrong-type" | "too-many") => void;
    onDownload: () => void;
}

// Keeps a tall (portrait) photo inside the screen: its width shrinks so the
// height stays under ~64% of the viewport.
function frameWidth(photo: RoomPhoto) {
    return { maxWidth: `min(100%, calc(64svh * ${photo.width / photo.height}))` };
}

/**
 * Step 1: the photo. Empty, it is the drop zone; with a photo it shows the
 * photo, the wait state over it, or the before/after result.
 */
export function PhotoPanel({
    state,
    photo,
    resultUrl,
    styleName,
    generationStartedAt,
    fullscreen,
    onFullscreenChange,
    onFile,
    onReject,
    onDownload,
}: PhotoPanelProps) {
    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop: (files) => {
            if (files[0]) onFile(files[0]);
        },
        onDropRejected: (rejections) => {
            const tooMany = rejections.some((r) => r.errors.some((e) => e.code === "too-many-files"));
            onReject(tooMany ? "too-many" : "wrong-type");
        },
        // Exactly the types the copy promises (an `image/*` key would let any image through).
        accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"], "image/webp": [".webp"] },
        maxFiles: 1,
        noClick: true,
        noKeyboard: true,
        disabled: state === "generating",
    });

    return (
        <section aria-labelledby="step-photo" className="min-w-0">
            <h2
                id="step-photo"
                className="mb-3 flex items-baseline gap-3 text-[15px] font-medium tracking-[-0.01em] text-ink"
            >
                <StepTitle step={1} title="Photo" />
            </h2>

            <div
                {...getRootProps()}
                className={cn(
                    "relative overflow-hidden rounded-2xl outline-offset-4 transition-[outline-color] duration-160",
                    isDragActive && photo && "outline-2 outline-dashed outline-ink"
                )}
            >
                <input {...getInputProps()} aria-label="Room photo" />

                {!photo ? (
                    <button
                        type="button"
                        onClick={open}
                        className={cn(
                            "group flex min-h-[260px] w-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition-[background-color,border-color] duration-160 ease-out motion-reduce:transition-none sm:min-h-[380px] lg:min-h-[460px]",
                            isDragActive ? "border-ink bg-paper-2" : "border-ink/25 bg-paper-2/60 hover:border-ink/50 hover:bg-paper-2"
                        )}
                    >
                        <span className="grid size-14 place-items-center rounded-full bg-paper text-ink shadow-float">
                            <ImagePlus aria-hidden="true" className="size-6" strokeWidth={1.75} />
                        </span>
                        <span className="mt-5 font-serif text-[30px] leading-none tracking-[-0.02em] text-ink sm:text-[36px]">
                            Upload your room
                        </span>
                        <span className="mt-3 max-w-xs text-[15px] leading-relaxed text-ink-2">
                            Drag a photo here, or tap to choose one. JPG, PNG or WebP.
                        </span>
                        <span className="mt-6 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-cream shadow-button">
                            Choose a photo
                        </span>
                    </button>
                ) : state === "result" && resultUrl ? (
                    <div className="mx-auto" style={frameWidth(photo)}>
                        <CompareSlider
                            before={{ src: photo.dataUrl, alt: "Your room before the redesign" }}
                            after={{ src: resultUrl, alt: `Your room redesigned in the ${styleName} style` }}
                            aspectRatio={photo.width / photo.height}
                            sizes="(min-width: 1024px) 720px, 100vw"
                            label="Compare your photo and the redesign"
                            className="rounded-2xl"
                        />
                    </div>
                ) : (
                    <div className="relative mx-auto overflow-hidden rounded-2xl bg-paper-2" style={frameWidth(photo)}>
                        <Image
                            src={photo.dataUrl}
                            alt="Your room"
                            width={photo.width}
                            height={photo.height}
                            className={cn(
                                "block h-auto w-full transition-[filter,opacity] duration-500 ease-out motion-reduce:transition-none",
                                state === "generating" && "opacity-80 saturate-[0.6]"
                            )}
                        />
                        {state === "generating" && generationStartedAt !== null && (
                            <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-night/45 to-night/0 p-3 sm:p-5">
                                <WaitState startedAt={generationStartedAt} styleName={styleName} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {photo && state !== "generating" && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                    {state === "result" && (
                        <>
                            <Button variant="secondary" size="sm" onClick={() => onFullscreenChange(true)}>
                                <Maximize2 aria-hidden="true" />
                                Full screen
                            </Button>
                            <Button variant="secondary" size="sm" onClick={onDownload}>
                                <Download aria-hidden="true" />
                                Download
                            </Button>
                        </>
                    )}
                    <Button variant="ghost" size="sm" onClick={open}>
                        <RefreshCw aria-hidden="true" />
                        Replace photo
                    </Button>
                </div>
            )}

            {resultUrl && (
                <Dialog open={fullscreen} onOpenChange={onFullscreenChange}>
                    <DialogContent className="left-0 top-0 grid h-[100svh] w-screen max-w-none translate-x-0 translate-y-0 grid-rows-[minmax(0,1fr)] place-items-center rounded-none border-0 bg-night p-3 sm:max-w-none sm:rounded-none sm:p-6 [&>[data-slot=dialog-close]]:bg-paper [&>[data-slot=dialog-close]]:text-ink">
                        <DialogTitle className="sr-only">Your redesign, full screen</DialogTitle>
                        {/* eslint-disable-next-line @next/next/no-img-element -- a data URL shown at its natural size */}
                        <img
                            src={resultUrl}
                            alt={`Your room redesigned in the ${styleName} style`}
                            className="h-full w-full object-contain"
                        />
                    </DialogContent>
                </Dialog>
            )}
        </section>
    );
}

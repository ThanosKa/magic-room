/**
 * Turns the user's room photo into the base64 data URL the generate API takes.
 * Runs in the browser only: the photo is never uploaded anywhere else.
 */

const MAX_UPLOAD_SIZE = 2.5 * 1024 * 1024;
const RESIZE_MAX_DIMENSION = 1536;

/** Largest file the tool accepts before compression. */
export const MAX_PHOTO_FILE_SIZE = 20 * 1024 * 1024;

export interface RoomPhoto {
    /** `data:image/...;base64,...` */
    dataUrl: string;
    width: number;
    height: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
}

function readAsDataUrl(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") resolve(reader.result);
            else reject(new Error("Failed to read file as base64"));
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });
}

/**
 * Photos over 1536 px on a side or 2.5 MB are scaled down and re-encoded as
 * JPEG (quality 0.9, on white). Smaller photos are sent as they are.
 */
export async function prepareRoomPhoto(file: File): Promise<RoomPhoto> {
    const img = await loadImage(file);

    const needsResize =
        img.width > RESIZE_MAX_DIMENSION ||
        img.height > RESIZE_MAX_DIMENSION ||
        file.size > MAX_UPLOAD_SIZE;

    if (!needsResize) {
        URL.revokeObjectURL(img.src);
        return { dataUrl: await readAsDataUrl(file), width: img.width, height: img.height };
    }

    let w = img.width;
    let h = img.height;
    if (w > RESIZE_MAX_DIMENSION || h > RESIZE_MAX_DIMENSION) {
        if (w >= h) {
            h = Math.round((h / w) * RESIZE_MAX_DIMENSION);
            w = RESIZE_MAX_DIMENSION;
        } else {
            w = Math.round((w / h) * RESIZE_MAX_DIMENSION);
            h = RESIZE_MAX_DIMENSION;
        }
    }

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(img.src);

    const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
            (b) => {
                if (b) resolve(b);
                else reject(new Error("Image compression failed"));
            },
            "image/jpeg",
            0.9
        )
    );

    canvas.width = 0;
    canvas.height = 0;

    return { dataUrl: await readAsDataUrl(blob), width: w, height: h };
}

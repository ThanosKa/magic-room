import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// We use nodejs runtime to be able to read files from the filesystem
export const runtime = "nodejs";

export const alt = "Magic Room - Start Rendering";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    // Read images from public directory
    const beforeBuffer = readFileSync(join(process.cwd(), "public/images/og-before-white.png"));
    const afterBuffer = readFileSync(join(process.cwd(), "public/images/og-after-white.png"));

    const beforeSrc = `data:image/png;base64,${beforeBuffer.toString("base64")}`;
    const afterSrc = `data:image/png;base64,${afterBuffer.toString("base64")}`;

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    backgroundColor: "#FFFFFF",
                }}
            >
                {/* Before Image */}
                <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={beforeSrc}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        alt="Before"
                    />
                </div>

                {/* After Image */}
                <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={afterSrc}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        alt="After"
                    />
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}

import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// We use nodejs runtime to be able to read files from the filesystem
export const runtime = "nodejs";

export const alt = "Magic Room - AI Interior Design Comparison";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    // Read images from public directory
    // Note: In Next.js App Router with nodejs runtime, process.cwd() is usually the project root
    const beforeBuffer = readFileSync(join(process.cwd(), "public/images/room-before.png"));
    const afterBuffer = readFileSync(join(process.cwd(), "public/images/room-after.png"));

    // Convert buffers to base64 for embedding (standard way in img src for ImageResponse if not using absolute URL)
    // Actually, ImageResponse supports ArrayBuffer directly if using fetched response, but for src string base64 is safest.
    const beforeSrc = `data:image/png;base64,${beforeBuffer.toString("base64")}`;
    const afterSrc = `data:image/png;base64,${afterBuffer.toString("base64")}`;

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#0f172a",
                    color: "white",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        height: "15%",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "16px",
                        borderBottom: "1px solid #334155",
                        background: "#0f172a",
                    }}
                >
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: "#a855f7" }}
                    >
                        <path d="M3 3h18v18H3z" stroke="#a855f7" strokeWidth="2" fill="none" />
                        <path d="M12 8l4 8H8z" fill="#a855f7" />
                    </svg>
                    <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.05em" }}>
                        Magic Room
                    </div>
                </div>

                {/* Content - Split View */}
                <div style={{ display: "flex", flex: 1, position: "relative" }}>
                    {/* Before */}
                    <div style={{ display: "flex", flex: 1, position: "relative", borderRight: "2px solid #334155" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={beforeSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Before" />
                        <div style={{
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: 24,
                            fontWeight: 600
                        }}>
                            Original
                        </div>
                    </div>

                    {/* After */}
                    <div style={{ display: "flex", flex: 1, position: "relative" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={afterSrc} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="After" />
                        <div style={{
                            position: "absolute",
                            top: "20px",
                            right: "20px",
                            background: "rgba(168, 85, 247, 0.9)", // purple-500
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: 24,
                            fontWeight: 600,
                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}>
                            Redesigned
                        </div>
                    </div>

                    {/* Center Arrow Overlay */}
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                        color: "#7c3aed"
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="M12 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}

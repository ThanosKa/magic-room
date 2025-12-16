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
                    flexDirection: "column",
                    backgroundColor: "#FFFFFF",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px",
                        background: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
                        color: "#FFFFFF",
                    }}
                >
                    <div style={{ fontSize: "48px", fontWeight: "bold" }}>Magic Room</div>
                    <div style={{ fontSize: "24px", marginLeft: "16px", opacity: 0.9 }}>
                        AI Interior Design
                    </div>
                </div>

                {/* Before/After Comparison */}
                <div style={{ display: "flex", flex: 1, position: "relative" }}>
                    {/* Before Section */}
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: "20px",
                                left: "20px",
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                color: "#FFFFFF",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                fontSize: "20px",
                                fontWeight: "600",
                                zIndex: 10,
                            }}
                        >
                            Before
                        </div>
                        <img
                            src={beforeSrc}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            alt="Before"
                        />
                    </div>

                    {/* Divider */}
                    <div
                        style={{
                            width: "4px",
                            backgroundColor: "#8B5CF6",
                            boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)",
                        }}
                    />

                    {/* After Section */}
                    <div
                        style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: "20px",
                                right: "20px",
                                backgroundColor: "rgba(139, 92, 246, 0.9)",
                                color: "#FFFFFF",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                fontSize: "20px",
                                fontWeight: "600",
                                zIndex: 10,
                            }}
                        >
                            After
                        </div>
                        <img
                            src={afterSrc}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            alt="After"
                        />
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}

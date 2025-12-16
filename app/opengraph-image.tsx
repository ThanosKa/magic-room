import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Magic Room - AI Interior Design";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    // We use standard CSS in this response
    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#0f172a", // slate-950
                    backgroundImage: "linear-gradient(to bottom right, #0f172a, #1e1b4b, #312e81)",
                    color: "white",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "20px",
                    }}
                >
                    {/* Logo SVG Representation since we can't easily load local assets in Edge Runtime without fetch */}
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: "#a855f7" }} // purple-500
                    >
                        <path d="M3 3h18v18H3z" stroke="#a855f7" strokeWidth="2" fill="none" />
                        <path d="M12 8l4 8H8z" fill="#a855f7" />
                    </svg>
                    <div
                        style={{
                            fontSize: 80,
                            fontWeight: 800,
                            letterSpacing: "-0.05em",
                            background: "linear-gradient(to right, #fff, #a855f7)",
                            backgroundClip: "text",
                            color: "transparent",
                        }}
                    >
                        Magic Room
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "40px",
                        gap: "10px",
                    }}
                >
                    <div style={{ fontSize: 32, fontWeight: 500, opacity: 0.8 }}>
                        AI-Powered Interior Design
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 400, opacity: 0.5 }}>
                        magicroom.ai
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}

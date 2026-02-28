import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read OPENROUTER_API_KEY from .env.local
const envContent = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
const apiKey = envContent.match(/OPENROUTER_API_KEY=(.+)/)?.[1]?.trim();

if (!apiKey) {
    console.error("❌ OPENROUTER_API_KEY not found in .env.local");
    process.exit(1);
}

const PROMPT = `A beautifully staged modern living room, professional interior design photography,
wide angle shot from the corner of the room, natural daylight through large windows,
contemporary furniture with clean lines, neutral tones with subtle accents,
polished concrete or light oak flooring, high quality, photorealistic, no people`;

console.log("🚀 Generating modern living room image...");
console.log("   Model: google/gemini-2.5-flash-image");
console.log("   Prompt:", PROMPT.slice(0, 80) + "...");
console.log("");

const startTime = Date.now();

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://magic-room.dev",
        "X-Title": "Magic Room",
    },
    body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: PROMPT }],
        modalities: ["image", "text"],
    }),
});

if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("❌ API error:", response.status, JSON.stringify(err, null, 2));
    process.exit(1);
}

const data = await response.json();
const duration = ((Date.now() - startTime) / 1000).toFixed(1);

console.log(`✅ Response received in ${duration}s`);

if (data.error) {
    console.error("❌ Model error:", data.error);
    process.exit(1);
}

const message = data.choices?.[0]?.message;
if (!message) {
    console.error("❌ No message in response:", JSON.stringify(data, null, 2));
    process.exit(1);
}

// Extract image from response (same logic as lib/openrouter.ts)
let imageUrl = null;

if (message.images?.length > 0) {
    imageUrl = message.images[0].image_url?.url;
}

if (!imageUrl && Array.isArray(message.content)) {
    for (const item of message.content) {
        if (item.type === "image_url" && item.image_url?.url) {
            imageUrl = item.image_url.url;
            break;
        }
    }
}

if (!imageUrl) {
    console.error("❌ No image in response. Full response:");
    console.log(JSON.stringify(data, null, 2));
    process.exit(1);
}

// Save the image
const outputDir = path.join(__dirname, "../public/images/designs");
fs.mkdirSync(outputDir, { recursive: true });

const outputPath = path.join(outputDir, "modern-living-room-test.png");

// Handle base64 or URL
if (imageUrl.startsWith("data:")) {
    const base64Data = imageUrl.split(",")[1];
    fs.writeFileSync(outputPath, Buffer.from(base64Data, "base64"));
    console.log(`💾 Saved to: ${outputPath}`);
} else {
    // Download the image URL
    const imgResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imgResponse.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log(`💾 Saved to: ${outputPath}`);
}

console.log(`\n✅ Done! Open this file to review:`);
console.log(`   ${outputPath}`);

if (message.content && typeof message.content === "string" && message.content.trim()) {
    console.log(`\n📝 Model also returned text: ${message.content.slice(0, 200)}`);
}

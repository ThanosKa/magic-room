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

// All 14 themes (8 UI + 6 SEO-only)
const ALL_THEMES = {
    modern: "Modern",
    minimalist: "Minimalist",
    scandinavian: "Scandinavian",
    industrial: "Industrial",
    tropical: "Tropical",
    bohemian: "Bohemian",
    vintage: "Vintage",
    luxury: "Luxury",
    japandi: "Japandi",
    "art-deco": "Art Deco",
    coastal: "Coastal",
    farmhouse: "Farmhouse",
    mediterranean: "Mediterranean",
    transitional: "Transitional",
};

// All 14 room types (7 UI + 7 SEO-only)
const ALL_ROOMS = {
    "living-room": "Living Room",
    bedroom: "Bedroom",
    kitchen: "Kitchen",
    bathroom: "Bathroom",
    "dining-room": "Dining Room",
    office: "Home Office",
    "gaming-room": "Gaming Room",
    nursery: "Nursery",
    "laundry-room": "Laundry Room",
    basement: "Basement",
    sunroom: "Sunroom",
    "home-theater": "Home Theater",
    mudroom: "Mudroom",
    "walk-in-closet": "Walk-in Closet",
};

// Style-specific prompt modifiers
const THEME_MODIFIERS = {
    modern: "modern contemporary design, clean geometric lines, neutral palette with bold accents, minimal clutter, open plan feel",
    minimalist: "minimalist design, extremely clean and uncluttered, white and off-white palette, only essential furniture, serene and calming",
    scandinavian: "Scandinavian hygge design, warm neutrals, natural wood accents, cozy textiles, simple functional furniture, lots of natural light",
    industrial: "industrial loft design, exposed brick or concrete, metal accents, Edison bulbs, dark moody palette, raw materials",
    tropical: "tropical island design, lush indoor plants, rattan furniture, natural fibres, bright botanical accents, warm inviting atmosphere",
    bohemian: "bohemian eclectic design, layered textiles, vintage and handmade objects, warm jewel tones, global accents, creative and personal",
    vintage: "vintage retro design, period furniture, warm patina, classic patterns, antique accessories, nostalgic character",
    luxury: "high-end luxury design, premium materials, marble, velvet upholstery, statement lighting, curated art, sophisticated elegance",
    japandi: "japandi design fusion, wabi-sabi minimalism, natural wood and rattan, muted earthy tones, handcrafted objects, peaceful and grounded",
    "art-deco": "art deco glamour, geometric patterns, jewel tones, gold metallic accents, mirrored surfaces, bold and theatrical",
    coastal: "coastal beach house design, light breezy atmosphere, white and blue-green palette, natural woven textures, ocean-inspired",
    farmhouse: "modern farmhouse design, reclaimed wood, neutral cream palette, shiplap walls, vintage accents, warm and welcoming",
    mediterranean: "mediterranean villa design, terracotta tiles, whitewashed walls, wrought iron, handmade ceramics, warm sun-drenched palette",
    transitional: "transitional design, classic meets contemporary, warm neutral palette, traditional furniture forms with modern finishes, timeless",
};

// Room-specific prompt modifiers
const ROOM_MODIFIERS = {
    "living-room": "living room, comfortable seating arrangement, focal point fireplace or feature wall, ample natural light through large windows",
    bedroom: "bedroom, king size bed with styled bedding, nightstands, calm restful atmosphere, blackout curtains, good ambient lighting",
    kitchen: "kitchen, well-equipped with cabinetry, island or peninsula, pendant lights over worktop, practical and beautiful",
    bathroom: "bathroom, freestanding or built-in bath, walk-in shower, large mirrors, elegant fixtures, spa-like retreat",
    "dining-room": "dining room, generous dining table with chairs, statement overhead light fitting, artwork on walls, entertaining-ready",
    office: "home office, large desk with ergonomic setup, bookshelves, task lighting, productive and inspiring workspace",
    "gaming-room": "gaming room, gaming desk setup with monitors, ambient RGB lighting, comfortable gaming chair, shelving for games collection",
    nursery: "nursery, cot or toddler bed, soft furnishings, gentle colour scheme, storage for toys, safe and nurturing",
    "laundry-room": "laundry room, washing machine and dryer, folding counter, organised storage cabinets, clean and functional utility space",
    basement: "finished basement, comfortable seating area, layered lighting, warm rug, cozy and inviting below-grade living space",
    sunroom: "sunroom conservatory, abundant natural light, indoor plants, comfortable garden furniture, connection to the garden beyond",
    "home-theater": "home theater room, tiered seating, projector screen or large TV, acoustic panels, dramatic low lighting",
    mudroom: "mudroom entryway, coat hooks and shoe storage, bench seating, durable flooring, organised and welcoming",
    "walk-in-closet": "walk-in closet dressing room, organised hanging rails and shelves, full-length mirror, elegant lighting, boutique-style",
};

// Before-image prompts — neutral, unstaged versions per room type
const BEFORE_PROMPTS = {
    "living-room": "An average unstaged living room with plain walls, generic furniture, mismatched pieces, no particular style, realistic interior photo",
    bedroom: "A plain unstaged bedroom with basic bed and furniture, white walls, no styling, ordinary and generic, realistic photo",
    kitchen: "An average plain kitchen with standard cabinets, basic appliances, white walls, no styling, realistic interior photo",
    bathroom: "A plain standard bathroom with basic white fixtures, ordinary tiles, no styling, generic interior photo",
    "dining-room": "A plain unstaged dining room with basic table and chairs, white walls, no decorative accessories, ordinary photo",
    office: "A plain home office with basic desk and chair, white walls, no styling, generic workspace photo",
    "gaming-room": "A plain bedroom repurposed as gaming space, basic desk and monitor, ordinary walls, unstaged, realistic photo",
    nursery: "A plain empty room with white walls, basic cot, no styling or decorative elements, generic nursery space photo",
    "laundry-room": "A plain utility laundry room with washer and dryer, plain white walls, basic shelving, generic unstaged photo",
    basement: "An unfinished plain basement with concrete floor, basic walls, sparse furniture, ordinary and unstaged, realistic photo",
    sunroom: "A plain sunroom with basic white walls, simple garden furniture, no styling, ordinary unstaged conservatory photo",
    "home-theater": "A plain basement room with basic sofa and TV on stand, white walls, no acoustic treatment, unstaged ordinary photo",
    mudroom: "A plain entryway with coat hooks on wall, basic flooring, no storage system, ordinary unstaged mudroom photo",
    "walk-in-closet": "A plain walk-in closet with basic hanging rails and shelves, standard lighting, no styling, ordinary wardrobe room photo",
};

function buildAfterPrompt(themeKey, roomKey) {
    const themeMod = THEME_MODIFIERS[themeKey];
    const roomMod = ROOM_MODIFIERS[roomKey];
    const themeName = ALL_THEMES[themeKey];
    const roomName = ALL_ROOMS[roomKey];
    return `Professional interior design photography of a ${themeName.toLowerCase()} style ${roomName.toLowerCase()}, ${themeMod}, ${roomMod}, wide angle shot from a corner showing the full space, natural and artificial lighting perfectly balanced, photorealistic, high quality, magazine-worthy, no people`;
}

async function generateImage(prompt, outputPath, label) {
    const startTime = Date.now();
    process.stdout.write(`  Generating: ${label}... `);

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
            messages: [{ role: "user", content: prompt }],
            modalities: ["image", "text"],
        }),
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        console.log(`❌ API error ${response.status}: ${JSON.stringify(err).slice(0, 100)}`);
        return false;
    }

    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    if (data.error) {
        console.log(`❌ Model error: ${JSON.stringify(data.error).slice(0, 100)}`);
        return false;
    }

    const message = data.choices?.[0]?.message;
    if (!message) {
        console.log(`❌ No message in response`);
        return false;
    }

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
        console.log(`❌ No image in response`);
        return false;
    }

    if (imageUrl.startsWith("data:")) {
        const base64Data = imageUrl.split(",")[1];
        fs.writeFileSync(outputPath, Buffer.from(base64Data, "base64"));
    } else {
        const imgResponse = await fetch(imageUrl);
        const buffer = Buffer.from(await imgResponse.arrayBuffer());
        fs.writeFileSync(outputPath, buffer);
    }

    console.log(`✅ ${duration}s`);
    return true;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const outputDir = path.join(__dirname, "../public/images/designs");
fs.mkdirSync(outputDir, { recursive: true });

// Parse CLI args
const args = process.argv.slice(2);
const onlyBefore = args.includes("--before-only");
const onlyAfter = args.includes("--after-only");
const skipExisting = !args.includes("--force");
const themeFilter = args.find((a) => a.startsWith("--theme="))?.split("=")[1];
const roomFilter = args.find((a) => a.startsWith("--room="))?.split("=")[1];

let totalGenerated = 0;
let totalSkipped = 0;
let totalFailed = 0;

// ─── BEFORE images (one per room type) ───────────────────────────────────────
if (!onlyAfter) {
    console.log("\n📷 Generating BEFORE images (neutral rooms)...\n");

    for (const [roomKey, roomName] of Object.entries(ALL_ROOMS)) {
        if (roomFilter && roomKey !== roomFilter) continue;

        const outputPath = path.join(outputDir, `before-${roomKey}.jpg`);

        if (skipExisting && fs.existsSync(outputPath)) {
            console.log(`  Skipping: before-${roomKey} (exists)`);
            totalSkipped++;
            continue;
        }

        const prompt = BEFORE_PROMPTS[roomKey];
        const ok = await generateImage(prompt, outputPath, `before-${roomKey}`);
        if (ok) totalGenerated++;
        else totalFailed++;

        // Rate limit delay
        await sleep(2000);
    }
}

// ─── AFTER images (one per theme+room combination) ───────────────────────────
if (!onlyBefore) {
    const themeEntries = Object.entries(ALL_THEMES);
    const roomEntries = Object.entries(ALL_ROOMS);
    const total = themeEntries.length * roomEntries.length;

    console.log(`\n🎨 Generating AFTER images (${total} combinations)...\n`);

    let i = 0;
    for (const [themeKey] of themeEntries) {
        if (themeFilter && themeKey !== themeFilter) continue;

        for (const [roomKey] of roomEntries) {
            if (roomFilter && roomKey !== roomFilter) continue;
            i++;

            const slug = `${themeKey}-${roomKey}`;
            const outputPath = path.join(outputDir, `${slug}.jpg`);

            if (skipExisting && fs.existsSync(outputPath)) {
                console.log(`  Skipping: ${slug} (exists)`);
                totalSkipped++;
                continue;
            }

            const prompt = buildAfterPrompt(themeKey, roomKey);
            const label = `[${i}/${total}] ${slug}`;
            const ok = await generateImage(prompt, outputPath, label);
            if (ok) totalGenerated++;
            else totalFailed++;

            // Rate limit delay between calls
            await sleep(2000);
        }
    }
}

console.log(`\n─────────────────────────────────────────`);
console.log(`✅ Generated: ${totalGenerated}`);
console.log(`⏭️  Skipped:   ${totalSkipped}`);
console.log(`❌ Failed:    ${totalFailed}`);
console.log(`📁 Output:    ${outputDir}`);
console.log(`─────────────────────────────────────────\n`);

if (totalFailed > 0) {
    console.log("Re-run with --force to retry failed images, or add --theme=modern --room=bedroom to target specific combos.");
}

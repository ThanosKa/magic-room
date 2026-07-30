
export interface IDesignTip {
    title: string;
    description: string;
}

export interface IThemeData {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    tips: IDesignTip[];
    keywords: string[];
}

export interface IRoomConsideration {
    title: string;
    description: string;
}

export interface IRoomData {
    name: string;
    slug: string;
    description: string;
    considerations: IRoomConsideration[];
    keywords: string[];
}

export interface IFaqItem {
    question: string;
    answer: string;
}

/**
 * Page-specific editorial depth, for combinations that already earn impressions
 * but rank too low to earn clicks. `/design/art-deco-bedroom` took 415
 * impressions at position 18.9 with zero clicks — the template content is
 * identical to 195 other pages, so there is nothing on it that a top-10
 * "art deco bedroom ideas" result has. This is where the page-specific
 * substance lives.
 */
export interface IDeepDiveSection {
    heading: string;
    paragraphs?: string[];
    bullets?: string[];
    table?: { headers: string[]; rows: string[][] };
}

export interface IDesignPageData {
    slug: string;
    theme: string;
    roomType: string;
    themeName: string;
    roomName: string;
    title: string;
    metaDescription: string;
    intro: string;
    faqs: IFaqItem[];
    keywords: string[];
    deepDive?: IDeepDiveSection[];
}

export const THEME_DATA: Record<string, IThemeData> = {
    modern: {
        name: "Modern",
        slug: "modern",
        tagline: "Clean lines, functional spaces, timeless appeal",
        description:
            "Modern interior design strips away visual noise to let architecture and carefully chosen pieces speak for themselves. It relies on geometric forms, neutral palettes with deliberate accent colours, and materials like concrete, glass, and brushed metal to create rooms that feel effortlessly ordered.",
        tips: [
            {
                title: "Commit to a restrained palette",
                description:
                    "Modern rooms work best with two or three core colours. Anchor the space with a neutral base — warm white, greige, or charcoal — then introduce one accent through cushions, artwork, or a single piece of furniture. Resist adding more until the room feels complete.",
            },
            {
                title: "Let negative space do the work",
                description:
                    "Empty wall sections and floor areas are not wasted space in a modern interior — they provide visual breathing room that makes each object more legible. Resist the urge to fill every surface, and edit your existing collection ruthlessly before adding anything new.",
            },
            {
                title: "Choose furniture with visible legs",
                description:
                    "Pieces that float off the floor keep sightlines open and make rooms read as larger. Sofas, side tables, and beds with slender legs let light pass underneath, reinforcing the airy quality that defines the style.",
            },
            {
                title: "Unify flooring across zones",
                description:
                    "Modern design treats an open-plan area as a single composition. Using the same flooring material throughout, rather than changing at doorways or zone boundaries, strengthens the cohesion and lets the furniture arrangement define the zones instead.",
            },
        ],
        keywords: [
            "modern interior design",
            "modern room design AI",
            "contemporary interior style",
            "modern home decor ideas",
        ],
    },
    minimalist: {
        name: "Minimalist",
        slug: "minimalist",
        tagline: "Less, but better — every object earns its place",
        description:
            "Minimalist design applies a simple test to every object in a space: does it serve a clear purpose, or does it bring genuine joy? Anything that fails both criteria leaves the room. The result is an environment where attention is never scattered, materials are appreciated for their intrinsic quality, and the mind can settle.",
        tips: [
            {
                title: "Start by removing rather than adding",
                description:
                    "Before purchasing anything new, spend a weekend taking things out of a room. Clear surfaces, move furniture into storage temporarily, and assess which pieces you genuinely missed after a few days. Only return the items that passed that test.",
            },
            {
                title: "Invest in storage that disappears",
                description:
                    "Visible clutter defeats minimalism immediately. Built-in joinery, handle-free cabinet doors, and furniture with integrated storage allow the volume of possessions you actually own to exist without being seen. The cost is usually worth the visual payoff.",
            },
            {
                title: "Use texture to prevent sterility",
                description:
                    "A minimalist room with only smooth, flat surfaces can feel cold. Introduce contrast through a linen throw, a rough stone ornament, or a tactile rug. The variety in texture provides the visual interest that patterned wallpaper or busy accessories would otherwise supply.",
            },
            {
                title: "Define one focal point and anchor the rest",
                description:
                    "Every minimalist room benefits from a single deliberate focal point — a piece of art, a statement light fitting, or a window with a strong view. Orient furniture toward it, and resist creating competing points of interest elsewhere in the space.",
            },
        ],
        keywords: [
            "minimalist interior design",
            "minimalist room AI",
            "minimal home decor",
            "minimalist design ideas",
        ],
    },
    scandinavian: {
        name: "Scandinavian",
        slug: "scandinavian",
        tagline: "Warmth, function, and the beauty of natural materials",
        description:
            "Scandinavian design emerged from a climate where winters are long and daylight is scarce, so rooms were engineered to maximise warmth and comfort without sacrificing practicality. Light woods, wool textiles, candlelight, and handcrafted objects give the style a human quality that purely minimal approaches can lack.",
        tips: [
            {
                title: "Layer light sources strategically",
                description:
                    "Scandinavian interiors rarely rely on a single overhead fixture. Floor lamps, table lamps, candles, and under-cabinet strips create pools of warm light at different heights. This layered approach makes rooms feel cocooning in the evenings without the harshness of central lighting alone.",
            },
            {
                title: "Choose light woods over dark ones",
                description:
                    "Pine, birch, and oak in lighter finishes reflect more of the available natural light and prevent the heavy quality that characterises other traditional styles. When in doubt, go lighter — you can always add a darker piece as a contrast accent later.",
            },
            {
                title: "Introduce the concept of hygge through textiles",
                description:
                    "The Danish concept of hygge — a feeling of cosy contentment — is achieved largely through textiles. Chunky knit throws, sheepskin rugs, linen curtains, and wool cushions make a room feel safe and inhabited rather than styled. Layer multiple textures rather than relying on a single statement piece.",
            },
            {
                title: "Keep decoration functional",
                description:
                    "Scandinavian homes decorate with objects that do something — a ceramic mug on a shelf, a wooden tray holding candles, a stack of books used rather than arranged. This prevents the over-styled look that makes rooms feel like showrooms rather than places people actually live.",
            },
        ],
        keywords: [
            "scandinavian interior design",
            "scandi room design AI",
            "nordic interior style",
            "scandinavian decor ideas",
        ],
    },
    industrial: {
        name: "Industrial",
        slug: "industrial",
        tagline: "Raw materials, honest structure, urban character",
        description:
            "Industrial design treats a building's infrastructure as a feature rather than something to hide. Exposed brick, steel beams, concrete floors, and visible ductwork form the backdrop. Against that raw shell, leather, worn wood, and vintage factory pieces create spaces that feel lived-in from day one.",
        tips: [
            {
                title: "Expose the building rather than covering it",
                description:
                    "If you have original brick, structural beams, or concrete, treat them as assets. Sandblasting brick, stripping paint from columns, or leaving ceiling joists visible is almost always a better starting point than adding faux-industrial cladding on top of a conventional interior.",
            },
            {
                title: "Balance raw with refined",
                description:
                    "Unrelieved roughness quickly becomes oppressive. Pair concrete floors with a soft area rug, contrast steel shelving with warm leather seating, or add linen curtains against an exposed brick wall. The tension between raw and refined is what gives the style its energy.",
            },
            {
                title: "Source factory and workshop furniture",
                description:
                    "Authentic industrial furniture — metal lockers repurposed as wardrobes, factory stools used at a kitchen island, vintage filing cabinets as side tables — carries genuine history. Flea markets, industrial surplus dealers, and architectural salvage yards are better sources than retail replicas.",
            },
            {
                title: "Use Edison bulbs and adjustable metal fixtures",
                description:
                    "Lighting in an industrial space should look mechanical and deliberate. Exposed bulbs on pendant cords, clip-on metal reflectors, and track lighting on conduit all suit the aesthetic. Warm filament bulbs soften the rawness of the materials around them without compromising the overall character.",
            },
        ],
        keywords: [
            "industrial interior design",
            "industrial room design AI",
            "industrial home decor",
            "loft style design ideas",
        ],
    },
    tropical: {
        name: "Tropical",
        slug: "tropical",
        tagline: "Lush greenery, natural materials, resort-inspired calm",
        description:
            "Tropical interior design brings the outdoor environment inside, using plants, natural fibres, and warm humidity-appropriate materials to create rooms that feel like retreats rather than offices. The palette draws from nature — forest greens, clay reds, rattan browns, and clean whites — and the approach to accessories rewards abundance over restraint.",
        tips: [
            {
                title: "Commit to real plants, not artificial ones",
                description:
                    "A single large fiddle-leaf fig, bird of paradise, or monstera changes the quality of a room in a way that artificial plants cannot replicate. If natural light is limited, choose species that tolerate shade — pothos, ZZ plants, or peace lilies — rather than defaulting to silk alternatives.",
            },
            {
                title: "Use rattan and woven materials generously",
                description:
                    "Rattan chairs, woven pendant lights, bamboo blinds, and jute rugs introduce the texture and warmth that the style depends on. Unlike wood or metal, these materials work at multiple price points without sacrificing authenticity, making tropical one of the more accessible styles to execute.",
            },
            {
                title: "Choose a warm, nature-derived palette",
                description:
                    "Tropical palettes are not simply 'green and white'. The most effective versions include clay, terracotta, warm amber, and dusty leaf green alongside the brighter accent shades. Cooler blues and stark whites sit less naturally in tropical interiors and tend to pull the aesthetic toward coastal instead.",
            },
            {
                title: "Open up the room to natural light",
                description:
                    "Tropical design looks its best when flooded with diffused daylight. Use sheer linen curtains rather than heavy drapes, clear obstructions from windows, and position mirrors to bounce light into darker corners. The goal is the dappled, generous quality of light in a shaded outdoor space.",
            },
        ],
        keywords: [
            "tropical interior design",
            "tropical room design AI",
            "biophilic design ideas",
            "tropical home decor",
        ],
    },
    bohemian: {
        name: "Bohemian",
        slug: "bohemian",
        tagline: "Collected over time, layered with intention, unapologetically individual",
        description:
            "Bohemian interiors reject the idea that everything must match. The style is built from objects gathered across time and place — vintage textiles, handmade ceramics, inherited furniture, travel souvenirs — layered together until a room reflects the specific person who lives in it. Rules exist to be adapted, not followed.",
        tips: [
            {
                title: "Layer rugs rather than using one large piece",
                description:
                    "Stacking rugs of different sizes, origins, and patterns is one of the most characteristic bohemian techniques. It adds depth, defines zones in a large room, and is one of the fastest ways to soften an otherwise conventional space. Wool kilims, Moroccan Beni Ourain rugs, and flat-weave dhurries work well together.",
            },
            {
                title: "Display collections rather than hiding them",
                description:
                    "In most interior styles, a large collection of objects is something to manage and minimise. In bohemian design, it is the point. Books stacked horizontally, a wall of framed prints in mismatched frames, shelves of ceramics and glass — these accumulations tell a story. Organise by colour if the variety feels overwhelming.",
            },
            {
                title: "Prioritise handmade and craft pieces",
                description:
                    "Mass-produced objects look out of place in a bohemian room. Seek out handmade ceramics, hand-woven textiles, naturally dyed fabrics, and objects made by individual makers. They bring an irregularity and warmth that factory production cannot replicate, and each piece adds a layer of narrative to the space.",
            },
            {
                title: "Mix periods and cultures thoughtfully",
                description:
                    "Bohemian rooms often combine pieces from different countries and eras, but the most successful ones do this with some attention to underlying harmony. A unifying colour thread running through textiles from different origins, or a consistent material palette, allows diverse objects to coexist without the room reading as simply chaotic.",
            },
        ],
        keywords: [
            "bohemian interior design",
            "boho room design AI",
            "bohemian home decor ideas",
            "eclectic interior style",
        ],
    },
    vintage: {
        name: "Vintage",
        slug: "vintage",
        tagline: "Character from another era, curated for life today",
        description:
            "Vintage design does not recreate a specific historical period faithfully — that is the territory of period restoration. Instead it draws selectively from the past, mixing mid-century furniture with art deco lighting or Victorian ironwork with 1970s ceramics, to create rooms that feel richly layered rather than museum-like.",
        tips: [
            {
                title: "Anchor the room with one strong period piece",
                description:
                    "Rather than filling a room with many small vintage items, choose one dominant piece from a particular era — a 1950s credenza, a 1930s club sofa, or a set of genuine Victorian dining chairs — and build the rest of the room around it. This approach creates coherence without requiring everything to match.",
            },
            {
                title: "Mix vintage with new deliberately",
                description:
                    "A room furnished entirely with antiques can feel heavy and inaccessible. Pairing a period piece with contemporary lighting, a modern paint colour, or new upholstery fabric keeps the space from feeling frozen in time. The contrast makes both the old and the new feel more intentional.",
            },
            {
                title: "Restore rather than disguise patina",
                description:
                    "The marks that age leaves on furniture — worn leather, faded gilding, paint layers showing through — are the qualities that make vintage pieces valuable. Cleaning and stabilising is appropriate; painting everything white or reupholstering in trendy fabric often destroys what made the piece interesting.",
            },
            {
                title: "Source from estate sales and specialist dealers",
                description:
                    "Charity shops and general second-hand markets yield occasional finds, but estate sales of properties from specific decades and dealers who specialise in particular periods offer far better access to quality pieces. The extra effort in sourcing shows in the finished room.",
            },
        ],
        keywords: [
            "vintage interior design",
            "vintage room design AI",
            "retro home decor ideas",
            "vintage style interior",
        ],
    },
    luxury: {
        name: "Luxury",
        slug: "luxury",
        tagline: "Exceptional materials, expert craft, enduring quality",
        description:
            "Luxury interiors are defined not by expense for its own sake but by the rigorous selection of materials and the quality of their execution. Marble with visible veining, hand-stitched upholstery, bespoke joinery, and lighting designed for a specific space create environments where every surface repays close inspection.",
        tips: [
            {
                title: "Invest in the surfaces you touch most",
                description:
                    "Tactile quality matters more than visual grandeur in genuine luxury. Stone worktops, solid brass hardware, full-grain leather, and hand-woven fabrics justify their cost through daily pleasure rather than statement impact. Prioritise materials in the places where your hands and body make regular contact.",
            },
            {
                title: "Commission custom joinery for storage",
                description:
                    "Bespoke cabinetry that fits a space precisely — from floor to ceiling, around awkward angles, integrated with architectural details — is one of the most effective luxury investments. Off-the-shelf storage solutions create visible compromises that undermine the quality of everything around them.",
            },
            {
                title: "Specify lighting in layers",
                description:
                    "A luxury interior with poor lighting is a contradiction. Engage a lighting designer or research three-layer lighting: ambient (overall light level), task (functional brightness where needed), and accent (highlighting specific materials or objects). Multiple circuits and dimmers allow the mood to shift across the day.",
            },
            {
                title: "Edit to the point of restraint",
                description:
                    "True luxury interiors are not maximalist. Excellent materials need space to be appreciated. Removing ten ordinary objects from a room and replacing them with nothing is often more effective than adding one expensive piece to a cluttered room. Restraint is itself a luxury signal.",
            },
        ],
        keywords: [
            "luxury interior design",
            "luxury room design AI",
            "high-end home decor",
            "premium interior design ideas",
        ],
    },
    japandi: {
        name: "Japandi",
        slug: "japandi",
        tagline: "Wabi-sabi meets hygge — imperfect simplicity",
        description:
            "Japandi fuses Japanese wabi-sabi philosophy with Scandinavian hygge sensibility, producing spaces that celebrate natural imperfection, restrained craftsmanship, and deliberate calm. Unlike either parent style alone, Japandi rooms feel simultaneously minimal and warm, with natural materials — pale wood, rattan, linen — playing against muted earthy tones and carefully edited objects.",
        tips: [
            {
                title: "Embrace asymmetry and natural imperfection",
                description:
                    "Japandi interiors reject the pursuit of flawless symmetry. A handmade ceramic bowl with an uneven rim, a branch arranged in a vase, or a linen throw with a visible weave all carry more character than manufactured equivalents. Selecting objects with visible signs of making or natural irregularity is one of the most direct ways to achieve the wabi-sabi quality the style depends on.",
            },
            {
                title: "Keep the palette muted and drawn from nature",
                description:
                    "Japandi colour ranges from warm off-white and undyed linen through clay, moss, and charcoal. Saturated colour rarely appears. When choosing paint or fabric, hold samples against natural materials in real daylight — the goal is a palette that makes the room feel neither stark nor busy, but quietly grounded.",
            },
            {
                title: "Choose furniture with honest joinery",
                description:
                    "The furniture that fits Japandi best shows how it is made — visible mortise-and-tenon joints, hand-rubbed oil finishes, and simple forms with no applied decoration. Scandinavian-influenced pieces with lower profiles and Japanese-influenced pieces with fine, precise detailing both work well in the same room because they share an underlying commitment to craft over ornamentation.",
            },
            {
                title: "Limit objects to those with clear purpose or beauty",
                description:
                    "Both Japanese and Scandinavian design traditions hold that objects on display should either serve a function or be genuinely beautiful — ideally both. Before placing anything on a surface, apply this test. Clearing surfaces to a curated few pieces and leaving the rest of the shelf or table empty is not incompleteness — it is the point.",
            },
        ],
        keywords: [
            "japandi interior design",
            "japandi room ideas",
            "japanese scandinavian design",
            "japandi home decor",
        ],
    },
    "art-deco": {
        name: "Art Deco",
        slug: "art-deco",
        tagline: "Glamour, geometry, and gold — the roaring twenties reimagined",
        description:
            "Art Deco interior design is an exercise in confident opulence — geometric patterns, mirrored surfaces, rich jewel tones, and metallic accents assembled to create spaces that feel theatrical and deliberate. Born in 1920s Paris and popularised globally through the 1930s, the style translates into contemporary residential settings when applied with discipline and a selective hand rather than wholesale reproduction.",
        tips: [
            {
                title: "Use geometry as a structural design element",
                description:
                    "Art Deco draws its visual energy from bold geometric forms — sunburst patterns, chevrons, stepped profiles, and fan shapes. Rather than applying these as surface decoration alone, look for furniture and architectural details that carry them structurally: a headboard with a geometric silhouette, skirting boards with stepped profiles, or a rug with a strong geometric repeat. The geometry should feel built-in, not stuck-on.",
            },
            {
                title: "Anchor with jewel tones and add metallics sparingly",
                description:
                    "Deep emerald, sapphire, amethyst, and burgundy are the natural palette of Art Deco. Use one as the dominant wall or upholstery colour and introduce gold, brass, or black lacquer as accent rather than structure. When metallics appear on too many surfaces simultaneously, the room tips from glamorous into gaudy. A single prominent gold element — a ceiling light, a console frame — reads more powerfully than six smaller ones.",
            },
            {
                title: "Incorporate mirrored and reflective surfaces thoughtfully",
                description:
                    "Mirrored furniture, glass table tops, and lacquered surfaces are signature Art Deco elements, and their practical function — making rooms feel larger and moving light around — is genuinely valuable. Position mirrored pieces to reflect a window or a decorative light source rather than a blank wall. Too many reflective surfaces in one sightline create visual noise; used selectively, they amplify the room's best features.",
            },
            {
                title: "Balance opulence with restraint",
                description:
                    "The most successful contemporary Art Deco interiors borrow the language of the period without attempting full reproduction. Choose two or three signature elements per room — a geometric light fitting, velvet upholstery in a jewel tone, a brass-framed mirror — and build around a restrained base. Letting the key pieces breathe within a calmer surrounding makes them read as deliberate rather than accumulated.",
            },
        ],
        keywords: [
            "art deco interior design",
            "art deco room ideas",
            "art deco home decor",
            "geometric interior design",
        ],
    },
    coastal: {
        name: "Coastal",
        slug: "coastal",
        tagline: "Breezy, light-filled spaces that bring the ocean indoors",
        description:
            "Coastal design distils the sensory experience of seaside living into an interior language — salt-bleached timbers, woven textures, the shifting blue-green palette of shallow water, and an abundance of natural light. At its best it is neither nautical-themed nor literalist; instead it creates rooms that feel genuinely relaxed and connected to the natural environment outside, with materials and colours that reference the coast without reproducing it.",
        tips: [
            {
                title: "Prioritise natural light and window treatments that maximise it",
                description:
                    "Natural light is the defining quality of coastal interiors. Replace heavy drapes with linen sheers, remove window frames that block peripheral light, and use pale, reflective surfaces on walls and floors to carry that light deeper into the room. Light-coloured linen or cotton voile panels that move in a breeze are more faithful to the coastal aesthetic than any decorative element you could add.",
            },
            {
                title: "Build the palette around whites, sand, and water",
                description:
                    "A coastal palette is bleached and light — white, off-white, warm sand, driftwood grey, and the blue-greens of shallow sea water. The blue-green tones should be soft and slightly desaturated; saturated navy or royal blue feels nautical rather than coastal. Use the lighter neutrals as the primary base and introduce the blue-green tones selectively through textiles, ceramics, or a single accent wall.",
            },
            {
                title: "Choose natural, tactile materials over synthetic alternatives",
                description:
                    "Seagrass, sisal, rattan, woven cotton, weathered oak, and unglazed ceramics all carry the material sensibility of the coast. When selecting furniture and accessories, ask whether the material itself could have come from or been shaped by a coastal environment. Avoid plastic or resin equivalents of natural materials — they flatten the tactile quality that makes coastal interiors feel genuinely relaxing.",
            },
            {
                title: "Avoid over-theming with nautical accessories",
                description:
                    "Anchor prints, ship wheels, and lighthouse ornaments signal 'beach house' rather than creating an actual coastal atmosphere. The most convincing coastal interiors rely on material quality, light, and spatial openness rather than thematic decoration. If you want a reference to the sea, a large piece of sea glass, a bowl of smooth stones, or a single botanical print of coastal flora will do more than a shelf of maritime ornaments.",
            },
        ],
        keywords: [
            "coastal interior design",
            "coastal living room",
            "beach house decor",
            "coastal home design ideas",
        ],
    },
    farmhouse: {
        name: "Farmhouse",
        slug: "farmhouse",
        tagline: "Warmth, patina, and the honest beauty of working materials",
        description:
            "Farmhouse interior design values substance over surface — reclaimed wood, hand-thrown ceramics, linen and cotton textiles, and furniture that has earned its character through use rather than applied distressing. Contemporary farmhouse interiors balance this material honesty with thoughtful editing that prevents the aesthetic from reading as cluttered or nostalgic, creating rooms that feel lived-in and genuinely warm.",
        tips: [
            {
                title: "Source materials with genuine history where possible",
                description:
                    "The quality that separates authentic farmhouse design from its imitators is the difference between genuine patina and manufactured distressing. Reclaimed timber beams, vintage furniture, hand-thrown ceramics with irregular glazes, and natural stone floors all carry a visual honesty that factory-distressed alternatives cannot replicate. Even if a single authentic piece costs more, it will define the room more effectively than ten new-but-aged substitutes.",
            },
            {
                title: "Use a neutral palette anchored by natural texture",
                description:
                    "Farmhouse interiors work in warm whites, creams, warm greys, and the natural tones of unfinished wood. The colour interest comes from texture — the grain of timber, the weave of linen, the rough surface of stone — rather than paint. If you introduce colour, keep it as a single accent through a textile, a painted cabinet, or a piece of stoneware, and ensure it reads as a natural pigment rather than a synthetic one.",
            },
            {
                title: "Mix old and new pieces with confidence",
                description:
                    "Contemporary farmhouse design does not require period furniture. A modern sofa with clean lines sits naturally in a farmhouse room if it is upholstered in natural linen or cotton, positioned near a reclaimed wood beam or an antique chest. The key is that the new pieces share the same material honesty — natural fibres, simple forms, no applied decoration — as the older ones.",
            },
            {
                title: "Let functional objects become decorative elements",
                description:
                    "In farmhouse design, objects are not hidden away; they are displayed because they are good at what they do. A copper pot on an open shelf, a bunch of dried herbs above the window, a woven basket holding firewood — these serve purposes while contributing to the room's character. Avoid decorating with objects that only exist to look decorative; it produces the opposite of authenticity.",
            },
        ],
        keywords: [
            "farmhouse interior design",
            "farmhouse style home",
            "rustic farmhouse decor",
            "modern farmhouse design ideas",
        ],
    },
    mediterranean: {
        name: "Mediterranean",
        slug: "mediterranean",
        tagline: "Sun-warmed, textured, and alive with colour and light",
        description:
            "Mediterranean interior design draws from the architecture and material culture of southern Europe — terracotta tiles, whitewashed walls, wrought iron, handmade ceramics, and the warm, vivid colour palette of Spain, Italy, and Greece. The style is most successful when it prioritises texture, craft, and the interaction of light with tactile surfaces rather than simply applying colour.",
        tips: [
            {
                title: "Build around terracotta, stone, and ceramic tile",
                description:
                    "Mediterranean architecture is almost inseparable from terracotta tile floors, stone walls, and handmade ceramic surfaces. These materials regulate temperature, age beautifully, and carry a visual warmth that painted surfaces cannot replicate. If structural tile is not possible, introducing terracotta pots, hand-painted ceramic tiles as a splashback, or stone as a worktop surface achieves a material connection to the style that reads authentically.",
            },
            {
                title: "Use white as the base and saturated accents deliberately",
                description:
                    "The most enduring Mediterranean interiors use white or off-white generously on walls and ceilings, then introduce saturated colour in specific places — a set of blue-painted shutters, a terracotta-tiled floor, a vivid mosaic panel. This contrast between the bright white base and the warm, intense accents is what gives the style its characteristic sense of light and liveliness. Applying saturated colour everywhere sacrifices this dynamic.",
            },
            {
                title: "Incorporate handcraft and artisan objects",
                description:
                    "Mediterranean design is grounded in artisan production — hand-thrown pottery, hand-woven textiles, hand-forged ironwork. Introducing these objects connects a room to the design tradition more effectively than any paint colour. Look for ceramic table lamps, wrought iron candle holders, hand-painted tiles, and woven kilim rugs in natural dyes. The slight irregularity of handmade objects is a feature, not a defect.",
            },
            {
                title: "Frame outdoor connections wherever possible",
                description:
                    "Mediterranean houses are designed around outdoor living, and the best interiors in this style acknowledge that relationship. If you have access to a garden, terrace, or even a small balcony, use the window as a deliberate frame — sheer curtains that move in outdoor air, furniture positioned to look toward greenery, and materials that transition gracefully between inside and outside spaces.",
            },
        ],
        keywords: [
            "mediterranean interior design",
            "mediterranean home decor",
            "spanish interior design",
            "italian interior design ideas",
        ],
    },
    transitional: {
        name: "Transitional",
        slug: "transitional",
        tagline: "The best of traditional and contemporary, seamlessly united",
        description:
            "Transitional interior design sits in the productive tension between traditional warmth and contemporary clarity. It avoids the formality of classical interiors while retaining their sense of permanence, and avoids the austerity of modern design while adopting its clean geometry and functional approach. The result is rooms that feel neither dated nor aggressively current — permanently liveable rather than momentarily fashionable.",
        tips: [
            {
                title: "Pair traditional forms with contemporary finishes",
                description:
                    "Transitional design often places a traditionally-shaped sofa — with rolled arms, turned legs, or a classic Chesterfield profile — in a material that reads as current: performance linen, a muted geometric fabric, or a solid mid-tone neutral. The tension between familiar form and updated finish is the source of the style's appeal. The same principle applies to case furniture, lighting, and architectural elements.",
            },
            {
                title: "Use a neutral palette with subtle warmth",
                description:
                    "Transitional interiors avoid both the cool greys of contemporary design and the warm creams of traditional interiors. The sweet spot is a slightly warm neutral — greige, warm white, taupe, soft stone — that reads as neither strictly modern nor period. Introduce depth through texture and tone variation rather than colour contrast. Wood tones should be medium rather than very pale (Scandi) or very dark (traditional).",
            },
            {
                title: "Mix antique or vintage pieces with new ones deliberately",
                description:
                    "The most convincing transitional rooms contain at least one piece with genuine age alongside contemporary items. An antique mirror above a modern console, a traditional painting in a slim metal frame, or a vintage rug under a clean-lined sofa all create the temporal layering that distinguishes transitional from either pure contemporary or period design. The key is that each piece should be genuinely well-designed, not just old.",
            },
            {
                title: "Keep architectural detail moderate",
                description:
                    "Transitional design uses mouldings, cornices, and panelling where they exist but doesn't add elaborate period detail to contemporary spaces. Simple panel moulding on a door, a restrained cornice, or a classic skirting board profile is enough architectural reference. Avoid reproduced ornate period detailing — it pushes the room into traditional territory — and avoid stripping all detail — it tips it into pure contemporary.",
            },
        ],
        keywords: [
            "transitional interior design",
            "transitional home decor",
            "classic modern interior",
            "timeless interior design ideas",
        ],
    },
};

export const ROOM_DATA: Record<string, IRoomData> = {
    "living-room": {
        name: "Living Room",
        slug: "living-room",
        description:
            "The living room is typically the room in a home that does the most social work — hosting guests, accommodating family life, and providing daily rest — which means its design must balance multiple, sometimes conflicting, demands simultaneously.",
        considerations: [
            {
                title: "Traffic flow and furniture arrangement",
                description:
                    "Before selecting any furniture, mark out the room's natural pathways on a floor plan. Entrances, exits, connections to adjacent rooms, and the primary seating orientation all create movement lines that furniture should accommodate rather than block. Allow at least 90cm of clear walking space on main routes.",
            },
            {
                title: "Acoustic comfort alongside visual appeal",
                description:
                    "Hard-surfaced rooms — tiled floors, plaster walls, minimal textiles — create echo and reflected sound that makes conversation tiring and television difficult to hear clearly. Rugs, upholstered furniture, curtains, and bookshelves all absorb sound energy and make a room significantly more comfortable to spend time in.",
            },
            {
                title: "Lighting for different activities and times of day",
                description:
                    "A living room used for watching films in the evening, reading in the afternoon, and hosting guests needs different lighting for each activity. Installing separate switches or dimmers for overhead, floor, and table lamps gives you control over the room's atmosphere without requiring structural changes.",
            },
        ],
        keywords: [
            "living room design",
            "AI living room redesign",
            "living room makeover",
            "living room interior design",
        ],
    },
    bedroom: {
        name: "Bedroom",
        slug: "bedroom",
        description:
            "A bedroom's primary obligation is to support sleep — which means every design decision must be evaluated against how it affects rest, thermal comfort, light control, and the psychological sense of separation from the demands of daily life.",
        considerations: [
            {
                title: "Blackout and light control",
                description:
                    "Light is the primary regulator of the human sleep-wake cycle, so controlling it is the single most important functional consideration in a bedroom. Full blackout blinds or lined curtains should be the default, regardless of aesthetic style. Sheer-only window treatments look elegant but actively impair sleep quality.",
            },
            {
                title: "Bed position relative to the door",
                description:
                    "Placing the headboard against a solid wall, with a view of the door from the bed, is the arrangement most people find instinctively restful. Beds positioned so the door opens directly onto the sleeper's feet, or with the headboard against a window, tend to feel unsettling even when the room otherwise looks good.",
            },
            {
                title: "Temperature and ventilation materials",
                description:
                    "Synthetic textiles, VOC-emitting finishes, and poor air circulation all affect bedroom air quality and sleep temperature. Natural fibre bedding (cotton, linen, or wool), breathable mattress materials, and a window that can be safely opened overnight cost no more than their alternatives and measurably improve sleep.",
            },
        ],
        keywords: [
            "bedroom design ideas",
            "AI bedroom redesign",
            "bedroom interior design",
            "bedroom makeover AI",
        ],
    },
    kitchen: {
        name: "Kitchen",
        slug: "kitchen",
        description:
            "The kitchen is the most technically complex room in a home to design well, because it must solve a functional workflow problem — food preparation, cooking, cleaning, and storage — while also meeting the aesthetic expectations of one of the most-used and most-photographed spaces in any home.",
        considerations: [
            {
                title: "The work triangle and workflow efficiency",
                description:
                    "Kitchen designers use the concept of the work triangle — the relationship between sink, hob, and refrigerator — as a starting framework for layout. The combined distances between these three points should ideally total between 4 and 8 metres. But in modern open-plan kitchens, workflow zones (prep, cooking, cleaning, storage) are often a more useful organising principle than the triangle.",
            },
            {
                title: "Ventilation as a structural priority",
                description:
                    "Effective extraction above a cooking surface is not an optional upgrade — it affects air quality, surface maintenance, and the longevity of cabinetry and finishes throughout the room. The extraction rate (measured in cubic metres per hour) should be sized to the volume of the kitchen, not the size of the hob.",
            },
            {
                title: "Countertop material selection and maintenance",
                description:
                    "Kitchen worktop materials vary enormously in their maintenance requirements, heat resistance, stain resistance, and durability. Marble is visually exceptional but requires sealing and accepts surface marks. Quartz composites resist most damage but can be damaged by extreme heat. Solid hardwood develops character but needs oiling. Choose based on how you actually cook, not on how the surface photographs.",
            },
        ],
        keywords: [
            "kitchen design ideas",
            "AI kitchen redesign",
            "kitchen interior design",
            "kitchen renovation ideas",
        ],
    },
    bathroom: {
        name: "Bathroom",
        slug: "bathroom",
        description:
            "Bathrooms present unique design constraints because every material must perform in a high-moisture, high-use environment while the room itself is usually small, fixed in its plumbing positions, and expected to look good for ten or more years without major renovation.",
        considerations: [
            {
                title: "Waterproofing as the non-negotiable foundation",
                description:
                    "All visible finishes in a bathroom sit on top of a waterproofing system that must be correctly specified and installed before any aesthetic decisions matter. Inadequate tanking or incorrectly applied membrane systems behind tiles or cladding cause failures that are expensive and disruptive to remediate. Budget for this correctly before spending on surface finishes.",
            },
            {
                title: "Scale of fittings relative to the room",
                description:
                    "Bathroom showrooms display products in generous open spaces that bear no resemblance to a typical bathroom's dimensions. A large freestanding bath that looks proportionate in a showroom can make a small bathroom feel unusable. Always work from accurate room dimensions and leave adequate clear space around each fitting for comfortable use.",
            },
            {
                title: "Ventilation to prevent mould and surface degradation",
                description:
                    "Mechanical ventilation — a correctly sized extractor fan that runs during use and for a timed period afterwards — is essential in any bathroom without reliable natural ventilation. Even in bathrooms with windows, condensation accumulates faster than natural airflow removes it. Mould damage to grout, silicone, and decorative surfaces is the most common bathroom maintenance problem and is largely preventable.",
            },
        ],
        keywords: [
            "bathroom design ideas",
            "AI bathroom redesign",
            "bathroom interior design",
            "bathroom renovation ideas",
        ],
    },
    "dining-room": {
        name: "Dining Room",
        slug: "dining-room",
        description:
            "The dining room — or dining zone in an open-plan layout — needs to work for both the intimacy of daily family meals and the occasion of entertaining guests, which demands flexibility in lighting, furniture arrangement, and acoustic separation from adjacent spaces.",
        considerations: [
            {
                title: "Table size and seating clearance",
                description:
                    "A dining table needs at least 90cm of clear space on all sides to allow chairs to be pulled out fully and people to move around occupied seating. Many dining rooms are furnished with tables that are too large for comfortable circulation, which makes the room feel cramped regardless of how it is decorated. Measure first; choose the table second.",
            },
            {
                title: "Pendant lighting positioned precisely over the table",
                description:
                    "The pendant or chandelier over a dining table is one of the few interior design elements where precise positioning matters as much as appearance. The bottom of a pendant should hang roughly 75-85cm above the table surface — low enough to create intimacy, high enough not to obstruct sightlines across the table. A fitting that is off-centre relative to the table is immediately noticeable and difficult to adjust without electrical work.",
            },
            {
                title: "Storage for tableware near the table",
                description:
                    "A sideboard, dresser, or fitted storage unit in a dining room does double duty — it stores the items needed for the table (glasses, serving dishes, tablecloths, candles) and provides a surface for serving dishes and a display area for decorative objects. A dining room without storage tends to feel unfinished and creates practical inconvenience at every meal.",
            },
        ],
        keywords: [
            "dining room design ideas",
            "AI dining room redesign",
            "dining room interior design",
            "dining room makeover",
        ],
    },
    office: {
        name: "Office",
        slug: "office",
        description:
            "A home office must deliver sustained functional performance — adequate light, ergonomic comfort, acoustic privacy, and effective storage — while fitting within a domestic environment that usually has competing demands on the same space.",
        considerations: [
            {
                title: "Ergonomics before aesthetics",
                description:
                    "The desk height, chair adjustability, monitor position, and lighting quality in a home office have direct effects on physical health and cognitive performance across a working day. A visually beautiful office that requires a compromised posture or creates eyestrain will affect both wellbeing and productivity. Solve ergonomics first, then design around the correct setup.",
            },
            {
                title: "Separation from domestic life",
                description:
                    "Working from home requires some degree of psychological separation between work mode and home mode, even when the physical space is shared. A defined desk position that can be left at the end of the day, a door that closes, or even a screen or curtain that covers work equipment when not in use all help create that boundary in ways that improve work quality and rest quality.",
            },
            {
                title: "Cable management from the start",
                description:
                    "Power, monitor cables, network cables, and device charging cables in an unmanaged home office create both visual clutter and practical inconvenience. Planning cable routing before furniture is positioned — including desk grommets, in-desk power units, cable trays, and wall channels — is far more effective than retrofitting solutions around an existing setup.",
            },
        ],
        keywords: [
            "home office design ideas",
            "AI office redesign",
            "home office interior design",
            "office setup design",
        ],
    },
    "gaming-room": {
        name: "Gaming Room",
        slug: "gaming-room",
        description:
            "A dedicated gaming room needs to solve several technical problems simultaneously — screen glare control, acoustic management, cable organisation, and ergonomic seating for extended sessions — while creating an environment that is genuinely motivating to spend time in.",
        considerations: [
            {
                title: "Screen placement and ambient light control",
                description:
                    "Monitor glare and ambient light that washes out a display are the most common functional problems in gaming rooms. Blackout blinds or heavy curtains are often essential even if the room faces away from direct sunlight, since overhead lighting and reflected daylight can significantly degrade image quality. Position screens away from windows where possible, or use anti-glare panels.",
            },
            {
                title: "Seating designed for extended use",
                description:
                    "Gaming sessions lasting several hours place specific demands on seating that general lounge furniture does not meet. The lumbar support, seat depth, armrest height, and reclining range of a chair matter considerably when someone is seated and focused for two to four hours at a time. Ergonomic gaming chairs and monitors at correct eye height together reduce the most common physical complaints associated with extended gaming.",
            },
            {
                title: "Acoustic treatment for both immersion and consideration",
                description:
                    "Sound quality matters in a gaming environment, but so does containing that sound. Acoustic foam panels or fabric-wrapped acoustic boards on walls reduce reflected sound inside the room, improving the clarity of surround sound or headphone audio. They also reduce the amount of noise that travels to adjacent rooms, which matters considerably in shared households.",
            },
        ],
        keywords: [
            "gaming room design ideas",
            "AI gaming room setup",
            "gaming setup interior design",
            "gaming room makeover",
        ],
    },
    nursery: {
        name: "Nursery",
        slug: "nursery",
        description:
            "A nursery must solve design challenges that no other room faces: it needs to be safe for a newborn, stimulating enough for a developing mind, and adaptable enough to serve a child across the first several years of life. It must also accommodate parents who will spend significant time in the space, often during night hours, which makes the functional and sensory decisions here unusually consequential.",
        considerations: [
            {
                title: "Safety first — no exceptions",
                description:
                    "All furniture should meet current safety standards for children's products — cot and bed heights, guardrail dimensions, and stability requirements vary by country and are updated regularly. Secure all tall furniture to walls with anti-tip brackets, eliminate blind cords entirely, and ensure any paint or finish used in the room is non-toxic and fully cured before occupation. These requirements should be confirmed before purchasing any item, not retrofitted afterward.",
            },
            {
                title: "Design for the full growth arc, not just infancy",
                description:
                    "A room designed only for a newborn will require complete refurnishing within eighteen months. Choose a cot that converts to a toddler bed, invest in a chest of drawers that can serve as a changing station now and a wardrobe component later, and select a wall colour that will not feel babyish at age five. Spending more on fewer, more adaptable pieces produces better value than decorating purely for the first year.",
            },
            {
                title: "Manage light for both daytime and night-time functions",
                description:
                    "Nurseries require blackout capability during the day for nap times and a very low-level warm light source for night feeds and settling. Full blackout blinds or curtains with a blackout lining are essential from day one. Install a secondary warm, dimmable light — a plug-in lamp with a warm bulb at low level — so that night duties can happen without triggering full wakefulness in either parent or child.",
            },
        ],
        keywords: [
            "nursery design ideas",
            "baby room interior design",
            "nursery decor ideas",
            "AI nursery design",
        ],
    },
    "laundry-room": {
        name: "Laundry Room",
        slug: "laundry-room",
        description:
            "The laundry room is the most functional space in a home, but that does not mean it has to be the least considered. Purpose-designed utility spaces that are genuinely pleasant to spend time in actively improve the likelihood that household tasks are completed promptly and that adjacent areas stay organised. Practicality and considered design are not in competition here — the brief requires both simultaneously.",
        considerations: [
            {
                title: "Plan storage before selecting appliances",
                description:
                    "The most common laundry room failure is installing appliances and then trying to organise around them. Start by listing everything that needs to be stored — detergent, fabric softener, ironing equipment, cleaning supplies, spare linens — and allocate specific storage positions for each before finalising the layout. Tall cabinets above machines, pull-out laundry sorting hampers built into lower cabinetry, and a fold-down ironing board mounted in a wall cabinet are all significantly more functional than open shelving added after the fact.",
            },
            {
                title: "Include a dedicated folding and sorting surface",
                description:
                    "The absence of a folding surface is the single most common reason laundry piles up unfolded. A counter running the full width of the room above the machines, even at 50cm deep, transforms how the space is used. If the room is very small, a wall-mounted fold-down surface that collapses flat when not in use provides the functionality without permanently occupying floor space.",
            },
            {
                title: "Ventilate properly to prevent moisture problems",
                description:
                    "Tumble dryers produce large volumes of humid air, and washing machines create heat and steam during operation. Without adequate ventilation, this moisture accumulates in wall cavities and behind appliances, leading to mould, damaged finishes, and poor air quality throughout adjacent rooms. An externally-vented extractor fan running during and after operation is the minimum requirement; a heat recovery ventilation system is the ideal solution in a fully insulated home.",
            },
        ],
        keywords: [
            "laundry room design ideas",
            "utility room design",
            "laundry room makeover",
            "AI laundry room design",
        ],
    },
    basement: {
        name: "Basement",
        slug: "basement",
        description:
            "A basement presents one of the more interesting design challenges in residential interiors: a space that is typically below grade, often low in natural light, and underused by default. Converted thoughtfully, it can become one of the most useful and private areas in the home — a cinema room, gym, guest suite, or family room that does not compete with the main living areas above.",
        considerations: [
            {
                title: "Solve moisture and waterproofing before any other decision",
                description:
                    "No interior finish, flooring, or furniture choice will perform adequately in a basement that has not been properly waterproofed. Before planning any conversion, assess the perimeter walls and slab for signs of water ingress — efflorescence, damp patches, or previous flooding. Any water management issue must be resolved at structural level before any interior work begins. Retrofitting waterproofing after finishes are installed costs significantly more than addressing it first.",
            },
            {
                title: "Compensate for limited natural light deliberately",
                description:
                    "Basements with below-grade windows or no windows require a layered artificial lighting strategy that replaces the role natural light would play. Recessed ceiling lights should be supplemented with wall-level and task lighting to create depth and prevent the flat, institutional quality of overhead-only illumination. Warm colour temperatures (2700–3000K), light-coloured walls and ceilings to maximise reflection, and well-placed mirrors where window wells exist will all improve the sense of light significantly.",
            },
            {
                title: "Choose flooring that tolerates basement conditions",
                description:
                    "Basements are prone to higher humidity and temperature fluctuation than above-grade spaces, and some flooring materials perform very poorly under these conditions. Solid hardwood expands and contracts excessively and is not recommended. Luxury vinyl tile, engineered hardwood with a stable core, polished concrete, or porcelain tile are all appropriate choices. A floating installation rather than a glued-down one also accommodates minor moisture movement without permanent damage.",
            },
        ],
        keywords: [
            "basement design ideas",
            "basement conversion interior",
            "finished basement ideas",
            "basement room design",
        ],
    },
    sunroom: {
        name: "Sunroom",
        slug: "sunroom",
        description:
            "A sunroom occupies an unusual position in a home — partly interior, partly exterior, designed to maximise natural light and connection to the garden while remaining sheltered from weather. Its design brief is distinct from any other room: the architecture and glazing do most of the work, and the interior furnishing must respond to those conditions — intense light, temperature variation, and visual connection to the outside — rather than fight them.",
        considerations: [
            {
                title: "Choose materials that tolerate direct sunlight and heat",
                description:
                    "A south-facing sunroom can reach very high temperatures in summer and suffer significant UV exposure year-round. Many materials that perform well in shaded interior rooms fade, warp, or deteriorate under these conditions. Choose UV-stable fabrics — solution-dyed acrylic outdoor fabrics perform exceptionally well — and avoid dark upholstery that will absorb heat uncomfortably. Solid hardwood furniture may develop stress cracks in rooms with significant temperature and humidity fluctuation; engineered pieces or materials designed for outdoor use will outlast them.",
            },
            {
                title: "Design for glare management alongside light maximisation",
                description:
                    "The same glazing that makes a sunroom bright and pleasant in winter can create uncomfortable glare and heat in summer. Cellular blinds or roller blinds with heat-reflective backing can be fitted within the roof glazing to reduce solar gain without eliminating daylight. Planting outside the glazed walls — deciduous climbers that provide shade in summer and admit light after leaf-fall in winter — is an elegant and effective long-term solution.",
            },
            {
                title: "Connect the flooring to the outdoor space visually",
                description:
                    "One of the most effective design moves in a sunroom is to use a flooring material that bridges indoors and outdoors — large-format porcelain tile that continues as paving outside, or natural stone used inside and on an adjacent terrace. This visual continuity makes the garden feel like an extension of the interior rather than a separate space, which is precisely the quality that makes sunrooms valuable as living spaces.",
            },
        ],
        keywords: [
            "sunroom design ideas",
            "sunroom interior design",
            "conservatory decor",
            "sunroom furniture ideas",
        ],
    },
    "home-theater": {
        name: "Home Theater",
        slug: "home-theater",
        description:
            "A dedicated home theater room exists to maximise the audio-visual experience of watching film and television, which means its design brief is unusually technical. Every element — wall colour, seat arrangement, acoustic treatment, projector or screen placement, and lighting — either supports or undermines the viewing experience. Understanding these relationships before committing to finishes is particularly valuable.",
        considerations: [
            {
                title: "Control ambient light completely",
                description:
                    "Projected images and even high-quality screens lose significant contrast and colour accuracy in the presence of ambient light. Full blackout window treatments are non-negotiable in a dedicated cinema room. Walls should be painted in dark, matte, non-reflective finishes — deep grey, charcoal, or dark navy are common choices — to prevent reflected light from the screen washing out dark areas of the image. Any bias lighting behind the screen (used to reduce eye strain) should be warm-toned and very low intensity.",
            },
            {
                title: "Address acoustics from the room-planning stage",
                description:
                    "Bare walls and hard floors create reflected sound that degrades audio quality in ways that expensive speaker upgrades cannot overcome. Acoustic treatment in a home theater should address first-reflection points — the side walls and ceiling at the position where sound from the speakers first bounces before reaching the listener. Bass traps in corners control low-frequency buildup. Acoustic panels, heavy curtains, upholstered seating, and thick carpeting all contribute to sound absorption. These need to be planned into the room's design, not added as afterthought decoration.",
            },
            {
                title: "Plan tiered seating for rooms deeper than 3.5 metres",
                description:
                    "In a long room with more than one row of seating, the second row will have obstructed sightlines unless it is elevated. A raised platform of 15–20cm behind the front row resolves this cleanly. The platform also provides a natural housing location for in-floor conduits routing speaker cables and power to the rear row. If the room depth allows for only one row, this consideration does not apply, but it is essential to plan for cable management from the start regardless.",
            },
        ],
        keywords: [
            "home theater design ideas",
            "home cinema interior design",
            "media room design",
            "home theater room setup",
        ],
    },
    mudroom: {
        name: "Mudroom",
        slug: "mudroom",
        description:
            "The mudroom is the first line of defence between outdoor disorder and interior calm. A well-designed mudroom contains the transition from outside to inside — boots, coats, bags, and the general accumulation of daily life — so that none of it spreads into the main living areas. It is a working room whose design is almost entirely driven by what it must contain and how efficiently it must function for every member of the household.",
        considerations: [
            {
                title: "Allocate dedicated storage per person",
                description:
                    "The most organised mudrooms give each household member their own storage zone rather than shared hooks and cubbies that accumulate confusion. Assign each person a coat hook at the right height, a cubby or basket for shoes, and a shelf or hook for bags. In a family with children, hooks at child height alongside adult-height hooks are a functional necessity rather than a design choice. Labelling zones, at least temporarily until habits form, reduces significantly the likelihood that items migrate into the wrong place.",
            },
            {
                title: "Choose surfaces that tolerate wet, mud, and heavy use",
                description:
                    "A mudroom is subjected to more abuse than almost any other interior space — wet boots, muddy dogs, dripping outdoor gear, and heavy bag dropping. The floor should be a hard, impermeable surface that can be mopped without damage: large-format porcelain tile, slate, or poured concrete are all excellent choices. Wall surfaces behind hooks and cubbies should be cleanable; painted board-and-batten or a full-height boot room panel are more durable than plasterboard alone.",
            },
            {
                title: "Include a bench for putting on and removing footwear",
                description:
                    "The absence of a sitting surface in a mudroom creates the single greatest friction point in its daily use: people take shoes off at the door then carry them further inside rather than organising them properly because there is nowhere to sit. A bench — even a simple, narrow one — anchors the shoe removal process at the entry point. Under-bench storage for spare boots or seasonal footwear makes the bench more useful still.",
            },
        ],
        keywords: [
            "mudroom design ideas",
            "mudroom interior design",
            "entryway storage design",
            "mudroom makeover ideas",
        ],
    },
    "walk-in-closet": {
        name: "Walk-in Closet",
        slug: "walk-in-closet",
        description:
            "A walk-in closet is a storage system with an interior design problem: it must organise a wardrobe efficiently while creating an environment where the act of choosing what to wear is genuinely pleasant. The balance between visible organisation, lighting quality, and material finish determines whether a walk-in closet feels like an aspirational dressing room or an overwhelming storage problem.",
        considerations: [
            {
                title: "Map your wardrobe before designing the storage",
                description:
                    "Every walk-in closet configuration should begin with a wardrobe audit: count the number of full-length hanging items, folded items, shoes, bags, and accessories. The most common error is allocating too much long-hang rail space relative to short-hang and shelving. Most wardrobes are dominated by shirts, jackets, and folded items — not full-length dresses — and a layout that reflects actual wardrobe composition will feel better organised and less cramped than a generic equal-division layout.",
            },
            {
                title: "Light every zone with dedicated task lighting",
                description:
                    "A single ceiling light in a walk-in closet is insufficient. Hanging rails require downlighting at 45 degrees to illuminate the garments rather than the tops of hangers. Shoe shelves need light angled at their face, not their top surface. Drawers and lower cabinets benefit from interior lighting triggered by opening. LED strip lighting mounted beneath shelves and inside cabinets is an efficient and cost-effective solution. The goal is to make every item immediately visible without shadows obscuring colour or detail.",
            },
            {
                title: "Include a full-length mirror with adequate clearance",
                description:
                    "A walk-in closet without a full-length mirror is functionally incomplete — users will get dressed and leave to check appearance elsewhere, defeating part of the room's purpose. Position the mirror on the end wall or on a door, with at least 60cm of clear floor space in front of it and good light falling on the person rather than from behind them. A second smaller mirror at an angle near the door, positioned to show the back view, is a useful addition in larger closets.",
            },
        ],
        keywords: [
            "walk-in closet design ideas",
            "dressing room interior design",
            "closet organisation design",
            "walk-in wardrobe ideas",
        ],
    },
};

// Unique intro paragraphs for key combinations: keyed by `${theme}-${roomSlug}`
export const COMBINATION_INTROS: Record<string, string> = {
    "modern-living-room":
        "A modern living room sits at the intersection of visual restraint and daily functionality. By reducing the number of objects, materials, and colours in play, each element that remains carries more weight, and the room feels more considered as a result. AI-assisted visualisation lets you test different proportions and layouts before committing to furniture that is difficult or expensive to return.",
    "modern-bedroom":
        "Sleep environments benefit from the same clarity that modern design brings to every room it inhabits. Reducing visual complexity in a bedroom makes the space feel calm before you have even adjusted the lighting, and the discipline of selecting fewer, better pieces means the room improves rather than accumulates over time. Seeing a modern bedroom concept rendered accurately before making purchases saves both money and the disruption of trial and error.",
    "modern-kitchen":
        "Modern kitchen design approaches cabinetry, worktops, and appliances as a single integrated composition rather than a collection of separate purchases. Handle-free doors, concealed appliances, and continuous worktop runs create the streamlined quality that photographs well and works even better in daily use. AI rendering makes it practical to test different handleless cabinet profiles and worktop materials against your actual kitchen geometry before ordering.",
    "modern-bathroom":
        "The bathroom is one of the rooms where modern design delivers its greatest practical return. Wall-hung sanitaryware, continuous floor tiles that run under fittings, and concealed cisterns eliminate the gaps and corners where cleaning becomes difficult. Visualising these choices in a rendered version of your existing bathroom removes much of the uncertainty from a renovation that is costly and disruptive to undo.",
    "modern-dining-room":
        "A modern dining room gains its authority from the quality of its primary pieces — a well-proportioned table, a pendant at the correct height, and seating that is genuinely comfortable over a long meal — rather than from decorative quantity. Testing scale and arrangement in AI visualisation before purchasing avoids the common mistake of a table that is too large for the circulation space available.",
    "modern-office":
        "Modern design brings particular benefits to a home office, where the temptation to accumulate equipment, cables, and paperwork is constant. A clear visual framework — consistent desk surface, managed cabling, limited colour palette — makes it easier to maintain order across a working week. Seeing how a specific desk configuration would read in your actual room helps prioritise the right investments.",
    "modern-gaming-room":
        "A modern approach to a gaming room treats the screens and equipment as the room's primary design element rather than something to work around. Clean cable management, a disciplined palette of dark neutrals and single accent colours, and purpose-selected furniture create a space that performs well and looks deliberately designed rather than assembled over time. AI visualisation helps plan the technical layout before any furniture arrives.",
    "minimalist-living-room":
        "A minimalist living room invites you to question every object already in the space before purchasing anything new. The most effective minimalist living rooms are reached through sustained removal rather than a shopping trip, and the clarity that results from that process makes the room easier to maintain and more restful to spend time in. AI rendering helps you visualise the room with different furniture counts and arrangements before committing.",
    "minimalist-bedroom":
        "The bedroom is arguably the best room in which to apply minimalist principles, since the quality of rest it delivers depends directly on how free from visual noise it is. Reducing to a bed, lighting, and a single storage solution often produces a more calming result than successive additions of decorative items. Seeing this level of reduction rendered accurately can make it easier to commit to the edit.",
    "minimalist-kitchen":
        "A minimalist kitchen is not simply one with white cabinets — it is one where every object on display has earned its place and everything else has been stored or removed. Decanted ingredients in matching containers, a single quality knife kept on a magnetic strip rather than a block, and worktops clear of appliances between uses are the practical disciplines that make the visual approach sustainable.",
    "minimalist-bathroom":
        "Bathrooms are often the easiest room to take toward minimalism because their functional requirements are so clearly defined. A single quality soap dispenser, one precisely positioned mirror, and towels in a single colour provide everything the space needs while creating a hotel-like calm that is immediately noticeable. Visualising different layouts helps identify which fittings can be removed without compromising function.",
    "minimalist-dining-room":
        "A minimalist dining room concentrates investment in the quality of the table and chairs — the objects you use at every meal — rather than in decorative accessories around them. A single statement pendant over a well-proportioned table on a plain floor covering is often all the room needs. AI rendering makes it straightforward to test different table sizes and pendant heights before purchasing.",
    "minimalist-office":
        "A minimalist home office starts with a working system for managing paper and digital files, because no amount of design investment survives a sustained accumulation of clutter. Once the organisational infrastructure is established, the visual framework follows naturally: a single work surface, adequate but concealed storage, and task lighting that performs precisely where it is needed.",
    "minimalist-gaming-room":
        "A minimalist gaming room solves the style's central challenge — how to accommodate significant equipment without visual chaos — through rigorous cable management, built-in storage, and a colour palette restricted to two or three tones. The technology becomes part of a considered composition rather than clutter that the design has to work around. Rendering different cable routing solutions before installation saves considerable rework.",
    "scandinavian-living-room":
        "A Scandinavian living room earns its warmth through the combination of light wood, layered textiles, and multiple controlled light sources rather than any single dominant piece. The style is genuinely liveable because it was developed for long winters spent predominantly indoors, and its emphasis on cosy comfort over showcase presentation suits the functional demands of a daily living space.",
    "scandinavian-bedroom":
        "The Scandinavian bedroom creates its quality of rest through natural materials and warm layered light rather than complexity of decoration. Linen bedding, a wooden bedframe in a light species, and a nightstand lamp with a warm filament bulb establish the essential character, and any additions from that point can follow the same material logic. AI visualisation makes it simple to compare different timber tones and textile colours before purchasing.",
    "scandinavian-kitchen":
        "A Scandinavian kitchen applies the style's characteristic editing discipline to a functional space, resulting in cabinetry that is plain and well-made, surfaces that reward daily use, and an emphasis on honest materials over applied decoration. Light timber details, matte painted cabinets in warm whites or sage greens, and simple hardware in brushed finishes are the vocabulary. Rendering these choices in context helps assess whether the overall warmth level is sufficient before committing.",
    "scandinavian-bathroom":
        "The Scandinavian bathroom tends toward simple, high-quality fittings in a restrained palette, often using stone or large-format tile on floors and walls with wood accents on shelving or mirror frames. The combination of natural materials and warm light creates a calm that stands apart from both the clinical aesthetic of all-white bathrooms and the visual busyness of decorative tile schemes.",
    "scandinavian-dining-room":
        "A Scandinavian dining room builds its character around a solid wood table that will improve with use — accepting marks, ring stains, and the evidence of shared meals as part of its value rather than as damage to be avoided. Simple bentwood or upholstered chairs, a pendant in rattan or linen, and a wool rug underfoot create a room that invites people to sit and stay rather than eating quickly and leaving.",
    "scandinavian-office":
        "Scandinavian design applies its emphasis on function and material quality equally well to the home office context. A solid wood desk surface, a task chair with genuine ergonomic capability, and warm lighting that distinguishes the work zone from the domestic space around it are the foundation. The style's natural material focus also makes it easier to create a room that feels like a place to spend time rather than a utilitarian station.",
    "scandinavian-gaming-room":
        "Bringing Scandinavian design principles to a gaming room moderates the genre's tendency toward aggressive LED lighting and dark surfaces, replacing it with a more restrained palette of warm greys, natural wood, and single-colour accent lighting. The result is a space that functions equally well for gaming and for general use, which matters when a dedicated room is not available and the space must serve multiple purposes.",
    "industrial-living-room":
        "An industrial living room uses its building's existing structural character — or materials that reference it — as the starting point for a room that feels settled and authentic rather than recently composed. Exposed brick, steel, and concrete provide the backdrop; leather, worn wood, and vintage pieces fill the foreground. The challenge is always finding the right balance between the rawness of the shell and the comfort of the furnishings.",
    "industrial-bedroom":
        "An industrial bedroom applies the style's material honesty to a room that also needs to be restful, which requires more careful calibration than a living or social space. The solution usually involves contrast: raw structural materials on one or two surfaces, offset by warmer textiles, softer lighting, and furniture in leather or reclaimed wood that provides tactile comfort within the harder setting.",
    "industrial-kitchen":
        "The industrial kitchen has the clearest functional precedent — actual commercial kitchens — which gives the style unusual authenticity in this room. Stainless steel worktops and splashbacks, open shelving for frequently used equipment, exposed plumbing under a Belfast sink, and robust pendant lighting over an island create a space that is clearly organised around cooking rather than display.",
    "industrial-bathroom":
        "An industrial bathroom typically uses exposed pipe runs, concrete or stone surfaces, raw metal fixtures, and large-format tiles to create a space that looks like a deliberate design choice rather than a bathroom where the finishes have simply been left unfinished. The key is quality of execution — rough materials installed to a high standard read very differently from rough materials installed carelessly.",
    "industrial-dining-room":
        "An industrial dining room often centres on a substantial table — reclaimed timber on steel hairpin or trestle legs, or a single piece of solid hardwood with visible grain and natural edge — that sets the material tone for the rest of the room. Restaurant-style seating in leather or metal, Edison pendants on exposed cord, and a single large piece of industrial-sourced art or object complete the composition.",
    "industrial-office":
        "An industrial home office tends to favour honesty about the technology and work it contains rather than concealing it behind aestheticised storage. Open steel shelving displays books, equipment, and the paraphernalia of work as part of the room's character. The challenge is managing the visual complexity this approach creates, which usually requires a disciplined colour palette and careful organisation within the open storage.",
    "industrial-gaming-room":
        "The industrial gaming room has natural compatibility with the genre's technical equipment — metal surfaces, dark palettes, and visible structure all suit screens and peripheral devices in ways that soft domestic rooms do not. The key difference from a generic gaming aesthetic is quality of material and deliberateness of arrangement: industrial elements that are clearly chosen rather than accumulated.",
    "tropical-living-room":
        "A tropical living room creates its characteristic quality through the combination of living plants, natural fibre furniture, and the warm indirect light of a room that opens outward rather than closes inward. Even in climates that bear no resemblance to the tropics, the material palette — rattan, linen, terracotta, rich greens — creates a room that feels genuinely different from northern European design conventions.",
    "tropical-bedroom":
        "A tropical bedroom slows down the pace of the room through its material choices: linen bedding in natural tones, a rattan headboard or pendant, plants positioned to be visible from the bed, and window treatments that filter rather than block daylight during the day while controlling light effectively at night. The style works with heat and humidity in the materials it favours, which makes it particularly appropriate for warmer climates.",
    "tropical-kitchen":
        "A tropical kitchen introduces the style's characteristic warmth through material selection rather than decoration. Warm-toned cabinet fronts in green or terracotta, rattan or cane pendant lights over an island, terracotta floor tiles, and herbs growing on a windowsill all contribute to the aesthetic without requiring major structural changes. The visual effect is a kitchen that feels embedded in nature rather than sealed against it.",
    "tropical-bathroom":
        "The tropical bathroom connects the room's function — water, steam, skin — to the natural environment through materials that suggest the outdoors. Stone or pebble mosaic shower floors, teak bath accessories, large tropical-leafed wallpaper behind a basin mirror, or a shelf of actual plants that tolerate bathroom humidity all work toward the same effect. The palette should be warm rather than cool, drawing from clay, stone, and forest rather than coastal blue.",
    "tropical-dining-room":
        "A tropical dining room works best when it creates the quality of eating outdoors without the practical limitations. Rattan or cane dining chairs, a timber table with visible grain, pendant lights in natural materials, and large plants positioned around the periphery of the seating area all reinforce the sense of a room that opens toward the natural world rather than containing and controlling it.",
    "tropical-office":
        "A tropical home office uses the style's abundance of plant life to create an environment that counteracts the screen-focused quality of most work setups. Research into biophilic design suggests that visible greenery measurably reduces stress markers and improves concentration during sustained cognitive tasks. The style's natural materials also age gracefully, meaning the room tends to improve as it is used rather than looking progressively dated.",
    "tropical-gaming-room":
        "A tropical gaming room is an unusual but coherent combination — one that moderates the genre's tendency toward artificial, high-contrast aesthetics with the warmth of natural materials and living plants. The contrast creates a genuinely distinctive environment that works as well for relaxation and general use as it does for gaming sessions, which matters significantly in rooms that serve multiple purposes.",
    "bohemian-living-room":
        "A bohemian living room is assembled rather than designed, which makes it one of the most accessible styles for people who have accumulated objects they love but cannot make cohere visually. The style provides a framework within which diverse objects can coexist: layer rugs, use colour as a unifying thread through textiles from different origins, and display collections deliberately rather than scattering them.",
    "bohemian-bedroom":
        "A bohemian bedroom typically grows around a central textile statement — a heavily patterned duvet cover, an antique quilt, or a collection of embroidered cushions — from which the rest of the room takes its colour and material cues. Layering secondary textiles in complementary tones, adding a vintage rug, and hanging artwork in mismatched frames complete the composition without requiring a defined plan.",
    "bohemian-kitchen":
        "A bohemian kitchen collects rather than coordinates: open shelves displaying ceramics in different patterns and origins, mismatched chairs at a wooden table, herbs and trailing plants on every available surface, and artwork pinned to the walls between cupboard runs. The aesthetic rewards cooking cultures that value the room as a gathering place rather than a clean production space.",
    "bohemian-bathroom":
        "A bohemian bathroom works through accumulated objects and vintage finds rather than a coordinated scheme: a reclaimed mirror in a gilded frame, Moroccan tile on a single wall, vintage textiles used as bath mats, and glass-fronted cabinets displaying a collection of beauty products that are worth looking at. The challenge is ensuring the material diversity is held together by a coherent underlying colour palette.",
    "bohemian-dining-room":
        "A bohemian dining room often becomes the most theatrical room in a home because it can accommodate rich material diversity — a large kilim on the floor, candles on every surface, mismatched vintage chairs around a long table, and art covering most of the wall space — within a framework that is still clearly organised around a shared meal as the central activity.",
    "bohemian-office":
        "A bohemian home office brings the style's characteristic warmth and personality to a room that often defaults to generic utility. A vintage desk, shelves of books arranged by colour, a collection of objects gathered over time, and plants on every available surface create a workspace that feels genuinely motivating to spend time in. The challenge is maintaining enough clear surface to work effectively within the visual richness.",
    "bohemian-gaming-room":
        "Bringing bohemian design to a gaming room takes the genre in an entirely different direction from its typical dark-palette, LED-lit aesthetic. Layered textiles, plants, warm amber lighting, and collected objects from different origins create a space that doubles as a comfortable general-purpose room while still accommodating the technical requirements of a gaming setup.",
    "vintage-living-room":
        "A vintage living room gains its character from the combination of pieces with genuine history — a mid-century sofa reupholstered in contemporary fabric, a Victorian fireplace alongside modern art, a 1960s credenza used as a media unit — in a way that suggests the room has been lived in and added to over time rather than conceived at a single point.",
    "vintage-bedroom":
        "A vintage bedroom often centres on a bed frame — iron, wooden, or upholstered — sourced from a different decade than the room's other furnishings, from which the period character of the room radiates. The contrast between an older frame and contemporary bedding, or between antique bedside tables and a modern pendant, keeps the room from feeling like a period recreation rather than a lived-in space.",
    "vintage-kitchen":
        "A vintage kitchen applies period character to the most functional room in a home by selecting fittings and materials that reference a specific era — painted Shaker-style cabinetry, a Belfast sink, a large freestanding range cooker, and Edwardian-patterned floor tiles — within a layout that meets contemporary expectations for workflow and storage.",
    "vintage-bathroom":
        "A vintage bathroom recreates the bathroom's historical function as a room for genuine bathing rather than a quick shower, by giving physical priority to a large bathtub — roll-top, slipper, or claw-foot — and choosing accessories and fixtures that suit the period character of the main fitting. Chrome fixtures with cross-head taps, a pedestal basin, and metro tile combine to create a room with a clear historical sensibility.",
    "vintage-dining-room":
        "A vintage dining room often returns to the tradition of the room as a dedicated space for eating — a room that is not multipurpose and is not expected to serve as anything other than the setting for a shared meal. The furniture that develops in that context — a large table capable of seating eight or more, a substantial sideboard, good chairs with arms — is inherently more generous than open-plan dining furniture.",
    "vintage-office":
        "A vintage home office uses older furniture — a large leather-topped partners desk, a swivel chair from the 1960s, barrister's bookshelves — as the foundation for a workspace with genuine character. The challenge is integrating contemporary technology (monitors, cables, docks) without destroying the period atmosphere that the furniture establishes. This usually requires concealing modern equipment behind period-appropriate doors or panels.",
    "vintage-gaming-room":
        "A vintage gaming room applies the style's aesthetic to an inherently contemporary activity, using older furniture — a 1970s sofa, a set of vintage shelving units, a leather club chair — as the setting for modern screens and equipment. The contrast between the period furnishings and the technology creates a room that feels genuinely distinctive, particularly when the gaming hardware itself draws from earlier console generations.",
    "luxury-living-room":
        "A luxury living room is characterised by the depth of investment in specific materials and the quality of their installation rather than by a particular aesthetic direction. Bespoke joinery, hand-stitched upholstery, custom lighting, and stone or hardwood flooring installed by specialists create a room where every surface rewards close inspection, regardless of whether the overall style is contemporary, classical, or somewhere between.",
    "luxury-bedroom":
        "The luxury bedroom applies the same logic of material investment to the room where the quality of time spent has the most direct effect on daily functioning. A mattress and base of exceptional quality, linen or cashmere bedding, a bed frame made rather than assembled, and blackout window treatments installed without gaps create conditions for rest that improve measurably over a well-executed budget version.",
    "luxury-kitchen":
        "A luxury kitchen earns its classification through the standard of its functional specification — the extraction rate of its ventilation, the heat output of its cooking surfaces, the quality of its refrigeration, and the precision of its storage organisation — rather than simply through the appearance of its surfaces. Visual luxury and functional luxury align most effectively when the brief begins with the latter.",
    "luxury-bathroom":
        "The luxury bathroom is one context where the investment in quality materials and expert installation delivers returns across every use of the room. A walk-in shower with adequate head clearance and a correctly waterproofed enclosure, a deep bath specified correctly for the room's dimensions, and underfloor heating that actually covers the area where you stand all affect the daily experience of the room far more than decorative choices.",
    "luxury-dining-room":
        "A luxury dining room creates conditions for extended meals — adequate table space, genuinely comfortable chairs, dimmable ambient light that flatters people and food equally, and acoustic comfort that allows conversation without effort. These functional qualities, executed at a high standard, matter more to the experience of dining in the room than the decorative quality of the wallpaper or the value of the artwork.",
    "luxury-office":
        "A luxury home office concentrates its investment in the items that determine whether the space is genuinely pleasant to work in across a full day: a desk surface of adequate depth and precise height, a task chair with full ergonomic specification, task lighting positioned to eliminate glare and shadow, and acoustic treatment that reduces the distracting noise of a domestic environment. The aesthetic follows from solving these functional problems well.",
    "luxury-gaming-room":
        "A luxury gaming room treats the technical requirements of high-performance gaming — display calibration, audio system quality, seating ergonomics for extended sessions — as the specifications around which a genuinely excellent room is designed. Professional installation of acoustic treatment, custom cabinetry to house equipment without cable clutter, and lighting systems that can be calibrated for different game types and times of day define the category.",
    "art-deco-bedroom":
        "An Art Deco bedroom translates the period's confident geometry and jewel-tone palette into a room where rest is the priority. The most successful contemporary versions choose two or three signature elements — a velvet headboard with a fan or sunburst silhouette, a brass-framed mirror, and a single statement pendant — and let them sit within a calmer base of warm-painted walls and lacquered timber floors. Visualising those choices in your existing room before purchasing avoids the most common failure of the style: an accumulation of metallic accents that tips from glamorous into theatrical.",
    "art-deco-dining-room":
        "An Art Deco dining room is one of the few contemporary contexts where the period's full theatrical vocabulary still reads as appropriate rather than overwrought. A round or oval lacquered table with a starburst pedestal, dining chairs upholstered in deep emerald or sapphire velvet, a brass-trimmed sideboard, and a tiered chandelier overhead create a room that takes a shared meal seriously as an event. The discipline lies in choosing one strong colour direction and resisting the temptation to layer patterned wallpaper on top of an already richly furnished room.",
    "art-deco-sunroom":
        "Art Deco principles bring an unexpectedly compelling character to a sunroom, where the high natural light flatters lacquered surfaces, mirrored furniture, and the period's signature jewel tones in a way that artificially-lit rooms cannot. Geometric floor tiles in a black-and-white repeat, a chaise upholstered in dusty pink or sea-green velvet, a brass and glass drinks trolley, and large potted palms positioned to filter the strongest direct light create a space that feels like a 1930s ocean-liner deck recast for the home.",
    "coastal-bedroom":
        "A coastal bedroom delivers the seaside quality of rest through restraint rather than literal nautical reference. White-painted timber-clad walls or a single accent wall in a soft sea-blue, linen bedding in natural and pale tones, a rattan or whitewashed timber headboard, and pendants in raffia or rope establish the character without resorting to anchor motifs or shell collections. The room earns its calm from material honesty and an abundance of natural light rather than from decoration; visualisation helps test how different timber tones will read in your specific lighting conditions.",
    "coastal-walk-in-closet":
        "A coastal walk-in closet borrows the style's emphasis on natural light, white-painted timber, and woven texture to turn a utility space into a room genuinely pleasant to use each morning. White Shaker-style joinery with brushed nickel or rope-pull hardware, a centre island in pale timber or a marble-topped dresser, woven seagrass baskets for accessories, and a daylight-balanced ceiling pendant create a room that feels like a cabin at the edge of a beach rather than a wardrobe corridor. Mirroring is essential — a full-length mirror positioned to catch the room's strongest light source doubles as a styling tool.",
    "farmhouse-bedroom":
        "A farmhouse bedroom reaches its quality through the combination of substantial timber pieces, layered textiles in earthy tones, and finishes that improve with use rather than degrade. A solid timber bedframe in oak or pine, a vintage quilt or hand-woven throw, simple shaker-style nightstands, and a wrought-iron pendant or table lamp form the core vocabulary. The style genuinely rewards imperfection — visible grain, slight chips on painted furniture, an antique rug with worn edges — which makes it an unusually forgiving choice for households that include children or animals.",
    "farmhouse-bathroom":
        "A farmhouse bathroom centres on a few period-correct fittings — a freestanding clawfoot bath, a cross-handle tap on a pedestal basin, an apron-front Belfast sink for the vanity area — set within a backdrop of shiplap walls, hexagonal floor tile, and warm-painted timber accents. The aesthetic prioritises authenticity of materials over coordinated colour: a single piece of vintage furniture repurposed as a vanity, with original wear visible on the wood, often delivers the style's character more effectively than any new purchase.",
    "farmhouse-dining-room":
        "A farmhouse dining room is built around a substantial timber table — long, scrubbed, capable of seating eight or more — with mismatched chairs that look as though they have been collected over time rather than ordered as a set. A pair of hanging pendants in galvanised metal or wicker, a sideboard with visible age on its painted finish, and a rag rug or hooked runner underfoot complete the composition. The style suits households where the dining room is genuinely used for meals, conversation, and occasional homework rather than reserved for formal occasions.",
    "farmhouse-gaming-room":
        "A farmhouse gaming room is an unusual but coherent combination — applying the style's warmth, timber palette, and layered textiles to a room organised around screens and equipment. Reclaimed timber wall panelling, a leather Chesterfield or oversized linen sofa, a barn-door cabinet concealing a media console, and warm filament pendants create an environment that softens the technical hardness of gaming equipment. The contrast between rustic finishes and contemporary screens reads as deliberate and gives the room a clear identity beyond standard gaming-room conventions.",
    "farmhouse-home-theater":
        "A farmhouse home theater translates the cinema-room brief into a setting that feels like a converted barn or a long-occupied family room rather than a black-walled commercial cinema. Reclaimed timber wall cladding, a deep-buttoned leather sectional or a row of wide upholstered armchairs in linen, sconces with warm filament bulbs that dim cleanly, and a barn-door panel concealing the screen between viewings create a room that hosts other activities as easily as it hosts a film. Acoustic treatment is hidden behind tongue-and-groove panelling so the room reads as domestic rather than technical.",
    "japandi-mudroom":
        "A Japandi mudroom applies the style's discipline of curated materiality to the most mess-prone room in the house, with quietly transformative results. Floor-to-ceiling oak veneer storage with handle-free push-to-open doors, a low timber bench with a single linen cushion, a row of brass or blackened-steel coat hooks, and slate or large-format porcelain tile underfoot create a room that absorbs the disorder of arrival without becoming part of it. Built-in shoe storage that conceals the volume of a household's footwear is the practical core of a successful execution.",
    "mediterranean-home-theater":
        "A Mediterranean home theater takes the cinema-room brief in an unusually warm direction, drawing on the southern European tradition of evening rooms set up for long, communal occasions. Lime-washed walls in warm cream or terracotta tones, exposed timber ceiling beams, oversized linen-upholstered sofas with deep seat depth, terracotta floor tile partly covered by a kilim rug, and wrought-iron sconces with warm dimmable bulbs create a room that feels closer to a Tuscan farmhouse great room than a screening cinema. Acoustic treatment hides behind plastered panels textured to match the surrounding walls.",
    "modern-home-theater":
        "A modern home theater applies the style's discipline of restraint to a room with significant technical requirements, treating the screen, speakers, and seating as integrated elements within a coherent visual composition rather than equipment placed into a generic room. Continuous matte-painted walls in a deep neutral, recessed linear lighting calibrated to dim cleanly with the projector, a tiered seating row in single-tone leather, and acoustic panels integrated flush with the wall plane define the look. The practical benefit of the modern approach is that the room performs as a cinema without looking like one between viewings.",
    "modern-sunroom":
        "A modern sunroom uses the style's emphasis on architectural clarity to produce a room that frames the landscape rather than competing with it. Slim-profile aluminium glazing maximising the apparent glass area, a single-tone flooring that runs continuously to the threshold, low-profile upholstery in a neutral linen or boucle, and a deliberate absence of decorative pattern direct attention outward through the glass. A modern sunroom rewards careful editing — fewer, larger pieces of furniture, no scattered accessories — because the view does most of the visual work.",
    "farmhouse-kitchen":
        "The farmhouse kitchen is the room the style was effectively invented for, which is why it survives contact with daily cooking better than almost any other aesthetic. A deep apron-front Belfast sink, painted shaker cabinetry in a muted sage or off-white, open shelving carrying everyday crockery rather than styled props, a butcher-block or honed stone worktop that accepts marks, and a freestanding range under a plastered chimney breast form the working vocabulary. The most common execution error is treating it as a decorative layer — adding sliding barn hardware and printed signage to an otherwise contemporary kitchen — rather than as a set of material choices, so visualising the cabinet colour and worktop pairing against your actual room geometry is worth doing before any joinery is ordered.",
    "coastal-living-room":
        "A coastal living room earns its calm from light and material honesty, not from nautical decoration. Whitewashed or limed timber, slipcovered sofas in washed linen or cotton that can genuinely be removed and laundered, a jute or sisal rug, woven pendant shades, and a palette held to soft whites, sand, and one restrained sea-blue or sage accent are what actually produce the effect people are after. Because the style relies on maximising available daylight, the position of the largest seating piece relative to the room's main window matters more than any individual purchase — which is precisely the kind of decision AI visualisation lets you test against your own room before you commit to a sofa that is difficult to return.",
    "japandi-living-room":
        "Japandi resolves the tension between Japanese spatial discipline and Scandinavian material warmth, and the living room is where that resolution is most legible. Low-slung seating in oatmeal boucle or undyed linen, a solid oak or walnut low table with visible joinery, a single ceramic or paper pendant, one branch arrangement rather than a full display, and storage sized so nothing sits out permanently define the room. The style depends on a strictly limited palette — two woods at most, three colours at most — because it has no pattern or ornament to hide behind, so seeing the actual wood tones of your existing floor rendered alongside candidate furniture is the fastest way to avoid a mismatch that would otherwise only become obvious after delivery.",
    "art-deco-living-room":
        "An Art Deco living room is built on geometry and material contrast: fan and sunburst motifs, stepped or scalloped silhouettes, and the deliberate collision of lacquered timber, brass, mirrored glass, and deep velvet. The contemporary versions that work choose a single jewel tone — emerald, sapphire, or oxblood — for the largest upholstered piece and let brass detailing, a geometric rug, and one statement mirror carry the rest, rather than distributing metallic accents evenly around the room. Scale is the usual failure point, because the period's furniture was designed for tall rooms, so testing a curved velvet sofa and a tiered pendant against your actual ceiling height before purchasing prevents the most expensive mistake in the style.",
    "japandi-bedroom":
        "A Japandi bedroom applies the style's editing discipline to the room where visual noise costs the most. A low platform bed in light oak or walnut, undyed linen bedding, a single low nightstand rather than a matched pair, wall-mounted or paper-shaded lighting that removes clutter from surfaces, and closed storage that conceals everything not in daily use produce a room that reads as quiet before any other change is made. The style rewards restraint in floor coverage as much as in objects — leaving clear floor around the bed is a deliberate compositional decision, not an omission — and visualising the room with that much empty space is often what makes the edit feel achievable rather than austere.",
    "mediterranean-living-room":
        "A Mediterranean living room draws on southern European domestic architecture, where thick walls, deep-set windows, and hard floors were practical responses to heat before they were aesthetic choices. Lime-washed or micro-cement walls in warm cream and terracotta, exposed timber beams, a deep linen-upholstered sofa with generous seat depth, terracotta or handmade tile flooring partly covered by a kilim, wrought-iron or plaster wall sconces, and olive or fig trees in unglazed pots set the character. The palette is warm throughout — no cool greys — and the room improves as its plaster and timber age, which makes it an unusually forgiving style to execute in stages rather than all at once.",
};

// FAQ sets for key combinations: keyed by `${theme}-${roomSlug}`
export const COMBINATION_FAQS: Record<string, IFaqItem[]> = {
    "modern-living-room": [
        {
            question: "What colours work best in a modern living room?",
            answer: "Modern living rooms typically use a base of warm white, greige, or mid-grey, with a single accent colour introduced through one or two pieces of furniture or artwork. Avoid more than three colours in the primary palette — the restraint is what gives the style its visual authority.",
        },
        {
            question: "How many pieces of furniture should a modern living room have?",
            answer: "There is no fixed number, but modern living rooms generally work best when the seating area, storage, and one or two accent pieces are all that's present. If you can remove something without the room feeling incomplete, remove it.",
        },
        {
            question: "Can a modern living room still feel warm?",
            answer: "Yes — warmth in a modern room comes from material choices rather than quantity of objects. Natural wood, linen or wool textiles, warm white rather than cool white walls, and incandescent or warm-LED lighting all contribute to a room that reads as modern but feels comfortable.",
        },
    ],
    "modern-bedroom": [
        {
            question: "How do I achieve a modern bedroom look without it feeling cold?",
            answer: "Use warm neutrals (greige, warm white, soft taupe) rather than cool greys, and invest in high-quality linen or cotton bedding in natural tones. A single warm-toned wood element — a bedframe, side table, or flooring — offsets the cleanness of a modern palette significantly.",
        },
        {
            question: "What storage solutions suit a modern bedroom?",
            answer: "Built-in wardrobes with push-to-open or recessed-handle doors maintain the unbroken visual planes that modern design relies on. Under-bed storage and bedside tables with drawers rather than open surfaces allow a full set of personal items to be stored without affecting the room's appearance.",
        },
        {
            question: "Should a modern bedroom have a rug?",
            answer: "Yes — a rug in a modern bedroom is both practical (warmth underfoot when leaving the bed) and visually important, providing a layer of softness that prevents the room from feeling stark. Choose a plain or subtly textured rug in a colour that sits within the room's palette rather than introducing a new one.",
        },
    ],
    "modern-kitchen": [
        {
            question: "What cabinet styles suit a modern kitchen?",
            answer: "Handle-free push-to-open or J-pull cabinetry maintains the cleanest visual line, but simple bar handles in brushed metal also read as appropriately modern. The cabinet door profile matters more than the handle choice: flat or very lightly routed doors at consistent heights are the foundation.",
        },
        {
            question: "What worktop materials work in a modern kitchen?",
            answer: "Quartz composite, sintered stone, and concrete all suit modern kitchens because they provide continuous, seamless surfaces with minimal visual interruption. Natural marble is also used frequently but requires more active maintenance than engineered alternatives.",
        },
        {
            question: "Can a modern kitchen have open shelving?",
            answer: "Open shelving works in modern kitchens when it is used strategically rather than universally. A single run of open shelving above a work surface, or a glass-fronted cabinet for display, provides the visual break that all-closed cabinetry can lack. The discipline is maintaining the contents of open shelving so they do not undermine the room's visual organisation.",
        },
    ],
    "modern-bathroom": [
        {
            question: "What tiles work best in a modern bathroom?",
            answer: "Large-format tiles (60x60cm or larger) minimise grout lines and create the seamless surface quality that modern design favours. Matching floor and wall tiles in the same material (porcelain or large-format stone) creates a particularly cohesive result.",
        },
        {
            question: "Should a modern bathroom be all white?",
            answer: "Not necessarily. While white is the most common base in modern bathrooms, warm stone tones, soft grey, and muted sage all work within the style. The critical factor is not the colour but the restraint: limit the palette to two materials and one accent, and avoid introducing pattern.",
        },
        {
            question: "What fixtures suit a modern bathroom?",
            answer: "Wall-hung toilets, undermount basins, and frameless shower enclosures all support the visual clarity of modern design by eliminating gaps and reducing the number of visible fixings. Matt black or brushed brass tapware is a common choice that contrasts well against lighter tile and sanitaryware.",
        },
    ],
    "modern-dining-room": [
        {
            question: "What dining table shapes suit a modern style?",
            answer: "Rectangular tables with a clear material statement — solid white marble, concrete, or a contrasting wood — read most strongly as modern. Round tables also work well when space is limited, particularly with pedestal bases that keep the floor plane uncluttered beneath.",
        },
        {
            question: "What pendant lighting is appropriate for a modern dining room?",
            answer: "A single geometric pendant or a linear multi-pendant fitting over a rectangular table both suit modern dining rooms. The key dimension is drop height: the bottom of the pendant should sit 75-85cm above the table surface regardless of ceiling height.",
        },
        {
            question: "How do I add warmth to a modern dining room?",
            answer: "A wool or jute rug beneath the table, chairs with upholstered seats in a natural fabric, and real candles on the table (rather than LED alternatives) all add warmth without compromising the style's characteristic restraint.",
        },
    ],
    "modern-office": [
        {
            question: "What desk suits a modern home office?",
            answer: "A simple rectangular desk with a clean surface material — matte white, concrete-effect laminate, or solid timber — and no decorative detailing suits the style well. The desk depth should be at least 70cm to allow monitors at a comfortable viewing distance.",
        },
        {
            question: "How do I manage cables in a modern home office?",
            answer: "Cable channels or conduit fixed to the desk's back edge, a desk with an integrated cable tray, and in-desk power units with USB outputs all help maintain the uncluttered surface that modern design requires. A single power strip fixed out of sightline handles the remaining cable routing.",
        },
        {
            question: "What storage suits a modern home office?",
            answer: "Floating shelves with a single consistent depth and spacing, or a credenza with push-to-open doors, maintain the visual discipline of modern design while providing adequate storage for most working-from-home requirements. Avoid open shelving unless the contents can be maintained in a consistently organised state.",
        },
    ],
    "modern-gaming-room": [
        {
            question: "How do I make a gaming room look modern rather than generic?",
            answer: "Restrict the LED accent lighting to a single colour rather than cycling through the spectrum, match all peripheral equipment to a consistent colour palette (usually dark neutrals with one accent), and invest in cable management before anything else. The difference between a modern gaming room and a generic one is primarily discipline in those three areas.",
        },
        {
            question: "What seating works in a modern gaming room?",
            answer: "Ergonomic task chairs designed for extended use, in a palette consistent with the room, often work better than dedicated gaming chairs in a modern aesthetic context. If gaming chairs are preferred, black or grey versions in simple profiles are less visually disruptive than those with aggressive styling and multiple accent colours.",
        },
        {
            question: "What desk setup suits a modern gaming room?",
            answer: "A wide desk (at least 140cm) with a clean surface material and an under-desk cable tray provides the foundation. Monitor arms rather than monitor stands reduce the footprint and maintain visual clarity. Match the desk finish to one of the room's other primary surfaces — flooring or shelving — to create cohesion.",
        },
    ],
    "minimalist-living-room": [
        {
            question: "How many pieces of furniture does a minimalist living room need?",
            answer: "The absolute minimum for a functional living room is a sofa, a surface for a drink or book, a light source, and storage. Many minimalist living rooms work with exactly these four elements and nothing else. Adding beyond this should be driven by a genuine functional need rather than the feeling that the room looks unfinished.",
        },
        {
            question: "What should I do with objects I want to keep but cannot display minimally?",
            answer: "Good storage is the prerequisite for minimalism, not a contradiction of it. Built-in cabinetry with solid doors, a trunk or blanket box that doubles as a coffee table, or a media unit with closed shelving all allow a substantial volume of possessions to exist in a room without appearing in it.",
        },
        {
            question: "Is minimalism expensive to achieve?",
            answer: "Minimalism requires investment in a small number of quality pieces rather than a large number of inexpensive ones, so the budget is often similar. The difference is that a minimalist room's quality is immediately visible because there is nothing to distract from it — which means that lower-quality pieces are also immediately visible.",
        },
    ],
    "minimalist-bedroom": [
        {
            question: "What should a minimalist bedroom contain?",
            answer: "At minimum: a bed with quality bedding, bedside lighting, and adequate concealed storage for clothing and personal items. Most minimalist bedrooms also include a mirror and a rug. Everything beyond this should justify its presence on functional or aesthetic grounds before it enters the room.",
        },
        {
            question: "How do I style a minimalist bedroom without it looking empty?",
            answer: "The perception of emptiness in a minimalist room usually comes from a lack of texture rather than a lack of objects. Multiple textile layers on the bed (fitted sheet, flat sheet, duvet, decorative cushions in a limited palette), a rug with visible weave, and linen curtains provide enough visual texture to prevent the room feeling bare.",
        },
        {
            question: "What colour works best for a minimalist bedroom?",
            answer: "Warm neutrals — off-white, warm greige, soft sage, or pale terracotta — work better than stark white or cool grey in a bedroom context because they add the warmth that a room stripped of many objects needs to feel comfortable rather than clinical.",
        },
    ],
    "minimalist-kitchen": [
        {
            question: "How do I achieve a minimalist kitchen without losing functionality?",
            answer: "The functional foundation of a minimalist kitchen is storage planning: every item that is used must have a dedicated place, and items used less than once a week should be stored in a less accessible location. Once everything has a home, the surfaces can be cleared and maintained that way.",
        },
        {
            question: "What appliances can be stored away in a minimalist kitchen?",
            answer: "Anything used less than daily is a candidate for a cupboard: kettles, toasters, coffee machines, food processors, and blenders are the most common. An appliance garage — a section of worktop with a retractable or lift-up door — provides easy access while keeping the main countertop clear.",
        },
        {
            question: "Is a minimalist kitchen practical with children?",
            answer: "Yes, with appropriate planning. Lower-level storage that children can access independently reduces the demand on counter space, and a consistent organisation system makes it straightforward to return things to their places. The discipline required to maintain a minimalist kitchen actually suits households where order is important for safety as well as aesthetics.",
        },
    ],
    "minimalist-bathroom": [
        {
            question: "What does a minimalist bathroom need to function well?",
            answer: "A single-mixer tap rather than separate hot and cold controls, a wall-hung basin to simplify cleaning, push-to-open or recessed-handle storage for all products, and one quality soap dispenser rather than multiple bottles on display cover the essential functional requirements of minimalist bathroom design.",
        },
        {
            question: "How do I hide bathroom products without making the room impractical?",
            answer: "In-wall niches in the shower area, mirror cabinets, and vanity units with full internal storage are the three most effective solutions. A recessed niche tiled in the same material as the wall around it is the most seamless solution; a mirror cabinet provides the greatest volume.",
        },
        {
            question: "Do I need a rug in a minimalist bathroom?",
            answer: "A single bath mat in a plain colour, stored out of sight or hung when not in use, is the typical approach. Permanently displayed bath mats collect moisture and bacteria and are one of the first things that disrupt the visual clarity of a minimalist bathroom.",
        },
    ],
    "minimalist-dining-room": [
        {
            question: "Can a minimalist dining room be comfortable for long meals?",
            answer: "Yes — minimalism and comfort are not in conflict. Chair comfort is determined by the quality of the seat and the ergonomics of the design, not by the amount of padding or the number of cushions. An Eames DSW or a Danish dining chair in solid wood can be genuinely comfortable for a three-hour meal.",
        },
        {
            question: "How do I style a minimalist dining table?",
            answer: "For daily use, nothing beyond what is needed for the meal. For occasions, a single centrepiece element — a ceramic vase with a single stem, a cluster of candles in consistent heights, or a simple runner in a plain textile — provides enough visual interest without contradicting the style.",
        },
        {
            question: "What floor covering suits a minimalist dining room?",
            answer: "Plain hardwood or large-format tile with no rug is the most common minimalist dining room floor treatment, since rugs under dining tables collect food and require frequent cleaning. If a rug is important for acoustic comfort, choose one in a single colour without pattern, and ensure it is large enough for all chairs to remain on it when occupied.",
        },
    ],
    "minimalist-office": [
        {
            question: "How do I stay minimalist in a home office over time?",
            answer: "Establish a weekly reset practice: at the end of each working week, file or discard any paper that accumulated, return objects to their designated locations, and clear the desk surface completely. A regular reset costs ten minutes and prevents the incremental accumulation that undermines minimalist spaces.",
        },
        {
            question: "What monitor setup suits a minimalist home office?",
            answer: "A single monitor on a monitor arm (which removes the need for a stand and keeps the desk surface free) suits minimalist home offices better than multiple screen setups. If two screens are required, a dual arm that keeps both at the same height and angle maintains a more ordered appearance than two separate stands.",
        },
        {
            question: "How do I handle paperwork in a minimalist office?",
            answer: "Process paper immediately rather than accumulating it: scan what needs to be retained digitally, act on or file correspondence on arrival, and discard everything else. A single document tray for items genuinely in process, and a filing drawer for retention, provide adequate paper management for most working situations.",
        },
    ],
    "minimalist-gaming-room": [
        {
            question: "Can minimalism work in a gaming room with a lot of hardware?",
            answer: "Yes, but it requires built-in or purpose-designed storage for all equipment not in active use. Consoles in a closed cabinet, controllers on a charging dock inside a drawer, and headsets on a single wall hook keep the visible surface area to just the active setup. Cable management is especially important.",
        },
        {
            question: "What colour palette suits a minimalist gaming room?",
            answer: "Dark charcoal, matte black, and a single accent colour — usually white, warm grey, or a single non-neon tone — keep the room from the visual noise that characterises many gaming spaces. Restrict RGB lighting to a single consistent colour rather than cycling through multiple.",
        },
        {
            question: "How do I make a gaming room look intentional rather than assembled?",
            answer: "Choose all furniture and equipment accessories in a consistent palette before purchasing anything. Matching or complementary desk, chair, and shelving finishes, combined with rigorous cable management, are the two factors that most distinguish a deliberately designed gaming space from an organically accumulated one.",
        },
    ],
    "scandinavian-living-room": [
        {
            question: "What wood species suit a Scandinavian living room?",
            answer: "Pine, birch, and light oak are the most characteristic choices. They share a pale, warm quality that reflects available natural light and creates the sense of brightness that the style was developed to maximise during long Scandinavian winters. Darker species — walnut, wenge, or dark stained oak — shift the aesthetic toward a different register.",
        },
        {
            question: "What textiles are most Scandinavian?",
            answer: "Wool blankets and throws, sheepskin rugs or seat pads, linen cushion covers, and knitted accessories in natural undyed fibres or simple geometric patterns are all characteristic. The emphasis is on natural fibre over synthetic, and tactile quality over visual complexity.",
        },
        {
            question: "How many plants should a Scandinavian living room have?",
            answer: "Plants are an important element in Scandinavian living rooms, where they provide living texture and greenery during seasons when outdoor greenery is absent. Two to four plants of different heights and textures is a common arrangement — enough to be significant without tipping toward the abundance of tropical or bohemian styles.",
        },
    ],
    "scandinavian-bedroom": [
        {
            question: "What bedding suits a Scandinavian bedroom?",
            answer: "Natural-fibre bedding in undyed or lightly coloured tones — white, cream, soft sage, or dusty blue — is most characteristic of the style. Linen bedding ages particularly well and develops a texture over time that suits the style's appreciation of material honesty. Cotton percale and organic cotton are also appropriate.",
        },
        {
            question: "Does a Scandinavian bedroom need to be light in colour?",
            answer: "Generally yes, though darker Scandinavian bedrooms exist and are increasingly common in contemporary interpretations of the style. The light-colour preference emerged from the practical need to maximise reflected daylight in northern climates. In rooms with excellent natural light, darker walls work within the style when the warm wood and textile elements are maintained.",
        },
        {
            question: "What lighting works best in a Scandinavian bedroom?",
            answer: "Multiple warm-toned light sources at different heights are more characteristic than a single central fixture. A pendant or wall-mounted light over each side of the bed, a floor lamp in a reading area, and a candle or two on a surface create the layered, hygge quality that the style is associated with.",
        },
    ],
    "scandinavian-kitchen": [
        {
            question: "What cabinet colours are most Scandinavian?",
            answer: "Soft whites, warm off-whites, and muted sage or dusty blue-green are the most characteristic Scandinavian kitchen cabinet colours. These work particularly well with light timber details in open shelves, a wooden countertop section, or timber bar stools at an island.",
        },
        {
            question: "Do Scandinavian kitchens have open shelving?",
            answer: "Open shelving is common in Scandinavian kitchens and is used to display everyday ceramics — plates, mugs, bowls — that are considered attractive enough to live in the open. The discipline of only displaying objects worth looking at applies directly; overfilled or disorganised open shelves undermine the style's characteristic calm.",
        },
        {
            question: "What handles work in a Scandinavian kitchen?",
            answer: "Brushed brass, matte black, or solid wood handle bars are all appropriate. The Scandinavian approach tends toward simple bar pulls rather than ornate or decorative hardware. Brushed brass is particularly characteristic of contemporary Scandinavian kitchen design and adds warmth without visual complexity.",
        },
    ],
    "scandinavian-bathroom": [
        {
            question: "What tiles suit a Scandinavian bathroom?",
            answer: "Simple subway tiles in warm white, hexagon tiles in a natural stone look, or large-format tiles with a minimal surface texture all read as Scandinavian. Avoid highly decorative or patterned tiles — the style's visual character comes from material quality and restraint rather than surface decoration.",
        },
        {
            question: "How do I add warmth to a Scandinavian bathroom?",
            answer: "Wood elements — a teak bath mat, a timber-framed mirror, a wooden shelf — introduce warmth in a space that can otherwise feel cold. Warm-toned lighting (2700-3000K colour temperature) and thick cotton or linen towels in natural colours complete the effect.",
        },
        {
            question: "What plants work in a Scandinavian bathroom?",
            answer: "Eucalyptus hung from the shower head (refreshed every few weeks), pothos or heartleaf philodendron on shelves, and air plants in small ceramic vessels all tolerate bathroom humidity and add the natural element that the style benefits from. Avoid cacti and succulents, which prefer dry conditions.",
        },
    ],
    "scandinavian-dining-room": [
        {
            question: "What dining table suits a Scandinavian style?",
            answer: "A solid timber table — oak, ash, or birch — with a natural or lightly oiled finish and clean lines is the most characteristic choice. Extension tables are particularly well-suited to Scandinavian dining rooms because they emphasise the practical, life-centred quality of the style over purely aesthetic considerations.",
        },
        {
            question: "What chairs work around a Scandinavian dining table?",
            answer: "The Danish dining chair tradition — solid wood frames, simple geometric profiles, optional upholstered seat pads — is the natural fit. The Wishbone Chair, the Series 7, and countless contemporary interpretations all work. Avoid ornate or heavily upholstered chairs that contradict the style's emphasis on honest materials and functional simplicity.",
        },
        {
            question: "How do I set a Scandinavian dining table for everyday use?",
            answer: "Simple ceramic tableware in neutral tones, linen napkins, and a candle or small plant as a centrepiece are consistent with the style's everyday aesthetic. Scandinavian table-setting culture places emphasis on the quality of daily rituals rather than reserving good tableware for special occasions.",
        },
    ],
    "scandinavian-office": [
        {
            question: "What desk suits a Scandinavian home office?",
            answer: "A solid timber desk in a light species — oak or birch — with a simple rectangular form and visible wood grain is most characteristic. Many Scandinavian desks also incorporate small integrated storage: a drawer, a pull-out shelf, or a cable management channel. The emphasis is on quality of material and simplicity of form.",
        },
        {
            question: "How do I organise a Scandinavian home office?",
            answer: "Functional objects that are attractive enough to remain visible — a ceramic pen holder, a leather desk pad, a quality notebook, a simple lamp — are displayed on the desk surface. Everything else is stored in drawers or a closed cabinet. The discipline is maintaining the distinction between what merits display and what requires storage.",
        },
        {
            question: "What chair works in a Scandinavian home office?",
            answer: "A well-designed task chair in a natural material — leather, wool, or mesh in neutral tones — with full ergonomic adjustability suits both the style's aesthetic and the functional requirements of a working day. The HAG Capisco, the Herman Miller Aeron in darker tones, and various Scandinavian brands produce appropriate options.",
        },
    ],
    "scandinavian-gaming-room": [
        {
            question: "Can Scandinavian design work in a gaming room?",
            answer: "Yes, particularly if the gaming room is used for multiple purposes. The style's emphasis on warm neutrals, natural materials, and restrained lighting creates a more versatile room than the genre's typical dark aesthetic, and is compatible with general living use when gaming is not active.",
        },
        {
            question: "What lighting suits a Scandinavian gaming room?",
            answer: "Warm white or amber accent lighting rather than RGB cycling, a floor lamp or wall light for general ambience, and adjustable task lighting over the desk that can be dimmed during gaming. The layered approach of Scandinavian lighting design translates well to a room that needs to serve both ambient and task lighting functions.",
        },
        {
            question: "What colour palette suits a Scandinavian gaming room?",
            answer: "Warm whites and off-whites for walls and surfaces, light timber for the desk and shelving, and dark grey or charcoal for the seating and accent elements. Restrict any accent colour to a single tone — dusty blue, sage, or terracotta — used sparingly in textile accessories.",
        },
    ],
    "industrial-living-room": [
        {
            question: "What flooring suits an industrial living room?",
            answer: "Polished or sealed concrete, wide-plank reclaimed timber, or large-format dark porcelain tiles are all appropriate. Of these, reclaimed timber provides the most warmth and is the most practical for a living room context. Concrete can feel cold unless significantly offset by rugs and textiles.",
        },
        {
            question: "How do I soften an industrial living room without losing the style?",
            answer: "Large rugs, leather or linen upholstery, and wooden furniture pieces are the three most effective softening elements. The contrast between raw structural materials and softer furnishings is characteristic of the style — the goal is not to eliminate the rawness but to balance it.",
        },
        {
            question: "What colours work with an industrial aesthetic?",
            answer: "Industrial palettes draw from the colours of the materials themselves: grey from concrete, warm brown from worn leather and reclaimed timber, black from steel, and terracotta or rust from aged metal. Add a warmer accent through textiles if the overall effect feels too monochromatic.",
        },
    ],
    "industrial-bedroom": [
        {
            question: "Is an industrial bedroom comfortable to sleep in?",
            answer: "The rawer material choices of industrial design — concrete walls, metal frames, exposed pipes — require more deliberate offsetting in a bedroom than in a social space. The key is investing in high-quality bedding and ensuring the textiles in the room are warm in both colour and tactile quality. A sheepskin or wool rug beside the bed makes a considerable practical difference.",
        },
        {
            question: "What bedframe suits an industrial bedroom?",
            answer: "Steel-framed beds with a simple structural form, or beds with headboards in reclaimed timber or aged leather, are both characteristic. Avoid ornate metal headboards with decorative scrollwork — the industrial aesthetic favours structural honesty over decorative metalwork.",
        },
        {
            question: "How do I add warmth to an industrial bedroom?",
            answer: "Layer warm textiles generously: linen or cotton bedding in warm tones, a wool throw, a sheepskin rug, and warm-LED bedside lighting. The contrast between warm textiles and cooler industrial surfaces is what gives the style its tension in a bedroom context.",
        },
    ],
    "industrial-kitchen": [
        {
            question: "What worktop suits an industrial kitchen?",
            answer: "Stainless steel (the most direct reference to commercial kitchen infrastructure), poured concrete, or thick reclaimed timber are the most characteristic options. Stainless steel is the most practical and most overtly industrial; concrete ages well but requires sealing and can stain; reclaimed timber adds warmth to what can otherwise be a cold aesthetic.",
        },
        {
            question: "What cabinetry suits an industrial kitchen?",
            answer: "Open steel shelving rather than upper cabinets is the most committed industrial kitchen approach. For lower storage, metal cabinets (often repurposed from commercial or industrial contexts), handleless painted panels, or simple plywood units with metal handles all work. Avoid decorative carved or profiled cabinetry that references other design traditions.",
        },
        {
            question: "What lighting is appropriate for an industrial kitchen?",
            answer: "Pendant lights with metal shades — factory-style reflectors, cage lights, or large dome pendants in aged brass or black — are the most characteristic. For task lighting, surface-mounted conduit running to fixed spots or a track system is appropriate over a counter. Under-cabinet strip lighting in a warm tone works practically without affecting the aesthetic.",
        },
    ],
    "industrial-bathroom": [
        {
            question: "What sanitaryware suits an industrial bathroom?",
            answer: "Freestanding baths in cast iron, deep butler sinks or vessel basins in stone or concrete, and exposed pipe runs rather than concealed plumbing are all characteristic. The aesthetic works best when the mechanical elements of the room are treated as features rather than infrastructure to hide.",
        },
        {
            question: "How do I make an industrial bathroom feel comfortable?",
            answer: "Underfloor heating under concrete or tile floors, generous towel storage that is accessible from the bath or shower, and warm amber lighting at face level rather than only overhead illumination are the practical investments that make a room with austere material choices genuinely comfortable to use.",
        },
        {
            question: "What tiles work in an industrial bathroom?",
            answer: "Raw cement tiles, large-format concrete-effect porcelain, textured stone, or traditional white metro tiles (a direct reference to early twentieth-century industrial washroom architecture) all work. The key is avoiding tiles that have a decorative or artisanal character — the aesthetic relies on materials that could plausibly appear in a functional, non-residential context.",
        },
    ],
    "industrial-dining-room": [
        {
            question: "What dining table suits an industrial aesthetic?",
            answer: "A substantial reclaimed timber top on steel hairpin, trestle, or H-frame legs is the most characteristic industrial dining table. The contrast between the organic quality of the timber and the precision of the steel is central to the aesthetic. Alternatively, a single thick slab of hardwood with live edges on a simple welded base.",
        },
        {
            question: "What seating works in an industrial dining room?",
            answer: "Metal side chairs with simple geometric profiles, industrial stools at counter height, or leather upholstered chairs on metal frames all suit the aesthetic. Restaurant-sourced seating — Tolix-style or equivalent — is directly appropriate and often available through catering equipment suppliers at reasonable prices.",
        },
        {
            question: "How do I set a mood in an industrial dining room?",
            answer: "Candlelight on a raw timber table creates a strong contrast with the harder architectural materials of the room and establishes an evening atmosphere without requiring any change to the permanent lighting. Simple ceramic or enamel tableware, linen napkins, and glasses without decoration maintain the room's material honesty at the table level.",
        },
    ],
    "industrial-office": [
        {
            question: "What desk suits an industrial home office?",
            answer: "A reclaimed timber top on steel trestle or angle-iron legs, or a steel-framed workbench desk with a simple plywood or timber surface, are the most characteristic choices. The emphasis is on a desk that looks made rather than manufactured, with visible material character rather than a processed finish.",
        },
        {
            question: "What storage works in an industrial home office?",
            answer: "Open steel shelving with a simple bracket-and-shelf system, vintage steel filing cabinets, or wooden crates on metal shelving all work within the aesthetic. The discipline of displaying storage openly in an industrial office is that the contents must be organised enough to read as deliberate rather than neglected.",
        },
        {
            question: "How do I control cable clutter in an industrial home office?",
            answer: "Exposed cable management — conduit fixed to the desk or wall, cable clips in a single colour following straight runs, or a cable tray underneath the desk surface — is more appropriate to the industrial aesthetic than concealed management systems. The key is making the cable routing look intentional rather than improvised.",
        },
    ],
    "industrial-gaming-room": [
        {
            question: "What makes a gaming room look industrial rather than just dark?",
            answer: "The distinction is material quality and structural honesty: an industrial gaming room uses exposed brick, concrete, steel, or timber as genuine architectural materials rather than as surface cladding. The rawness should be authentic rather than applied, and the furniture should reinforce this through material choices rather than through colour alone.",
        },
        {
            question: "What desk suits an industrial gaming room?",
            answer: "A steel-framed gaming desk with a solid timber or concrete-effect surface, or a reclaimed timber top on steel hairpin legs at desk height, both work. The desk should be large enough (at least 150cm wide) to accommodate the technical setup without looking overwhelmed by it.",
        },
        {
            question: "How do I incorporate RGB lighting in an industrial gaming room?",
            answer: "Restrict RGB lighting to a single colour — amber for consistency with the industrial material palette, or deep blue as a deliberate contrast — and avoid colour-cycling modes that conflict with the considered aesthetic the style aims for. Cage-style LED bulbs and Edison filament strips are also effective accent lighting choices that suit both gaming and industrial aesthetics.",
        },
    ],
    "tropical-living-room": [
        {
            question: "What plants work best in a tropical living room?",
            answer: "Large-statement plants with architectural quality — fiddle-leaf figs, bird of paradise, monstera, or tall palms — have the most impact in a living room. Pair these with trailing plants at shelf height and smaller species on coffee tables or windowsills for a layered effect that reads as genuinely abundant rather than decorated.",
        },
        {
            question: "What furniture materials suit a tropical living room?",
            answer: "Rattan, bamboo, woven seagrass, and solid teak or acacia are the most characteristic choices. Upholstery in natural linen or cotton canvas in warm cream, forest green, or terracotta grounds the furniture within the overall palette. Avoid metal and glass furniture, which read against the organic quality the style aims for.",
        },
        {
            question: "What colours create a tropical living room?",
            answer: "The palette should draw from nature: forest greens, terracotta, clay orange, warm sand, and natural white rather than bright primary colours. Tropical design misunderstood as simply 'adding green' often results in rooms that feel cold when the green chosen is bright or cool-toned. Work with the warm end of the green spectrum.",
        },
    ],
    "tropical-bedroom": [
        {
            question: "What bedding suits a tropical bedroom?",
            answer: "Lightweight cotton or linen bedding in warm neutral tones — sandy cream, terracotta, soft sage — suits both the style and the practical requirement of sleeping comfortably in a warmer room. Avoid synthetic bedding that traps heat. A lightweight cotton waffle blanket layered over the duvet adds texture without additional warmth.",
        },
        {
            question: "How do I control light in a tropical bedroom?",
            answer: "Bamboo or rattan blinds filter daylight beautifully during the day, creating the dappled quality of outdoor shade. For nighttime, these need to be combined with a blackout layer — either a fitted blackout blind behind the rattan, or lined curtains in a natural fabric that can be closed over the blind.",
        },
        {
            question: "What plants survive in a bedroom with tropical design?",
            answer: "Snake plants (Sansevieria), peace lilies, and ZZ plants all tolerate the lower light levels typical of bedrooms and also filter air effectively. A single large plant positioned where it is visible from the bed has more impact than several small plants scattered around the room.",
        },
    ],
    "tropical-kitchen": [
        {
            question: "What cabinet colours suit a tropical kitchen?",
            answer: "Warm sage green, deep forest green, terracotta, or warm cream are all characteristic. The palette should feel like it belongs in the natural world rather than referencing urban or industrial colour traditions. Cabinet fronts in these colours work particularly well against terracotta floor tiles and rattan pendant lights.",
        },
        {
            question: "What countertops suit a tropical kitchen?",
            answer: "Butcher block timber, honed stone in warm tones (travertine, sandstone, or warm beige marble), or terracotta tile sections used for decorative areas work well. The material should have natural variation and warmth rather than the uniformity of engineered composite surfaces that suit modern or minimalist kitchens better.",
        },
        {
            question: "Can a tropical kitchen be practical as well as decorative?",
            answer: "Yes — the style's enthusiasm for open shelving, functional crockery on display, and herbs growing in the kitchen all reflect genuine engagement with cooking as a daily practice. The aesthetic difficulty is maintaining the ordered quality of open shelving, which requires selecting tableware that is worth displaying and maintaining its organisation.",
        },
    ],
    "tropical-bathroom": [
        {
            question: "What stone works in a tropical bathroom?",
            answer: "Travertine, sandstone, warm limestone, or pebble mosaic are all characteristic of the tropical bathroom aesthetic. The material should have natural colour variation and an organic quality that references the natural environment. Avoid highly polished white stone, which reads as modern rather than tropical.",
        },
        {
            question: "What plants can survive in a bathroom?",
            answer: "Ferns, pothos, peace lilies, and orchids all tolerate the humidity of a bathroom environment well. A large fern on a shelf or hanging in a macrame holder, combined with air plants (Tillandsia) that require no soil and absorb moisture from the air, can create significant plant presence without requiring much maintenance.",
        },
        {
            question: "What accessories suit a tropical bathroom?",
            answer: "Teak or bamboo bath accessories — soap dishes, shelves, towel rings — natural stone or concrete vessels for toiletries, and large cotton or linen towels in warm natural tones are all appropriate. Avoid chrome-plated plastic accessories that create a jarring contrast with the natural materials around them.",
        },
    ],
    "tropical-dining-room": [
        {
            question: "What dining table suits a tropical style?",
            answer: "A solid timber table with visible grain — teak, acacia, or mango wood — in a warm natural oil finish is the most characteristic choice. The table should feel like something that connects to the natural world rather than a processed, uniform surface. Live-edge tables work particularly well in a tropical dining room.",
        },
        {
            question: "How do I create a sense of outdoor dining indoors?",
            answer: "Position the table where it receives direct or reflected natural light, hang rattan or bamboo pendants low over the table, use terracotta or ceramic tableware rather than porcelain, and place a large plant or two at the periphery of the seating area. Opening windows or a glass door adjacent to the table completes the connection to the outdoors.",
        },
        {
            question: "What textiles work in a tropical dining room?",
            answer: "Natural fibre placemats in woven seagrass or rattan, linen napkins in warm earthy tones, a jute or sisal rug beneath the table, and rattan or cane chair seats all maintain the natural material consistency that the style requires.",
        },
    ],
    "tropical-office": [
        {
            question: "Does a tropical aesthetic help with focus and productivity?",
            answer: "Research into biophilic design suggests that exposure to natural materials and living plants reduces physiological stress markers and supports sustained attention during cognitively demanding tasks. A tropical home office that incorporates genuine plants and natural material surfaces may offer a measurable productivity benefit beyond its aesthetic value.",
        },
        {
            question: "What desk suits a tropical home office?",
            answer: "A solid timber desk in teak, acacia, or bamboo with a natural oil or wax finish is the most characteristic choice. The desk surface should show the material's natural variation — grain, knots, slight irregularity — rather than a factory-uniform finish. Position it near a window where plants can also benefit from the natural light.",
        },
        {
            question: "How do I prevent a tropical office from feeling cluttered?",
            answer: "Use closed storage for all equipment and paperwork not in active use, and treat plants and natural objects as the room's primary decorative element rather than adding them on top of an already full space. The visual richness of plants and natural materials means the room needs less conventional decoration to feel complete.",
        },
    ],
    "tropical-gaming-room": [
        {
            question: "How do I combine natural tropical materials with gaming technology?",
            answer: "Choose gaming furniture in natural materials where possible — a solid timber desk, rattan or cane storage, a bamboo shelving unit — and position technology against those surfaces rather than on dedicated plastic gaming furniture. Cable management is critical: exposed cables on a natural timber desk undermine the aesthetic far more than they would on a conventional desk.",
        },
        {
            question: "What lighting suits a tropical gaming room?",
            answer: "Warm amber lighting rather than cool white or RGB cycling is most consistent with the tropical aesthetic. A rattan or bamboo pendant for ambient light, adjustable warm LED strips behind the monitor for bias lighting, and a desk lamp with a warm shade create an environment that works for both gaming and relaxation.",
        },
        {
            question: "What plants survive in a gaming room?",
            answer: "Gaming rooms are often darker than other rooms due to blackout requirements for screen visibility, which limits plant selection. ZZ plants, snake plants (Sansevieria), and pothos all tolerate low light effectively. A grow light positioned to illuminate plants without affecting screen quality extends the range of species that can thrive.",
        },
    ],
    "bohemian-living-room": [
        {
            question: "How do I prevent a bohemian living room from looking chaotic?",
            answer: "A unifying colour thread — a dominant tone that appears across most of the textiles, even in different patterns and origins — is the most effective organising principle. If every textile in the room shares a common warm amber or terracotta undertone, they read as a collection rather than a random assembly.",
        },
        {
            question: "What is the best way to start building a bohemian living room?",
            answer: "Begin with a large rug in a pattern and palette you genuinely love, and build outward from its colours. The rug provides the floor-level anchor that everything else in the room can respond to, and starting with it avoids the common mistake of accumulating separate elements that never quite cohere.",
        },
        {
            question: "Can a rented home have a bohemian interior?",
            answer: "The style is exceptionally well-suited to rental situations because it depends on portable objects — textiles, cushions, artworks, plants, ceramics — rather than permanent installation. A bare white-walled rental flat can be transformed into a fully bohemian interior with nothing attached to the walls and everything moveable.",
        },
    ],
    "bohemian-bedroom": [
        {
            question: "What bedding suits a bohemian bedroom?",
            answer: "Layered bedding in different patterns and textures from the same colour family — a printed duvet cover, a textured throw in a complementary tone, embroidered cushions, a knitted blanket — creates the characteristic layered quality of bohemian bedroom styling. Avoid matching sets from the same collection, which produce a coordinated look that conflicts with the accumulated character the style aims for.",
        },
        {
            question: "What artwork works in a bohemian bedroom?",
            answer: "A wall of framed prints in mismatched frames, a large macrame wall hanging, textile art from different cultures, or a gallery arrangement combining photographs, paintings, and botanical prints are all characteristic. The arrangement should look gathered over time rather than purchased as a set from a single source.",
        },
        {
            question: "How many textiles is too many in a bohemian bedroom?",
            answer: "There is no firm maximum, but the practical constraint is that the bed must be usable and the floor must be navigable. The textiles should create layered warmth and visual richness rather than making the room difficult to move through or maintain. A regular edit to remove items that are not genuinely loved keeps the collection purposeful.",
        },
    ],
    "bohemian-kitchen": [
        {
            question: "What crockery suits a bohemian kitchen?",
            answer: "Handmade or artisan-produced ceramics in complementary colours rather than matching sets, different patterns from different origins displayed together, vintage market finds mixed with quality contemporary pieces — the character is accumulated rather than selected. Avoid uniformity across the entire tableware collection.",
        },
        {
            question: "How do I organise a bohemian kitchen without losing the aesthetic?",
            answer: "Organise by function within a general framework of visual coherence — similar colours together, objects grouped by use — rather than by strict uniformity. A row of different ceramic storage jars in a shared colour family reads as a collection rather than disorder, even though the pieces are not identical.",
        },
        {
            question: "What flooring suits a bohemian kitchen?",
            answer: "Original or reclaimed encaustic cement tiles, worn terracotta tiles, or painted timber floorboards are all characteristic. The floor in a bohemian kitchen should have visible age or character rather than the uniform finish of modern materials. A kilim runner in a warm palette is a practical addition if the floor itself is neutral.",
        },
    ],
    "bohemian-bathroom": [
        {
            question: "What tiles work in a bohemian bathroom?",
            answer: "Zellige tiles from Morocco — hand-made fired clay tiles with natural colour variation — are the most characteristically bohemian tile choice. Encaustic cement tiles in geometric patterns, vintage ceramic tiles with hand-painted decoration, and patterned Indian tiles are all appropriate. A single feature wall in a decorative tile rather than the whole room is often the most effective approach.",
        },
        {
            question: "How do I add bohemian character to a conventional bathroom?",
            answer: "A large vintage mirror, a macrame wall hanging, a collection of artisan-made soap dishes and toiletry vessels, a kilim or Turkish towel as a bath mat, and a small shelf of plants create significant bohemian character without requiring any structural change to the room.",
        },
        {
            question: "What lighting suits a bohemian bathroom?",
            answer: "Warm-toned lighting at face level — a mirror with integrated warm LED strips, or a pair of wall sconces on either side of a mirror — is more flattering and more characteristic of the style than harsh overhead illumination. Candle lanterns on shelves or the edge of a bath add the atmospheric quality the style is associated with.",
        },
    ],
    "bohemian-dining-room": [
        {
            question: "How do I seat a large group bohemian style?",
            answer: "Mismatched chairs in a shared colour or material are more bohemian than a matching set. A long timber table with three different chair types — two upholstered armchairs at each end, a wooden bench on one side, and a mix of side chairs on the other — is both practical for varied group sizes and characteristically bohemian in its approach.",
        },
        {
            question: "What table centrepiece suits a bohemian dining room?",
            answer: "A cluster of candles in different heights and materials — beeswax taper candles in ceramic holders, wide pillar candles on a wooden tray, tea lights in glass vessels — is more characteristic than a floral arrangement. Add dried botanical elements, stones, or small ceramic objects to build a centrepiece that can remain in place between meals.",
        },
        {
            question: "What flooring suits a bohemian dining room?",
            answer: "Original floorboards, worn parquet, or painted wood with a large kilim or wool rug underneath the table are most appropriate. The floor in a bohemian dining room should have visible history or character — the patina of use adds to the room's accumulated quality rather than detracting from it.",
        },
    ],
    "bohemian-office": [
        {
            question: "How do I maintain a bohemian home office without losing productivity?",
            answer: "The key is distinguishing between visual richness (characteristic of the style and manageable) and functional disorder (incompatible with working efficiently). A desk surface that is visually interesting — a leather pad, a ceramic pen holder, a small plant — but clear of non-working items is achievable within a bohemian aesthetic.",
        },
        {
            question: "What desk suits a bohemian home office?",
            answer: "A vintage writing desk, a reclaimed timber table used as a desk, or a large antique secretary with fold-down work surface are all characteristic. The desk does not need to look like office furniture — the bohemian approach is to use beautiful objects from different contexts for whatever purpose they serve.",
        },
        {
            question: "What bookshelves work in a bohemian office?",
            answer: "Open shelves with a combination of books arranged by colour and horizontally stacked volumes, interspersed with objects — a small sculpture, a framed print, a plant, a ceramic vessel — create a characteristic bohemian shelf display. The arrangement should look curated rather than organised to a strict system.",
        },
    ],
    "bohemian-gaming-room": [
        {
            question: "How do I fit gaming equipment into a bohemian room?",
            answer: "Position the gaming setup against one wall and treat the rest of the room with the full bohemian vocabulary of textiles, plants, and collected objects. The contrast between the technology of the gaming setup and the warmth of the surrounding space is an interesting design tension rather than a problem to solve. Cable management on the gaming wall allows the rest of the room to maintain its aesthetic.",
        },
        {
            question: "What seating suits a bohemian gaming room?",
            answer: "A large floor cushion or layered cushion seating, a vintage velvet sofa, or a rattan or cane armchair for secondary seating create a relaxed, alternative-to-the-desk option in a bohemian gaming room. This works particularly well for console gaming where a comfortable floor-level position is often preferred.",
        },
        {
            question: "What lighting suits a bohemian gaming room?",
            answer: "Warm amber and orange tones from floor lamps, table lamps, and string lights create the characteristic bohemian atmosphere and contrast effectively with the screens of a gaming setup. Avoid cool-white or blue-toned lighting that flattens the textiles and materials the style relies on.",
        },
    ],
    "vintage-living-room": [
        {
            question: "How do I mix different period pieces without the room looking confused?",
            answer: "Choose a dominant era for the largest pieces — the sofa, the case furniture, the major lighting — and treat pieces from other periods as supporting accents. A mid-century sofa with a Victorian drinks cabinet and a 1970s floor lamp works because the sofa establishes the room's primary period character and the other pieces are clearly subordinate.",
        },
        {
            question: "What paint colours suit a vintage living room?",
            answer: "Muted, historically-informed colours — dusty rose, aged sage, ochre, warm terracotta, deep teal — are more characteristic than the bright or stark tones of contemporary palettes. Heritage paint ranges from manufacturers like Farrow and Ball, Little Greene, or Annie Sloan provide colours developed from historical pigment traditions.",
        },
        {
            question: "How do I find genuine vintage furniture?",
            answer: "Estate sales and house clearances are the highest-yield sources for quality pieces at reasonable prices. Specialist dealers in specific periods — mid-century, Victorian, art deco — offer curated quality but at a premium. Online marketplaces are useful but require skill in assessing quality from photographs. Developing relationships with local dealers often leads to first access to good pieces.",
        },
    ],
    "vintage-bedroom": [
        {
            question: "What period makes the best vintage bedroom?",
            answer: "Different eras suit different aesthetics: the 1950s and 1960s produce clean-lined timber furniture that reads as warmly vintage without being fussy; the Victorian and Edwardian periods produce ornate brass beds and marble-topped washstands that create a more romantic atmosphere; the 1970s produces substantial upholstered pieces with character. Choose based on the mood you want rather than a single period's completeness.",
        },
        {
            question: "How do I update vintage bedroom furniture without losing its character?",
            answer: "Reupholstering chair seats and headboards in contemporary fabrics while keeping original frames is the most effective update. Replacing original handles with new hardware in an appropriate finish (brushed brass, black iron) refreshes case furniture. Refinishing surfaces in a lighter colour sometimes removes rather than preserves patina — research the specific piece's character before sanding.",
        },
        {
            question: "What bedding suits a vintage bedroom?",
            answer: "Crisp white cotton or linen bedding is the most versatile foundation in a vintage bedroom because it provides a clean background against which an antique frame, vintage art, or period wallpaper can be appreciated. Alternatively, a vintage quilt or antique textile as the primary bedcover adds the period character directly.",
        },
    ],
    "vintage-kitchen": [
        {
            question: "What appliances suit a vintage kitchen?",
            answer: "Range cookers in cream or red with classic styling (AGA, Rangemaster, or SMEG), freestanding refrigerators in complementary colours (often available from SMEG or Big Chill), and traditional Belfast sinks are the key appliance choices that establish and maintain the vintage kitchen aesthetic.",
        },
        {
            question: "Do vintage kitchens need to be impractical?",
            answer: "No — the most successful vintage kitchens integrate contemporary functionality within a historical aesthetic framework. Dishwashers, modern refrigeration, and efficient induction or gas cooking are all compatible with Shaker-style cabinetry, Belfast sinks, and vintage-appropriate tile. The visual character of period kitchens is independent of their technical capability.",
        },
        {
            question: "What floor suits a vintage kitchen?",
            answer: "Terracotta quarry tiles, Victorian-pattern encaustic tiles, York stone or reproduction stone flags, and painted timber floorboards are all historically appropriate. Original or reproduction materials from the chosen period create the most convincing result. Black-and-white chequerboard tile is another characteristic choice, particularly for kitchens referencing the early twentieth century.",
        },
    ],
    "vintage-bathroom": [
        {
            question: "Where do I find a genuine vintage bath?",
            answer: "Architectural salvage yards are the primary source for genuine roll-top and claw-foot baths. Quality varies considerably — inspect the enamel surface for chips and crazing, and check the feet are original or can be replaced. Specialist bath restoration companies can re-enamel originals that have surface damage. New reproductions from companies like Burlington or Lefroy Brooks are a reliable alternative when salvage quality is uncertain.",
        },
        {
            question: "What taps suit a vintage bathroom?",
            answer: "Cross-head taps in chrome, nickel, or unlacquered brass, wall-mounted or deck-mounted with exposed pipework, are most appropriate. Thermostatic valves are available in period-appropriate finishes and add contemporary function without compromising the aesthetic. Avoid modern bar-handle taps that conflict with the period character of the fittings.",
        },
        {
            question: "What flooring works in a vintage bathroom?",
            answer: "Encaustic cement tiles in geometric black-and-white patterns, small hexagon mosaic tiles in white with a border detail, Victorian-pattern floor tiles in terracotta and black, or York stone slabs are all historically appropriate. The floor material is often the most visible period marker in a bathroom and worth investing in correctly.",
        },
    ],
    "vintage-dining-room": [
        {
            question: "What dining table suits a vintage dining room?",
            answer: "A substantial extending table in solid wood — mahogany, oak, or walnut — with traditional joinery visible in the legs and frame is most appropriate. Period extending mechanisms are often found in estate sale pieces at prices well below equivalent new furniture, and the quality of construction is frequently superior.",
        },
        {
            question: "What lighting suits a vintage dining room?",
            answer: "A chandelier in crystal, aged brass, or decorative metalwork suited to the room's period character — Victorian, art deco, or mid-century — provides the most appropriate focal point. The fitting should be sized to the table below it (roughly one-half to two-thirds of the table's width) and hung at the correct height.",
        },
        {
            question: "How do I modernise a vintage dining room without destroying its character?",
            answer: "Update the tableware and linen rather than the furniture. Contemporary ceramic plates on a Victorian table, modern glass on an antique sideboard, and a deliberately simple pendant alongside a period chandelier all allow a vintage dining room to function with contemporary ease without compromising the character that makes the room interesting.",
        },
    ],
    "vintage-office": [
        {
            question: "How do I hide computer equipment in a vintage home office?",
            answer: "Secretary desks with a fold-down work surface can conceal the entire setup when not in use. Alternatively, a period-appropriate armoire or wardrobe can be fitted internally with shelves and cable routing to house all equipment when the doors are closed. A period-style monitor arm that holds a flat screen in front of vintage shelving is less visually disruptive than a monitor stand.",
        },
        {
            question: "What is the best source for a genuine vintage desk?",
            answer: "Estate sales of solicitors' offices, accountants' practices, or schools from the right era often yield substantial period desks at prices far below equivalent retail pieces. Victorian partners desks, Edwardian pedestal desks, and mid-century modern executive desks are all categories with healthy estate sale and auction supply.",
        },
        {
            question: "How do I light a vintage home office correctly?",
            answer: "A bankers lamp or a quality reproduction of a period desk lamp provides task lighting with period character. For ambient lighting, a floor lamp with a fabric shade in the room's corner, or wall-mounted reading lights on adjustable arms, are more characteristic than ceiling fixtures. Avoid recessed spotlights in a vintage office — they are anachronistic and practically difficult to retrofit without significant ceiling work.",
        },
    ],
    "vintage-gaming-room": [
        {
            question: "How do I combine vintage design with modern gaming equipment?",
            answer: "Treat the gaming setup as a clearly contemporary element within a predominantly vintage room, rather than trying to disguise it. A modern monitor and gaming peripherals on an antique desk, surrounded by period furniture and vintage art, creates an interesting contrast that is more honest than attempting to make technology look vintage.",
        },
        {
            question: "What seating works in a vintage gaming room?",
            answer: "A leather club chair or Chesterfield-style armchair positioned facing a screen creates a gaming setup with genuine vintage character. For desk-based gaming, a restored swivel office chair from the 1960s or 1970s provides period aesthetic and is often more comfortable than modern gaming chairs for shorter gaming sessions.",
        },
        {
            question: "What vintage room aesthetic pairs best with gaming?",
            answer: "The mid-century aesthetic — 1950s to 1970s — sits closest to the period when electronic entertainment entered domestic life, giving it an organic connection to the activity. An MCM gaming room with a vintage console library displayed alongside period furniture creates a room that comments on the history of the technology rather than simply containing it.",
        },
    ],
    "luxury-living-room": [
        {
            question: "What distinguishes genuine luxury from expensive-looking design?",
            answer: "Genuine luxury is visible in the details that are not immediately apparent: the quality of the joinery on a bespoke cabinet, the evenness of a hand-stitched seam, the depth of colour in a natural stone tile, the precision of a light fitting's installation. Expensive-looking design often relies on obvious signals — metallics, marble-effect surfaces, oversized decorative items — that do not bear close inspection.",
        },
        {
            question: "What materials define a luxury living room?",
            answer: "Natural stone (marble, limestone, travertine, or onyx), solid hardwood in species with visible grain character (walnut, oak, ash), full-grain leather, hand-woven fabrics (cashmere, wool, linen), and metals in real finishes (brass, bronze, nickel) rather than chrome-plated steel. Each material should be specifiable to a grade and verifiable.",
        },
        {
            question: "How do I light a luxury living room effectively?",
            answer: "Three layers of lighting controlled on separate dimmer circuits: ambient (recessed or coved, set at a low level for general use), accent (directed at art, architecture, or specific material surfaces), and table or floor lamps for intimate seating areas. The quality of the light fittings and the expertise of their installation are as important as the overall design.",
        },
    ],
    "luxury-bedroom": [
        {
            question: "What makes a bedroom genuinely luxurious rather than simply expensive?",
            answer: "A bed that delivers excellent sleep — appropriate mattress firmness, correct pillow depth, breathable bedding — is the non-negotiable foundation. Beyond that, the quality of blackout window treatment, the warmth of the flooring underfoot, and the temperature control of the room all affect daily experience far more than the cost of decorative objects.",
        },
        {
            question: "What bedding defines a luxury bedroom?",
            answer: "Long-staple cotton (Egyptian or Pima) in high thread count for crisp bedding, Hungarian goose down for duvets and pillows, or cashmere and wool blends for throws. The brands that supply luxury hotels are often accessible directly — they manufacture to a quality standard designed for daily commercial use, which exceeds the durability of most consumer alternatives.",
        },
        {
            question: "What flooring suits a luxury bedroom?",
            answer: "Engineered or solid hardwood in a timber of genuine character — wide-plank oak with visible grain, walnut in a natural oil finish — with an area rug of natural fibre (wool or silk) on each side of the bed is the most common luxury bedroom floor treatment. Fitted carpet in fine wool is also a classic choice for warmth and acoustic comfort.",
        },
    ],
    "luxury-kitchen": [
        {
            question: "What defines a luxury kitchen specification?",
            answer: "The quality of appliances (professional-grade cooking surfaces, proper refrigeration with stable temperature control, effective and quiet dishwashing), the material specification of worktops and cabinetry (solid stone, hand-painted or lacquered door fronts, solid wood drawer boxes with soft-close mechanism), and the precision of installation (flush joints, level surfaces, correctly aligned handles) together constitute a genuinely luxurious kitchen.",
        },
        {
            question: "Are hand-painted kitchen cabinets worth the cost?",
            answer: "For longevity and repairability, yes. Hand-painted cabinets can be touched up and repainted as required without replacing the entire door front, which is not practical with foil-wrapped or laminate alternatives. The initial cost premium is recovered over a longer useful life and the ability to change the colour without replacing the cabinetry.",
        },
        {
            question: "What kitchen layout suits a luxury kitchen?",
            answer: "A working kitchen at the scale of a luxury specification benefits from a generous island, ample landing space adjacent to cooking surfaces, and a separate scullery or utility space where less attractive functional items (bins, laundry, cleaning equipment) are housed. This separation maintains the visual quality of the main kitchen during and after use.",
        },
    ],
    "luxury-bathroom": [
        {
            question: "What shower specification defines a luxury bathroom?",
            answer: "Adequate head clearance (at least 210cm from floor to shower head), a correctly sized enclosure for comfortable movement, thermostatic valve control (temperature set precisely once and maintained without adjustment), a drain that removes water at the rate it is delivered, and a shower head with genuine water pressure. Many expensive bathrooms fail on one or more of these functional specifications.",
        },
        {
            question: "What stone suits a luxury bathroom?",
            answer: "Marble (Carrara, Calacatta, Statuario, or Nero Marquina for contrast), natural limestone, travertine, and onyx are all characteristic luxury bathroom stones. Each requires sealing and appropriate cleaning products. The veining and colour variation in natural stone is its primary advantage over engineered alternatives — insist on seeing the specific slabs you are purchasing before they are cut.",
        },
        {
            question: "Is underfloor heating worth installing in a bathroom?",
            answer: "In a bathroom, underfloor heating is one of the highest-return investments per pound spent because the benefit is experienced at every use of the room — stepping out of a bath or shower onto a cold floor is one of the most universally unpleasant bathroom experiences. Electric underfloor heating in a bathroom is also relatively affordable to install compared to wet systems.",
        },
    ],
    "luxury-dining-room": [
        {
            question: "What dining chair quality defines the luxury category?",
            answer: "A genuinely comfortable dining chair for extended meals requires specific ergonomic qualities: a seat depth of 44-47cm, a back height that provides lumbar support, appropriate seat firmness (not so soft that posture collapses), and armrests at a height that does not raise the shoulders. These specifications exist independently of the chair's price or visual quality.",
        },
        {
            question: "What table material suits a luxury dining room?",
            answer: "A single slab of natural stone (marble, limestone, or terrazzo) for a statement contemporary table, or a solid hardwood table in walnut, oak, or mahogany for a more traditional register, are both appropriate. The material should have natural variation that rewards close inspection — the mark of a genuine luxury material rather than a manufactured simulation of it.",
        },
        {
            question: "How do I light a luxury dining table correctly?",
            answer: "The pendant or chandelier over the table should provide intimate, directional light that illuminates the table and the people seated around it without spilling light upward or outward in ways that flatten the room. Dimmable LED fittings allow the light level to be adjusted from bright for family meals to low for dinner parties. Consider separate lighting for a sideboard or display area.",
        },
    ],
    "luxury-office": [
        {
            question: "What desk specification suits a luxury home office?",
            answer: "A custom-made desk in a hardwood of genuine character, at the precise height for the user's proportions (usually 70-75cm for seated work, higher for standing), with a surface depth of at least 80cm, integrated cable management, and a material that rewards daily tactile contact — leather, stone, or fine-grained solid timber — defines the luxury home office desk.",
        },
        {
            question: "What task chair justifies a significant investment?",
            answer: "A task chair that provides full adjustment of seat height, seat depth, lumbar support height and firmness, armrest height and rotation, and recline resistance — and that maintains these adjustments under daily use over several years — justifies investment. Chairs in this category (Herman Miller, Humanscale, Steelcase, HAG) have a cost-per-use over a typical working life that compares favourably with cheaper alternatives requiring earlier replacement.",
        },
        {
            question: "How do I control noise in a luxury home office?",
            answer: "Acoustic treatment does not need to be visible to be effective. Fabric-wrapped acoustic panels can be fitted behind bookshelves or integrated into wall panels. Mass-loaded vinyl under flooring, solid-core doors, and double-glazed windows all reduce transmitted sound. Carpeting or a large wool rug under the desk reduces reflected sound within the room. The investment is in a working environment that allows sustained concentration.",
        },
    ],
    "luxury-gaming-room": [
        {
            question: "What audio specification suits a luxury gaming room?",
            answer: "A properly calibrated surround sound system — with speakers positioned at the correct angles and distances for the seating position, combined with acoustic treatment that allows the system to perform without room resonances — defines audio in a luxury gaming room. Room correction systems (Dirac, Audyssey) can compensate for acoustic imperfections but do not replace proper acoustic treatment.",
        },
        {
            question: "What display specification defines a luxury gaming room?",
            answer: "Display quality in a gaming context is determined by panel technology (OLED for contrast, Mini-LED for brightness), resolution (4K for large screens), refresh rate (120Hz minimum for responsive gaming), response time, and calibration. A display installed at the correct viewing distance for its size, calibrated to a reference standard, in a room where ambient light is controlled, performs at its specification rather than below it.",
        },
        {
            question: "How do I incorporate a luxury gaming room into a home without compromising the overall design?",
            answer: "Acoustic insulation between the gaming room and adjacent rooms, a door that seals effectively, and finishes that match the quality standard of the rest of the home all integrate a dedicated gaming room into a luxury property without it reading as an afterthought. The technology inside the room need not be visible from outside it.",
        },
    ],
    // Art Deco had no FAQ entries at all, which is why /design/art-deco-bedroom
    // shipped with no FAQ section and no FAQ schema despite taking 415
    // impressions. Questions below are taken from the actual query cluster in
    // Search Console: "art deco bedroom ideas", "modern art deco bedroom",
    // "simple art deco bedroom", "art deco bedroom decorating ideas".
    "art-deco-bedroom": [
        {
            question: "What colours work in an Art Deco bedroom?",
            answer: "A neutral base plus one jewel tone is the reliable formula. Warm off-white, greige or a soft camel across the walls, then emerald, sapphire, oxblood or dusty rose introduced through the headboard and cushions. Black and deep charcoal work as a grounding third colour on lacquered furniture. The mistake is running the jewel tone across the walls as well as the furniture — that is a 1920s period reconstruction rather than the contemporary interpretation most people are looking for.",
        },
        {
            question: "How do I make an Art Deco bedroom feel modern rather than dated?",
            answer: "Keep the geometry and the metals, cut the ornament density by about two thirds. One repeated motif — a fan, a sunburst or a chevron — instead of three. Plain walls instead of patterned wallpaper. Brass or polished chrome hardware, never matte black, which reads as generic contemporary and cancels the Deco signal. The result keeps the style's identity while remaining a room you can sleep in.",
        },
        {
            question: "What is the single highest-impact Art Deco bedroom element?",
            answer: "The headboard. A tall upholstered panel in velvet with channel tufting, a fan silhouette or a stepped outline carries more of the style than any other single object, and it is the element people read first. If the budget only stretches to one considered purchase, it should be the headboard rather than the case goods.",
        },
        {
            question: "Does Art Deco work in a small bedroom?",
            answer: "Yes, with adjusted ratios. Keep the tall headboard, because vertical emphasis makes a small room read taller, but replace freestanding bedside tables with wall-mounted shelves, drop the pendant in favour of two wall sconces to free the ceiling plane, and keep walls in a warm off-white so the dark tones do not close the space in. Confine the geometry to the mirror and the hardware.",
        },
        {
            question: "What metals belong in an Art Deco bedroom?",
            answer: "Brass and polished chrome. Art Deco predates the matte-black hardware convention entirely, and matte black is the fastest way to make the room read as generic contemporary. Mixing brass and chrome is period-appropriate provided one of them clearly leads and the other appears once or twice.",
        },
        {
            question: "What lighting suits an Art Deco bedroom?",
            answer: "A tiered or fluted pendant in frosted glass with brass or chrome fittings, plus wall sconces flanking the bed rather than table lamps. The sconces are the detail most contemporary Art Deco bedrooms skip, and their absence is why those rooms end up looking like a Deco headboard installed in an ordinary bedroom.",
        },
    ],
    "art-deco-living-room": [
        {
            question: "How do I get an Art Deco living room without it looking like a hotel lobby?",
            answer: "Limit the reflective surfaces. Art Deco living rooms tip into hotel territory when mirror, lacquer, brass and velvet all appear at full strength simultaneously. Choose two of the four to lead — commonly velvet seating and brass lighting — and let lacquer and mirror appear once each as accents.",
        },
        {
            question: "What seating defines an Art Deco living room?",
            answer: "A curved or scalloped sofa in velvet or a tight-weave bouclé, with a low back and visible tapered legs, is the anchor. Club chairs with rolled arms in leather work as the counterpoint. The silhouettes matter more than the upholstery colour — a curved sofa in a neutral fabric reads more Deco than a square sofa in emerald velvet.",
        },
        {
            question: "What flooring suits an Art Deco living room?",
            answer: "Dark stained timber, parquet in a herringbone or chevron lay, or a large-format tile in a two-tone geometric pattern. If the floor already carries a strong geometric pattern, the rug on top should be plain — the most common failure in Deco living rooms is two competing geometries on the floor plane.",
        },
    ],
    "art-deco-dining-room": [
        {
            question: "What table shape suits an Art Deco dining room?",
            answer: "Round or oval on a pedestal or starburst base, in a lacquered finish or a figured veneer such as burl walnut. The pedestal is functionally useful as well as period-correct — it removes corner legs and seats more people comfortably in a room where the table is usually the visual centrepiece.",
        },
        {
            question: "How many Art Deco elements are too many in a dining room?",
            answer: "The dining room tolerates more than any other room in the house, because it is used in short, occasion-driven bursts rather than lived in. Even so, one strong colour direction should lead. Patterned wallpaper on top of velvet chairs, a figured-veneer table, a brass sideboard and a tiered chandelier is the point at which the room stops reading as designed and starts reading as staged.",
        },
        {
            question: "What lighting works over an Art Deco dining table?",
            answer: "A tiered chandelier or a fluted glass pendant hung 75-85cm above the table surface. Scale it generously — an undersized fitting is the most common error, and a Deco dining room can carry a fixture roughly half to two thirds the width of the table.",
        },
    ],
    "farmhouse-kitchen": [
        {
            question: "What cabinet colour works best in a farmhouse kitchen?",
            answer: "Muted, slightly desaturated colours hold up best: sage green, mushroom, putty, soft off-white, and deep blue-grey. Pure brilliant white reads as contemporary rather than farmhouse, and high-gloss finishes fight the style entirely. If the room has limited natural light, keep wall units in the palest tone and reserve the stronger colour for base units and the island, which keeps the upper half of the room bright.",
        },
        {
            question: "Is a Belfast sink practical for daily use?",
            answer: "Yes, with two caveats. Fireclay Belfast sinks are heavy — a full one plus water can exceed 60kg, so the base unit needs proper support rather than standard carcass sides. And the exposed apron means water runs down the front of the cabinet unless the tap is positioned to land centrally in the bowl. In exchange you get a bowl deep enough for oven trays, which no standard undermount sink offers.",
        },
        {
            question: "Do I need open shelving in a farmhouse kitchen?",
            answer: "No. Open shelving is the most-photographed element of the style and the most abandoned in practice, because it collects cooking grease and dust and requires the crockery on it to be worth looking at. A useful compromise is one run of open shelving in the least grease-exposed corner of the room, with everything else behind doors. The style survives perfectly well without it.",
        },
        {
            question: "What worktop suits a farmhouse kitchen?",
            answer: "Butcher block (oak or iroko) and honed natural stone both suit the style because they accept marks rather than resisting them, which is central to the farmhouse aesthetic. Timber needs re-oiling roughly twice a year and will darken around the sink; honed granite and soapstone need sealing but tolerate heat. Polished quartz in a stone-effect print is the common substitute but reads noticeably flatter in person.",
        },
    ],
    "coastal-living-room": [
        {
            question: "How do I get a coastal living room without it looking themed?",
            answer: "Remove the literal references first: no anchors, no rope-wrapped objects, no shell displays, no navy-and-white stripes on everything. What actually produces the effect is material and light — whitewashed or limed timber, washed linen or cotton slipcovers, a jute or sisal rug, woven pendant shades, and a palette of soft white, sand, and one restrained blue or sage. The room should read as a bright house near water, not as a gift-shop display.",
        },
        {
            question: "What sofa fabric works in a coastal living room?",
            answer: "Washed linen, cotton canvas, and performance-weave blends in undyed or pale tones are the standard choices. The critical feature is a removable, washable slipcover, because a pale palette only survives real use if it can be laundered. Loose-fit covers also produce the relaxed silhouette the style depends on — a tightly upholstered sofa in the same fabric reads as formal rather than coastal.",
        },
        {
            question: "Does a coastal living room work in a room with limited natural light?",
            answer: "Partially. The style leans heavily on daylight, so in a north-facing or shaded room the cool blues turn grey and the palette flattens. The workaround is to shift warm — sand, oatmeal, and pale driftwood tones rather than crisp white and sea-blue — and to layer 2700K lighting at multiple heights. Visualising the room before repainting is worth doing here, because the difference is dramatic and paint is expensive to undo.",
        },
    ],
    "japandi-living-room": [
        {
            question: "What is the difference between Japandi and minimalist design?",
            answer: "Minimalism is defined by subtraction — the fewest objects that still allow the room to function. Japandi is defined by material warmth within restraint: it keeps a similar object count but insists those objects have visible grain, hand-finish, or natural irregularity. A minimalist living room can be entirely white and smooth; a Japandi one cannot, because the wood, linen, paper, and ceramic are the point.",
        },
        {
            question: "How many wood tones should a Japandi living room use?",
            answer: "Two at most, and they should be clearly different rather than nearly the same — pale oak with a single walnut piece works, oak with a slightly yellower oak does not. If your existing floor is the mid-orange tone common in older laminate, treat that as one of your two and choose furniture in a distinctly paler or darker species rather than trying to match it, because a near-miss is more visible than a deliberate contrast.",
        },
        {
            question: "What colours belong in a Japandi living room?",
            answer: "A base of warm off-white, oatmeal, or a very pale greige, plus the wood tones, plus at most one muted accent — charcoal, clay, moss, or ink blue. Saturated colour breaks the style immediately because there is no pattern or ornament to absorb it. Texture (boucle, linen weave, raw ceramic, paper) does the work that colour would do in a busier interior.",
        },
    ],
    "japandi-bedroom": [
        {
            question: "Does a Japandi bedroom need a low platform bed?",
            answer: "A low frame is characteristic but not mandatory. What matters is that the bed reads as a single quiet horizontal mass rather than as furniture with legs and visible under-bed storage. A standard-height frame in solid pale timber with a plain slatted or upholstered headboard achieves the same effect. If you keep a higher frame, the space beneath it has to stay genuinely empty.",
        },
        {
            question: "What bedding suits a Japandi bedroom?",
            answer: "Washed or stonewashed linen in undyed, oatmeal, warm white, or clay. Linen is the right choice specifically because it creases — that soft irregularity is the texture the style needs, and pressed cotton percale looks too crisp against natural timber. Keep the pillow count low; the stacked-cushion arrangement common in other styles works directly against the room's calm.",
        },
        {
            question: "How do I light a Japandi bedroom?",
            answer: "Wall-mounted or pendant reading lights either side of the bed instead of table lamps, so the nightstand surfaces stay clear, plus a single warm ambient source (a paper shade or a low-output ceiling fitting) at around 2700K. Avoid a bright central downlight as the only fixture. Dimmability matters more than fixture count, because the room's character changes entirely between daytime and evening light levels.",
        },
    ],
    "mediterranean-living-room": [
        {
            question: "Can I get a Mediterranean living room without structural work?",
            answer: "Yes. The three highest-impact changes are all surface-level: a lime-wash or textured mineral paint in place of flat emulsion, a warm terracotta-and-cream palette in place of cool greys, and a large flat-woven kilim over the existing floor. Beams and arched openings are the expensive part of the style and are not required for the room to read correctly.",
        },
        {
            question: "What lighting suits a Mediterranean living room?",
            answer: "Wall sconces in wrought iron, plaster, or ceramic positioned at roughly eye height and fitted with warm 2200-2700K lamps, plus table lamps — not a bright central pendant. The style comes from a domestic tradition built around evening light, so the room should be lit in pools rather than uniformly. Dimmers matter here more than in most styles.",
        },
        {
            question: "What plants belong in a Mediterranean living room?",
            answer: "Olive, fig, citrus, and rosemary in unglazed terracotta pots are the authentic choices, and all four need a genuinely bright position — olive in particular thins out and drops leaves in a shaded corner. If the room's light will not support them, a large rubber plant or fiddle-leaf fig in the same terracotta pot keeps the material logic without the maintenance failure.",
        },
    ],
    "art-deco-sunroom": [
        {
            question: "Does velvet upholstery survive in a sunroom?",
            answer: "Not well in direct sun — cotton and silk velvets fade noticeably within a couple of summers in a heavily glazed room. Polyester and solution-dyed velvets hold colour far better and are now available in the deep jewel tones the style needs. The alternative is to position upholstered pieces out of the direct sun path and let harder materials (lacquer, glass, brass, tile) take the exposed positions.",
        },
        {
            question: "What flooring suits an Art Deco sunroom?",
            answer: "Geometric tile is the natural choice: a black-and-white chequer, a chevron, or a hexagonal repeat in porcelain or encaustic cement. Tile also handles the temperature swings and occasional damp of a glazed room better than engineered timber. Keep the pattern to the floor and let the walls stay plain, otherwise the room becomes visually exhausting in bright light.",
        },
        {
            question: "How do I stop an Art Deco sunroom overheating?",
            answer: "The period's own answer works well: large potted palms positioned to filter the strongest direct light, plus full-height curtains in a heavy fabric drawn across the worst-exposed glazing in the afternoon. Practically, solar-control glass or an external blind on the south or west elevation does most of the work; internal blinds alone stop glare but not heat.",
        },
    ],
    "coastal-bedroom": [
        {
            question: "What is the right blue for a coastal bedroom?",
            answer: "Soft, greyed, and desaturated — a chalky sea-blue, a pale duck-egg, or a muted sage — rather than a saturated navy or a bright sky blue. Test it on the wall that gets least daylight, because coastal blues shift dramatically with light and a shade that looks calm in a bright showroom often reads cold and grey in a north-facing bedroom.",
        },
        {
            question: "What headboard works in a coastal bedroom?",
            answer: "Rattan, cane, whitewashed or limed timber, or a loose linen slipcover in a natural tone. All four contribute the woven or grained texture the style depends on, and all avoid the heaviness of a buttoned velvet or leather headboard. If you already have an upholstered headboard, a washed-linen cover is the cheapest way to bring it into the palette.",
        },
        {
            question: "How do I stop a coastal bedroom feeling cold?",
            answer: "Layer warm materials against the pale palette: a jute or wool rug underfoot, linen curtains that reach the floor, a knitted or waffle throw across the bed, and 2700K lamps rather than cool white. The style's failure mode is a room that reads bare and slightly clinical, and it is almost always caused by too few textiles rather than by the wrong wall colour.",
        },
    ],
    "coastal-walk-in-closet": [
        {
            question: "How much space does a walk-in closet actually need?",
            answer: "A single-sided walk-in needs roughly 1.7m of width — about 60cm for hanging depth plus 1.1m of clear circulation. A double-sided run needs about 2.4m. Below those figures you cannot pull a drawer or a hanging rail out fully while standing in front of it, and the room stops working regardless of how well it is finished.",
        },
        {
            question: "What lighting does a walk-in closet need?",
            answer: "Daylight-balanced light at around 4000K positioned so it falls on you rather than only on the rails — otherwise every colour judgement made in the room is wrong. A ceiling fitting plus LED strips inside the hanging sections is the standard arrangement. A full-length mirror sited to catch the room's strongest light source roughly doubles the effective brightness and is the most useful fitting in the space.",
        },
        {
            question: "What makes a walk-in closet coastal rather than generic?",
            answer: "White Shaker-profile joinery with rope-pull or brushed nickel hardware, woven seagrass or rattan baskets in place of moulded plastic drawer inserts, a pale timber or marble-topped island, and a jute runner underfoot. The style is essentially a material substitution over a standard closet layout, which makes it one of the cheapest rooms in which to execute the aesthetic properly.",
        },
    ],
    "farmhouse-bedroom": [
        {
            question: "What bed frame suits a farmhouse bedroom?",
            answer: "Solid timber in oak, pine, or reclaimed boards, or a simple wrought-iron frame — both read correctly because both were genuinely used in the settings the style references. Avoid heavily distressed factory finishes: artificial wear is the most common tell that a farmhouse room was bought rather than assembled, and an honest plain frame ages into the look on its own.",
        },
        {
            question: "What colours work in a farmhouse bedroom?",
            answer: "Warm whites, oatmeal, soft clay, muted sage, and dusty blue, with timber and wrought iron supplying the darker tones. The palette should feel slightly aged rather than crisp — a warm white with a hint of yellow rather than a cool brilliant white. Strong accent colours belong in a quilt or a rug rather than on the walls.",
        },
        {
            question: "Is farmhouse a practical style for a family bedroom?",
            answer: "Unusually so. The style is built around materials that improve, or at least remain acceptable, as they wear — solid timber that can be sanded, painted furniture where chips read as character, quilts and rag rugs that wash. That tolerance for imperfection makes it more forgiving of children and pets than styles where a single scratch on a lacquered surface is permanently visible.",
        },
    ],
    "farmhouse-bathroom": [
        {
            question: "Is shiplap a problem in a bathroom?",
            answer: "It can be, because horizontal joints trap moisture and softwood moves with humidity. If you want the look, use a moisture-resistant MDF or PVC shiplap panel rather than solid timber, keep it out of the direct shower spray zone, and seal the top edge and every cut end. Extraction matters more than panel material — an undersized fan will fail any timber-clad bathroom regardless of finish.",
        },
        {
            question: "What flooring suits a farmhouse bathroom?",
            answer: "Hexagonal or small-square porcelain in white or warm grey with a contrasting grout, or a large-format stone-effect porcelain. Both give the period reference without the maintenance of real stone. Genuine timber floors suit the style visually but are the wrong choice next to a bath or shower unless the room has exceptional ventilation and the boards are properly finished.",
        },
        {
            question: "Do I need a clawfoot bath for a farmhouse bathroom?",
            answer: "No, though it is the fastest single route to the look. A freestanding bath in any simple profile achieves most of the effect, and a standard built-in bath with a tongue-and-groove panel front works well in a smaller room. Note that clawfoot baths need floor- or wall-mounted taps and a floor structure rated for the filled weight, which is often what rules them out.",
        },
    ],
    "farmhouse-dining-room": [
        {
            question: "How long should a farmhouse dining table be?",
            answer: "Allow roughly 60cm of table edge per person, plus 90-100cm of clear circulation on every side you intend to walk around. A table seating eight is therefore around 2.0-2.2m long and needs a room around 3.8-4.0m in the same direction. The style's characteristic long table is often what fails in an average room, so the dimension check is worth doing before ordering.",
        },
        {
            question: "Should farmhouse dining chairs match?",
            answer: "No — mismatched chairs are central to the style, because the room is meant to read as assembled over time. The reliable way to do it without looking accidental is to hold one variable constant: all timber, or all painted the same colour, or all roughly the same seat and back height, while the shapes vary. Two matching carvers at the ends anchor the arrangement.",
        },
        {
            question: "How should a farmhouse dining table be finished?",
            answer: "Oiled or waxed rather than lacquered. An oiled top marks and stains and can be sanded and re-oiled by hand; a lacquered top resists marks until it scratches, after which the whole surface needs professional refinishing. Since the style explicitly values visible use, the oiled finish is both more authentic and more repairable.",
        },
    ],
    "farmhouse-gaming-room": [
        {
            question: "How do I hide gaming equipment in a farmhouse room?",
            answer: "A barn-door or shaker-fronted media cabinet with a ventilated back panel handles consoles and AV kit, and a cable channel behind reclaimed timber panelling handles the rest. The one thing that cannot be hidden is the screen, so treat it as the room's dark focal point and balance it with warm timber and textiles on the surrounding walls rather than trying to conceal it.",
        },
        {
            question: "Does RGB lighting work in a farmhouse gaming room?",
            answer: "Sparingly, and warm. The style's palette is built on 2200-2700K filament light, so saturated blue and purple bias lighting fights it directly. Amber and warm-white bias lighting behind the screen gives the same eye-strain benefit without breaking the room. If you want colour, confine it to peripherals rather than to the room's architecture.",
        },
        {
            question: "What seating suits a farmhouse gaming room?",
            answer: "A deep leather Chesterfield or an oversized linen sofa rather than a moulded racing-style gaming chair, which is the single element most likely to break the aesthetic. If you need proper ergonomic support for long desk sessions, a timber-framed task chair with a leather or wool seat achieves it without the automotive styling.",
        },
    ],
    "farmhouse-home-theater": [
        {
            question: "Can a farmhouse home theatre actually perform acoustically?",
            answer: "Yes, because most acoustic treatment can be concealed. Fabric-wrapped absorption panels fit behind tongue-and-groove cladding, heavy lined curtains handle first reflections at the side walls, and a large wool rug controls floor bounce. The style's natural preference for textiles, timber, and soft furnishings is acoustically helpful — it is hard rooms full of plaster and glass that need the most intervention.",
        },
        {
            question: "How do I control light in a farmhouse home theatre?",
            answer: "Full-height lined linen or wool curtains on a timber pole, plus dimmable filament sconces at low level rather than ceiling downlights. Matte finishes matter: a limewashed or chalk-paint wall behind the screen reflects far less stray light than a satin emulsion, which noticeably improves perceived contrast without any change to the projector.",
        },
        {
            question: "Should the screen be hidden when not in use?",
            answer: "It depends on whether the room does anything else. If it doubles as a family room during the day, a sliding barn-door panel or a drop-down screen behind a beam keeps the room domestic. If it is a dedicated cinema, concealment is unnecessary complexity and the budget is better spent on seating and acoustic treatment.",
        },
    ],
    "japandi-mudroom": [
        {
            question: "How much shoe storage does a mudroom actually need?",
            answer: "Plan for roughly 30cm of shelf width and 20cm of height per pair, then add about 50% over your current count — mudroom storage sized exactly to today's requirement fills immediately, and the overflow ends up on the floor, which is what the room exists to prevent. Closed storage matters more than raw capacity in a Japandi execution, because visible shoe racks defeat the style entirely.",
        },
        {
            question: "What flooring suits a Japandi mudroom?",
            answer: "Large-format porcelain in a slate or limestone effect, or honed natural stone. Both handle grit, water, and salt, and both give the quiet matte surface the style needs. Timber and timber-effect laminate are the wrong choice here regardless of aesthetic preference, because a mudroom floor is wet several months a year by definition.",
        },
        {
            question: "What makes a mudroom Japandi rather than just built-in storage?",
            answer: "Handle-free push-to-open fronts in oak or oak veneer rather than painted MDF with visible knobs, a low timber bench with a single linen cushion instead of a moulded seat, blackened steel or brass hooks in a straight run at a consistent height, and a strictly limited palette. The layout is conventional; the style comes entirely from finish, hardware, and the discipline of keeping horizontal surfaces clear.",
        },
    ],
    "modern-sunroom": [
        {
            question: "How do I stop a modern sunroom overheating in summer?",
            answer: "Glazing specification does most of the work: a low-g solar-control unit rejects a large share of solar gain before it enters the room, which internal blinds cannot do once the heat is inside. Beyond that, external blinds or a brise-soleil on the south and west elevations, plus openable rooflights to vent hot air at high level, are far more effective than any amount of internal shading.",
        },
        {
            question: "What furniture suits a modern sunroom?",
            answer: "Low-profile pieces in a single neutral — linen, boucle, or an outdoor-grade performance weave — with slim legs that keep sightlines to the glass open. The style depends on fewer, larger items rather than a scattered arrangement, because the view does most of the visual work and clutter in the foreground competes with it directly. UV-stable fabrics matter here more than in any other room.",
        },
        {
            question: "Should sunroom flooring match the adjoining room?",
            answer: "Yes, where the structure allows it. Running a single flooring material continuously through the threshold is one of the defining moves of modern design and it makes both rooms read as larger. Porcelain that continues onto an external terrace in a matching outdoor-rated finish extends the effect further, which is worth specifying at the same time even if the terrace is a later project.",
        },
    ],
    "modern-home-theater": [
        {
            question: "What wall colour should a modern home theatre be?",
            answer: "A deep, matte neutral — charcoal, graphite, or a very dark warm grey — on every surface within the viewer's field of vision, particularly the wall behind the screen. Sheen matters most: a matte finish at the same colour measurably improves perceived contrast over a satin one, because it stops light from the screen bouncing back onto it.",
        },
        {
            question: "How do I integrate acoustic panels into a modern home theatre?",
            answer: "Recess them so they sit flush with the surrounding wall plane and wrap them in a single fabric matching the wall colour, rather than mounting proprietary panels proud of the surface. This preserves the continuous, uninterrupted wall the style depends on while still handling first reflections. A fabric-stretch wall system does the same job across an entire wall if the budget allows.",
        },
        {
            question: "How far should seating be from the screen?",
            answer: "For a 4K display, roughly 1 to 1.5 times the screen's diagonal gives a cinema-like field of view without visible pixel structure — about 2.7-4.0m for a 100-inch screen. Set the seating distance first and size the screen to it rather than the reverse, because the room's dimensions are fixed and the display is not.",
        },
    ],
};

// Generate all 196 page configs (14 themes × 14 rooms)
// Title variants rotated deterministically per slug to diversify SERP listings.
// Every variant front-loads the exact "{Theme} {Room}" query phrase, because the
// SERP only ever shows the first ~55 characters and that phrase is what the
// searcher typed. The tail carries the one thing the nine results above us
// cannot offer: these ideas rendered on the searcher's own room, not a showroom.
const TITLE_TEMPLATES = [
    (themeName: string, roomName: string) =>
        `${themeName} ${roomName} Ideas — See Them In Your Own Room`,
    (themeName: string, roomName: string) =>
        `${themeName} ${roomName} Ideas: Preview Them In Your Room`,
    (themeName: string, roomName: string) =>
        `${themeName} ${roomName} Design — Try It On Your Own Photo`,
    (themeName: string, roomName: string) =>
        `${themeName} ${roomName} Ideas — Test On Your Room in 60s`,
] as const;

// Meta description variants. These are promises, not summaries: each one leads
// with the query phrase (so Google bolds it), states the single action required,
// and closes on a risk reducer. Applied to every design page — the previous
// behaviour of deriving the description from the article's first sentence
// produced encyclopedic openers that gave nobody a reason to click.
const META_TEMPLATES = [
    (themeName: string, roomName: string) =>
        `${themeName} ${roomName} ideas, applied to your own room. Upload one photo and AI returns 4–8 redesigns in 60 seconds. From €9.99, no subscription.`,
    (themeName: string, roomName: string) =>
        `${themeName} ${roomName} ideas you can test on your actual room, not someone else's. Upload a photo, get 4–8 AI redesigns in 60 seconds. 1 free credit.`,
    (themeName: string, roomName: string) =>
        `${themeName} ${roomName} design, tried on your own space before you spend a euro on furniture. Upload one photo, get 4–8 AI redesigns in 60 seconds.`,
    (themeName: string, roomName: string) =>
        `${themeName} ${roomName} ideas rendered on your own photo, not a showroom. AI returns 4–8 redesigns in 60 seconds. Photos never stored, 1 free credit.`,
] as const;

const META_DESCRIPTION_MAX_LENGTH = 158;
const META_DESCRIPTION_TRUNCATE_AT = 155;

// Deterministic (no Math.random / Date) char-code sum hash so variant
// assignment is stable across builds — important for SEO consistency.
function hashToIndex(str: string, modulo: number): number {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }
    return sum % modulo;
}

// Safety net for the longest theme+room combinations (e.g. "Mediterranean
// Walk-In Closet"). Templates are written to sit comfortably under the limit;
// this only ever fires on outlier combos.
function clampDescription(description: string): string {
    if (description.length <= META_DESCRIPTION_MAX_LENGTH) {
        return description;
    }

    const truncated = description.slice(0, META_DESCRIPTION_TRUNCATE_AT);
    const lastSpace = truncated.lastIndexOf(" ");
    const cut = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
    return `${cut}...`;
}

/**
 * Bespoke depth for the pages with measured demand and no ranking.
 *
 * Selection is driven by Search Console, not by taste:
 *   - art-deco-bedroom:        415 impressions, 0 clicks, position 18.9
 *   - scandinavian-living-room: 215 impressions, 0 clicks, position 14.7
 *
 * Both sit on a query cluster the template content does not answer. The
 * "what the AI gets wrong" sections are deliberately the opposite of listicle
 * filler — they are the one thing a tool operator can write that a decorating
 * blog cannot.
 */
export const COMBINATION_DEEP_DIVES: Record<string, IDeepDiveSection[]> = {
    "art-deco-bedroom": [
        {
            heading: "Art Deco bedroom ideas, element by element",
            paragraphs: [
                "Art Deco is a vocabulary of specific shapes and materials rather than a general mood, which is why it is one of the easier styles to get 80% right and one of the harder styles to get the last 20% right. The elements below are the ones that actually carry the style. A bedroom that has three of them reads unmistakably Art Deco; a bedroom that has nine of them reads like a themed hotel suite.",
            ],
            bullets: [
                "Headboard — the single highest-impact element. A tall upholstered panel in channel tufting, a fan silhouette, or a stepped ziggurat outline, in velvet or a tight-weave bouclé. Emerald, sapphire, oxblood and dusty rose are the period-correct jewel tones; charcoal and camel are the safe contemporary substitutes.",
                "Geometry — fans, sunbursts, chevrons, stepped forms and concentric circles. Introduce it in exactly one repeated motif rather than three competing ones. A single sunburst mirror above a chest of drawers does more for the room than patterned wallpaper plus a geometric rug plus a chevron throw.",
                "Metals — brass and polished chrome, not brushed nickel and not matte black. Art Deco predates the matte-black hardware convention entirely, and matte black is the fastest way to make a Deco bedroom read as generic contemporary.",
                "Lacquer and high-gloss timber — ebonised walnut, black lacquered bedside tables, or a burl-veneer chest. The reflective surface is doing the same job the metals are: bouncing light in a palette that is otherwise quite dark.",
                "Lighting — a tiered or fluted pendant with frosted glass, plus wall sconces flanking the bed rather than table lamps. Sconces are the detail that most contemporary Deco bedrooms skip, and their absence is why those rooms look like a Deco headboard in an ordinary bedroom.",
                "Flooring and rugs — dark stained timber or parquet, with a low-pile rug carrying one geometric motif. Avoid layering a second patterned textile on top.",
            ],
        },
        {
            heading: "Modern Art Deco vs 1920s Art Deco: which one are you actually after?",
            paragraphs: [
                "Most people searching for an Art Deco bedroom want the modern interpretation, not a period reconstruction, and the difference matters because it changes almost every decision downstream. A period-accurate 1920s bedroom uses saturated colour across the whole envelope — patterned wallpaper, dark ceilings, heavily figured veneers — and a lot of ornament per square metre. It photographs beautifully and is genuinely difficult to sleep in.",
                "The modern interpretation keeps the geometry and the metals but strips the ornament density back by roughly two thirds. Walls go to a warm off-white, greige, or a single deep accent behind the bed only. Pattern is confined to one surface. The jewel tones survive but move onto the headboard and one or two cushions rather than onto the walls. This is also the version that resells: a channel-tufted emerald headboard against a neutral wall reads as considered in almost any house, while a fully committed 1920s envelope reads as a decision the next owner has to undo.",
                "If your search was for a minimalist or simple Art Deco bedroom, you are describing the modern interpretation with the ornament dialled back further still — one geometric motif, brass hardware, a lacquered surface, and nothing else. That version is easier to live with and much cheaper to execute.",
            ],
        },
        {
            heading: "What an Art Deco bedroom actually costs to execute",
            paragraphs: [
                "The costs below are indicative mid-market European figures for a standard double bedroom, and exist to show where the money concentrates rather than to be quoted. The headboard and the lighting account for most of the effect and most of the spend; the geometry can be introduced for very little.",
            ],
            table: {
                headers: ["Element", "Indicative cost", "Impact on the style"],
                rows: [
                    ["Upholstered velvet headboard (king)", "€350–€900", "Highest — this is the element people read first"],
                    ["Pair of brass wall sconces", "€120–€400", "High — the detail most contemporary versions omit"],
                    ["Tiered / fluted pendant light", "€150–€500", "High"],
                    ["Sunburst or fan mirror", "€80–€300", "Medium-high — cheapest way to introduce the geometry"],
                    ["Lacquered or burl-veneer bedside pair", "€300–€1,200", "Medium"],
                    ["Low-pile geometric rug", "€150–€600", "Medium"],
                    ["Accent wall paint (deep tone)", "€40–€90", "Medium — highest impact per euro spent"],
                    ["Velvet cushions and throw", "€60–€200", "Low-medium"],
                ],
            },
        },
        {
            heading: "Art Deco in a small bedroom",
            paragraphs: [
                "The style is usually shown in large rooms with high ceilings, which is misleading — Art Deco was designed for ocean liner cabins and apartment blocks as much as for ballrooms, and it compresses well if you change the ratios rather than the vocabulary.",
                "In a room under about 12 square metres: keep the tall headboard, because vertical emphasis makes a small room read taller, but drop the freestanding furniture to wall-mounted bedside shelves. Move the geometry onto the mirror and the hardware only, and leave the walls plain in a warm off-white so the dark tones do not close the space in. Replace the pendant with two sconces, which free up the ceiling plane entirely. The result keeps the sunburst-and-brass signature while removing the three things that make Deco feel heavy: floor-standing case goods, patterned walls, and a large light fitting.",
            ],
        },
        {
            heading: "What AI gets wrong on Art Deco bedrooms — and how to prompt around it",
            paragraphs: [
                "This is worth saying plainly because we run the generations. Art Deco is the style where AI image models most reliably overshoot, and knowing the failure modes in advance is the difference between one usable output and five wasted attempts.",
                "The three consistent failures: the model adds metallic surfaces to everything it can find, so a request for brass hardware comes back with a brass bed frame, brass skirting, and a brass ceiling trim; it defaults to full-envelope 1920s ornament when you asked for the modern interpretation; and it converts geometric motifs into wallpaper, which is almost never what a contemporary Deco bedroom should have.",
                "The fix is to specify what should stay plain, not only what should change. Prompts that name the restraint — \"Art Deco bedroom, channel-tufted emerald velvet headboard, brass wall sconces, plain warm off-white walls, no patterned wallpaper, dark timber floor\" — produce a usable first result far more often than \"Art Deco bedroom\" on its own. Naming the metal once, and stating that walls stay unpatterned, removes both of the dominant failure modes in a single sentence. Because Magic Room preserves the existing room geometry rather than regenerating the space, what you get back is your actual bedroom with those specific changes applied, which makes it a planning reference rather than a mood board.",
            ],
        },
    ],
    "scandinavian-living-room": [
        {
            heading: "What separates a Scandinavian living room from a generally minimal one",
            paragraphs: [
                "The two styles get conflated constantly, and the confusion produces rooms that are merely empty. Minimalism is a subtraction discipline: the goal is fewer objects. Scandinavian design is a warmth-under-constraint discipline that emerged from a specific problem — long, dark winters and small urban apartments — and its rules exist to solve that problem rather than to achieve visual purity.",
                "The practical consequence is that a Scandinavian living room is allowed, and in fact required, to have soft things in it. Wool throws, sheepskin, layered textiles and visible timber grain are not decoration added on top of a minimal room; they are the point. A room with white walls, a grey sofa and nothing else is minimal. Add pale oak, a wool throw, two plants and a warm-toned pendant and it becomes Scandinavian.",
            ],
            bullets: [
                "Light woods with visible grain — pale oak, ash, birch, pine. Walnut and wenge push the room toward mid-century modern instead.",
                "Walls in warm white rather than cool white. Cool white plus grey furniture is the single most common way a Scandinavian living room ends up feeling clinical.",
                "Layered lighting at multiple heights — a pendant, a floor lamp, and at least one low light source. Scandinavian interiors almost never rely on a single ceiling fixture.",
                "Natural-fibre textiles: wool, linen, cotton, sheepskin. The tactile contrast against hard timber surfaces is doing most of the warmth work.",
                "Two to four plants at different heights. Enough to add living texture, not enough to read as bohemian.",
                "One muted accent colour at most — dusty blue, sage, terracotta or mustard, used across two or three small items.",
            ],
        },
        {
            heading: "Scandinavian living room ideas by room size",
            paragraphs: [
                "The style scales in a specific direction: the smaller the room, the more strictly the palette has to hold, and the more the warmth has to come from texture rather than from objects.",
                "In a small living room (under 15 m²) choose a sofa with visible legs so floor shows underneath, keep the rug large enough to sit under the front legs of the furniture rather than floating in the middle, and use wall-mounted shelving instead of a freestanding unit. Wall colour stays warm white throughout — an accent wall in a small Scandinavian room fights the light-maximising logic that the style is built on.",
                "In a larger room the risk inverts: the space becomes sparse and cold rather than cosy. The remedy is zoning rather than adding objects — a rug that defines the seating group, a reading chair with its own floor lamp in a corner, and a second textile layer on the sofa. A large Scandinavian living room needs more textile mass than a small one, not more furniture.",
            ],
        },
        {
            heading: "What AI gets wrong on Scandinavian living rooms",
            paragraphs: [
                "The dominant failure mode is that the model reads \"Scandinavian\" as \"white and grey minimal\" and strips out exactly the warmth that distinguishes the style. Outputs come back with a cool-white envelope, a grey sofa, no visible timber grain and no textiles — technically clean, and indistinguishable from a stock minimal render.",
                "The second failure is wood tone. Left unspecified, models default to a mid-brown that reads as generic contemporary rather than the pale oak or ash the style depends on.",
                "Naming the warmth explicitly fixes both. A prompt like \"Scandinavian living room, warm white walls, pale oak flooring and furniture, wool throw and linen cushions, layered lighting with floor lamp, two plants\" reliably produces the correct register on the first attempt, where \"Scandinavian living room\" alone does not. Specifying the wood species and the wall temperature is worth more than any other instruction you can add.",
            ],
        },
    ],
};

function generateDesignPages(): IDesignPageData[] {
    const pages: IDesignPageData[] = [];

    const themeKeys = Object.keys(THEME_DATA);
    const roomKeys = Object.keys(ROOM_DATA);

    for (const theme of themeKeys) {
        for (const roomType of roomKeys) {
            const themeData = THEME_DATA[theme];
            const roomData = ROOM_DATA[roomType];
            const slug = `${themeData.slug}-${roomData.slug}`;

            const variantIndex = hashToIndex(slug, TITLE_TEMPLATES.length);
            const title = TITLE_TEMPLATES[variantIndex](themeData.name, roomData.name);

            const combinationIntro = COMBINATION_INTROS[slug];
            // The intro's first sentence is deliberately NOT used as the meta
            // description any more. It reads as an encyclopedia entry
            // ("A Scandinavian living room earns its warmth through...") which
            // is indistinguishable from the Houzz/Pinterest results above us
            // and gave searchers no reason to choose this result.
            const metaDescription = clampDescription(
                META_TEMPLATES[variantIndex](themeData.name, roomData.name)
            );

            pages.push({
                slug,
                theme,
                roomType,
                themeName: themeData.name,
                roomName: roomData.name,
                title,
                metaDescription,
                intro: combinationIntro ?? `Generate ${themeData.name.toLowerCase()} ${roomData.name.toLowerCase()} design ideas instantly with AI.`,
                faqs: COMBINATION_FAQS[slug] ?? [],
                deepDive: COMBINATION_DEEP_DIVES[slug],
                keywords: [
                    ...themeData.keywords,
                    ...roomData.keywords,
                    `${themeData.name.toLowerCase()} ${roomData.name.toLowerCase()} design`,
                    `${themeData.name.toLowerCase()} ${roomData.name.toLowerCase()} ideas`,
                    `${themeData.name.toLowerCase()} ${roomData.name.toLowerCase()} AI`,
                ],
            });
        }
    }

    return pages;
}

export const DESIGN_PAGES: IDesignPageData[] = generateDesignPages();

const DESIGN_PAGE_BY_SLUG: Record<string, IDesignPageData> = Object.fromEntries(
    DESIGN_PAGES.map((p) => [p.slug, p])
);

export function getDesignPageBySlug(slug: string): IDesignPageData | undefined {
    return DESIGN_PAGE_BY_SLUG[slug];
}

export function getAllDesignSlugs(): string[] {
    return DESIGN_PAGES.map((p) => p.slug);
}

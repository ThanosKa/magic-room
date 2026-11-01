import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GenerateContent from "@/components/generate-content";
import { useUserStore } from "@/stores/user-store";
import { useGenerationStore } from "@/stores/generation-store";

/**
 * The design tool as a signed-in user sees it. Clerk, the URL and the network
 * are the outside world here; everything else is the real screen.
 */

let search = "";
const signOut = vi.fn();

vi.mock("@clerk/nextjs", () => ({
    useUser: () => ({ isLoaded: true, isSignedIn: true, user: { id: "clerk_user_123" } }),
    useClerk: () => ({ signOut }),
    RedirectToSignIn: () => null,
}));

vi.mock("next/navigation", () => ({
    useSearchParams: () => new URLSearchParams(search),
}));

let container: HTMLDivElement;
let root: Root;

function render() {
    act(() => {
        root.render(<GenerateContent />);
    });
}

/** The radio (or checkbox) whose visible label is exactly `text`, within a group. */
function option(group: string, text: string): HTMLInputElement {
    const fieldset = groupNamed(group);
    const label = Array.from(fieldset.querySelectorAll("label")).find(
        (l) => l.textContent?.trim().startsWith(text)
    );
    if (!label) throw new Error(`No option "${text}" in "${group}"`);
    return label.querySelector("input") as HTMLInputElement;
}

function groupNamed(name: string): HTMLFieldSetElement {
    const fieldset = Array.from(container.querySelectorAll("fieldset")).find((f) =>
        f.querySelector("legend")?.textContent?.includes(name)
    );
    if (!fieldset) throw new Error(`No group "${name}"`);
    return fieldset;
}

/** The room type control: one compact select in the panel. */
function roomSelect(): HTMLSelectElement {
    const select = container.querySelector("select#generate-room") as HTMLSelectElement | null;
    if (!select) throw new Error("No room type select");
    return select;
}

function chooseRoom(text: string) {
    const select = roomSelect();
    const choice = Array.from(select.options).find((o) => o.textContent === text);
    if (!choice) throw new Error(`No room type "${text}"`);
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")!.set!;
    act(() => {
        setter.call(select, choice.value);
        select.dispatchEvent(new Event("change", { bubbles: true }));
    });
}

function checkedRoom(): string {
    return roomSelect().selectedOptions[0]?.textContent ?? "";
}

function checkedLabel(group: string): string {
    const input = groupNamed(group).querySelector("input:checked");
    return input?.closest("label")?.textContent?.trim() ?? "";
}

function stepHeadings(): string[] {
    return Array.from(container.querySelectorAll("h2, legend, label[for]")).map((h) => h.textContent?.trim() ?? "");
}


/** Waits (inside act) until `check` stops throwing. */
async function waitFor(check: () => void, timeout = 1000) {
    const start = Date.now();
    for (;;) {
        try {
            check();
            return;
        } catch (error) {
            if (Date.now() - start > timeout) throw error;
            await act(() => new Promise((r) => setTimeout(r, 10)));
        }
    }
}

// jsdom never decodes images: this one "loads" as a 1200 x 900 photo.
class LoadedImage {
    width = 1200;
    height = 900;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    private _src = "";
    get src() {
        return this._src;
    }
    set src(value: string) {
        this._src = value;
        setTimeout(() => this.onload?.(), 0);
    }
}

/** Picks `file` in the photo step's file picker. */
async function chooseFile(file: File) {
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, "files", { value: [file], configurable: true });
    await act(async () => {
        input.dispatchEvent(new Event("change", { bubbles: true }));
    });
}

async function uploadPhoto() {
    await chooseFile(new File([new Uint8Array([137, 80, 78, 71])], "room.png", { type: "image/png" }));
    await waitFor(() => expect(container.querySelector('img[alt="Your room"]')).not.toBeNull());
}

function button(name: string): HTMLButtonElement {
    const found = Array.from(container.querySelectorAll("button")).find((b) => b.textContent?.trim() === name);
    if (!found) throw new Error(`No button "${name}"`);
    return found;
}

/** The control panel beside the photo (a bottom sheet on phones): every choice, then the message slot and Generate. */
function panel(): HTMLElement {
    const found = container.querySelector("[data-control-panel]") as HTMLElement | null;
    if (!found) throw new Error("No control panel");
    return found;
}

/** The part of the panel that scrolls (and, on a phone, folds away): the choices. */
function panelBody(): HTMLElement {
    return panel().querySelector("[data-panel-body]") as HTMLElement;
}

/** The part of the panel that always stays on screen: the message slot and Generate. */
function panelFooter(): HTMLElement {
    return panel().querySelector("[data-panel-footer]") as HTMLElement;
}

/** On a phone: the summary row that opens and closes the sheet. */
function sheetToggle(): HTMLButtonElement {
    const found = panel().querySelector(`button[aria-controls="${panelBody().id}"]`) as HTMLButtonElement | null;
    if (!found) throw new Error("No sheet toggle");
    return found;
}

/** The main button (Generate, Generating…, Regenerate): the one the message slot describes. */
function generateButton(): HTMLButtonElement {
    const found = container.querySelector('button[aria-describedby="generate-message"]') as HTMLButtonElement | null;
    if (!found) throw new Error("No Generate button");
    return found;
}

/** Opens the note field in the panel. */
function openNote(): HTMLTextAreaElement {
    if (!container.querySelector("textarea")) click(button("Add a note"));
    const note = container.querySelector("textarea");
    if (!note) throw new Error("The note did not open");
    return note;
}

/** The message shown above the Generate button. */
function message(): HTMLElement {
    return container.querySelector("#generate-message") as HTMLElement;
}

function click(el: Element) {
    act(() => {
        (el as HTMLElement).click();
    });
}

function type(el: HTMLTextAreaElement, value: string) {
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!;
    act(() => {
        setter.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
    });
}

// The uploaded file's bytes (a PNG signature) and what the API sends back.
const PHOTO = "data:image/png;base64,iVBORw==";
const RESULT = "data:image/png;base64,UkVTVUxU";

/** The network: /api/generate answers when `finish()` is called; /api/user reports 4 credits left. */
function stubNetwork() {
    const requests: { url: string; body?: Record<string, unknown> }[] = [];
    let finish: () => void = () => {};
    vi.stubGlobal("fetch", (url: string, init?: RequestInit) => {
        requests.push({ url, body: init?.body ? JSON.parse(String(init.body)) : undefined });
        if (url === "/api/generate") {
            return new Promise((resolve) => {
                finish = () =>
                    resolve(
                        new Response(
                            JSON.stringify({ success: true, predictionId: "gen_1", outputUrls: [RESULT] }),
                            { status: 200 }
                        )
                    );
            });
        }
        if (url.startsWith("/api/user")) {
            return Promise.resolve(new Response(JSON.stringify({ user: { id: "u1", credits: 4 } }), { status: 200 }));
        }
        return Promise.reject(new Error(`Unexpected request ${url}`));
    });
    return { requests, finish: () => act(async () => finish()) };
}

beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    search = "";
    // jsdom has no matchMedia: the screen asks it about reduced motion.
    vi.stubGlobal("matchMedia", (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
    }));
    vi.stubGlobal("Image", LoadedImage);
    URL.createObjectURL = () => "blob:room";
    URL.revokeObjectURL = () => {};
    useUserStore.getState().reset();
    useUserStore.getState().setCredits(5);
    useGenerationStore.getState().reset();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
});

describe("Generate tool", () => {
    it("asks for the photo first, then room type and style, with no separate quality step", () => {
        render();

        const steps = stepHeadings();
        const at = (name: string) => steps.findIndex((s) => s.includes(name));
        expect(at("Photo")).toBeGreaterThanOrEqual(0);
        expect(at("Photo")).toBeLessThan(at("Room type"));
        expect(at("Room type")).toBeLessThan(at("Style"));
        expect(container.textContent).not.toContain("Step 4");
    });

    it("keeps every choice in one panel, with the message slot and Generate pinned to its foot", () => {
        render();

        expect(container.querySelector("[data-action-bar]")).toBeNull();
        const body = panelBody();
        const parts = [roomSelect(), groupNamed("Style"), groupNamed("Quality"), button("Add a note")];
        for (const part of parts) expect(body.contains(part)).toBe(true);
        // Top to bottom: room type, style, quality, note.
        for (let i = 1; i < parts.length; i++) {
            expect(parts[i - 1].compareDocumentPosition(parts[i]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        }

        const footer = panelFooter();
        expect(body.contains(footer)).toBe(false);
        expect(footer.contains(message())).toBe(true);
        expect(footer.contains(generateButton())).toBe(true);
        // The message slot comes right before the button.
        const slotThenButton = message().compareDocumentPosition(generateButton()) & Node.DOCUMENT_POSITION_FOLLOWING;
        expect(slotThenButton).toBeTruthy();
        // The photo comes before the panel.
        const photo = container.querySelector("#step-photo")!;
        expect(photo.compareDocumentPosition(panel()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it("on a phone, folds the choices into a sheet that opens from the summary and closes for the wait", async () => {
        stubNetwork();
        search = "style=japandi&room=bedroom";
        render();
        await uploadPhoto();

        const toggle = sheetToggle();
        expect(toggle.textContent).toContain("Bedroom · Japandi · Quick");
        expect(toggle.getAttribute("aria-expanded")).toBe("false");
        expect(panel().dataset.sheet).toBe("collapsed");
        // Collapsed, the summary and Generate stay outside the folding part.
        expect(panelBody().contains(toggle)).toBe(false);
        expect(panelBody().contains(generateButton())).toBe(false);

        click(toggle);
        expect(toggle.getAttribute("aria-expanded")).toBe("true");
        expect(panel().dataset.sheet).toBe("expanded");

        click(toggle);
        expect(panel().dataset.sheet).toBe("collapsed");

        // Generating closes the sheet so the wait shows on the photo.
        click(toggle);
        click(generateButton());
        expect(panel().dataset.sheet).toBe("collapsed");
        expect(toggle.disabled).toBe(false);
    });

    it("closes the open sheet with Escape", () => {
        render();
        click(sheetToggle());

        act(() => {
            panel().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        });
        expect(panel().dataset.sheet).toBe("collapsed");
    });

    it("offers all 14 room types and 14 styles", () => {
        render();

        expect(roomSelect().options).toHaveLength(14);
        expect(groupNamed("Style").querySelectorAll('input[type="radio"]')).toHaveLength(14);
        expect(Array.from(roomSelect().options).map((o) => o.textContent)).toContain("Walk-in Closet");
        expect(option("Style", "Mediterranean")).toBeTruthy();
    });

    it("starts on a living room in the modern style", () => {
        render();

        expect(checkedRoom()).toBe("Living Room");
        expect(checkedLabel("Style")).toContain("Modern");
    });

    it("opens with the style and room type from a design page link already chosen", () => {
        search = "style=japandi&room=bedroom";
        render();

        expect(checkedRoom()).toBe("Bedroom");
        expect(checkedLabel("Style")).toContain("Japandi");
    });

    it("ignores a style or room type it does not offer", () => {
        search = "style=gothic&room=garage";
        render();

        expect(checkedRoom()).toBe("Living Room");
        expect(checkedLabel("Style")).toContain("Modern");
    });

    it("offers Quick, Pro and Ultra, with each one's credit cost on it and on the Generate button", () => {
        render();

        expect(option("Quality", "Quick").closest("label")?.textContent).toContain("1 credit");
        expect(option("Quality", "Pro").closest("label")?.textContent).toContain("2 credits");
        expect(option("Quality", "Ultra").closest("label")?.textContent).toContain("3 credits");
        expect(option("Quality", "Quick").checked).toBe(true);
        expect(generateButton().textContent).toContain("Generate");
        expect(generateButton().textContent).toContain("1 credit");

        click(option("Quality", "Pro"));
        expect(generateButton().textContent).toContain("2 credits");
        click(option("Quality", "Ultra"));
        expect(generateButton().textContent).toContain("3 credits");
    });

    it("sends the chosen quality and tells an Ultra wait it takes about 2 minutes", async () => {
        const network = stubNetwork();
        render();
        await uploadPhoto();
        click(option("Quality", "Ultra"));
        click(generateButton());

        expect(network.requests.find((r) => r.url === "/api/generate")?.body?.quality).toBe("ultra");
        expect(container.textContent).toContain("about 2 minutes");
    });

    it("sums up the chosen room, style and quality in the panel", () => {
        search = "style=japandi&room=bedroom";
        render();

        expect(panel().textContent).toContain("Bedroom · Japandi · Quick");
        click(option("Style", "Coastal"));
        chooseRoom("Kitchen");
        click(option("Quality", "Pro"));
        expect(panel().textContent).toContain("Kitchen · Coastal · Pro");
    });

    it("opens the note in the panel, with a 500 character limit and a counter, keeping Generate in place", () => {
        render();

        expect(container.querySelector("textarea")).toBeNull();
        expect(button("Add a note").getAttribute("aria-expanded")).toBe("false");
        const note = openNote();

        expect(note.maxLength).toBe(500);
        expect(document.activeElement).toBe(note);
        expect(panelBody().contains(note)).toBe(true);
        expect(panelFooter().contains(generateButton())).toBe(true);
        type(note, "green sofa");
        expect(panel().textContent).toContain("10/500");
    });

    it("keeps the note when the field is closed, and says a note is added", () => {
        render();

        type(openNote(), "green sofa");
        click(button("Done"));

        expect(container.querySelector("textarea")).toBeNull();
        expect(button("Edit note").getAttribute("aria-expanded")).toBe("false");
        click(button("Edit note"));
        expect(container.querySelector("textarea")!.value).toBe("green sofa");
    });

    it("keeps the Generate button above the phone keyboard while writing the note", () => {
        // The keyboard covers the bottom 320 px of an 844 px tall screen.
        const viewport = Object.assign(new EventTarget(), { height: 844, offsetTop: 0 });
        vi.stubGlobal("visualViewport", viewport);
        vi.stubGlobal("innerHeight", 844);
        render();
        openNote();

        act(() => {
            viewport.height = 524;
            viewport.dispatchEvent(new Event("resize"));
        });
        expect(panel().style.bottom).toBe("320px");

        act(() => {
            viewport.height = 844;
            viewport.dispatchEvent(new Event("resize"));
        });
        expect(panel().style.bottom).toBe("");
    });
    it("generates from the photo with the chosen room, style, quality and note", async () => {
        const network = stubNetwork();
        render();
        await uploadPhoto();

        chooseRoom("Bedroom");
        click(option("Style", "Japandi"));
        click(option("Quality", "Pro"));
        type(openNote(), "  green sofa, more plants  ");
        click(generateButton());

        const sent = network.requests.find((r) => r.url === "/api/generate")!;
        expect(sent.body).toMatchObject({
            roomType: "bedroom",
            theme: "japandi",
            quality: "premium",
            customPrompt: "green sofa, more plants",
        });
        expect(sent.body!.base64Image).toBe(PHOTO);
    });

    it("sends no note when the note is left empty", async () => {
        const network = stubNetwork();
        render();
        await uploadPhoto();

        type(openNote(), "   ");
        click(generateButton());

        const sent = network.requests.find((r) => r.url === "/api/generate")!;
        expect(sent.body).not.toHaveProperty("customPrompt");
    });

    it("locks the choices and shows the photo with a status line while waiting", async () => {
        stubNetwork();
        render();
        await uploadPhoto();
        openNote();
        click(generateButton());

        expect(container.querySelector('img[alt="Your room"]')).not.toBeNull();
        expect(container.textContent).toContain("Sending your photo");
        expect(option("Style", "Coastal").matches(":disabled")).toBe(true);
        expect(roomSelect().matches(":disabled")).toBe(true);
        expect(option("Quality", "Pro").matches(":disabled")).toBe(true);
        expect(container.querySelector("textarea")!.matches(":disabled")).toBe(true);
        expect(button("Done").matches(":disabled")).toBe(true);
        expect(generateButton().textContent).toContain("Generating…");
        expect(generateButton().disabled).toBe(true);
    });

    it("shows the result next to the original, refreshes the balance and offers to regenerate", async () => {
        const network = stubNetwork();
        render();
        await uploadPhoto();
        click(generateButton());
        await network.finish();

        await waitFor(() => expect(container.querySelector('input[type="range"]')).not.toBeNull());
        const images = Array.from(container.querySelectorAll("[data-compare] img")).map((i) => i.getAttribute("src"));
        expect(images).toEqual(expect.arrayContaining([PHOTO, RESULT]));
        expect(container.textContent).toContain("Before");
        expect(container.textContent).toContain("After");
        expect(button("Download")).toBeTruthy();
        expect(button("Full screen")).toBeTruthy();

        await waitFor(() => expect(useUserStore.getState().credits).toBe(4));
        expect(network.requests.some((r) => r.url.startsWith("/api/user"))).toBe(true);

        // The choices unlock, so the next run can use another style.
        click(option("Style", "Coastal"));
        expect(generateButton().textContent).toContain("Regenerate");
        expect(generateButton().textContent).toContain("1 credit");
        click(generateButton());
        const runs = network.requests.filter((r) => r.url === "/api/generate");
        expect(runs).toHaveLength(2);
        expect(runs[1].body).toMatchObject({ theme: "coastal" });
    });
});

/** /api/generate answers with `answer` (a Response, or a rejection for a network error). */
function stubGenerate(answer: () => Promise<Response>, { creditsAfter = 5 } = {}) {
    const requests: string[] = [];
    vi.stubGlobal("fetch", (url: string) => {
        requests.push(url);
        if (url === "/api/generate") return answer();
        if (url.startsWith("/api/user")) {
            return Promise.resolve(
                new Response(JSON.stringify({ user: { id: "u1", credits: creditsAfter } }), { status: 200 })
            );
        }
        return Promise.reject(new Error(`Unexpected request ${url}`));
    });
    return { requests };
}

function json(status: number, body: unknown) {
    return () => Promise.resolve(new Response(JSON.stringify(body), { status }));
}

async function generateAndWaitForMessage() {
    click(generateButton());
    await waitFor(() => expect(message().textContent).not.toBe(""));
    await waitFor(() => expect(container.querySelector("[data-tool-state]")!.getAttribute("data-tool-state")).toBe("ready"));
}

describe("Generate tool when something goes wrong", () => {
    it("says the design failed and the credits were refunded", async () => {
        stubGenerate(json(500, { error: "Failed to generate images", success: false }));
        render();
        await uploadPhoto();
        click(option("Quality", "Pro"));
        await generateAndWaitForMessage();

        expect(message().textContent).toMatch(/could not be made/i);
        expect(message().textContent).toMatch(/2 credits were refunded/i);
    });

    it("asks to check the connection when the request never arrives, and keeps the photo", async () => {
        stubGenerate(() => Promise.reject(new TypeError("Failed to fetch")));
        render();
        await uploadPhoto();
        await generateAndWaitForMessage();

        expect(message().textContent).toMatch(/check your connection and try again/i);
        expect(container.querySelector('img[alt="Your room"]')).not.toBeNull();
        expect(generateButton().disabled).toBe(false);
    });

    it("asks to wait when there were too many designs in a short time", async () => {
        stubGenerate(
            json(429, {
                error: "Rate limit exceeded",
                message: "You're making requests too quickly. Please wait a moment.",
                remaining: 0,
                resetAt: Date.now() + 20 * 60 * 1000,
            })
        );
        render();
        await uploadPhoto();
        await generateAndWaitForMessage();

        expect(message().textContent).toMatch(/too many designs/i);
        expect(message().textContent).toMatch(/try again in about 20 minutes/i);
    });

    it("asks to sign in again when the session has ended, and comes back to the tool with the same choices", async () => {
        stubGenerate(json(401, { error: "Unauthorized" }));
        render();
        await uploadPhoto();
        chooseRoom("Bedroom");
        click(option("Style", "Japandi"));
        await generateAndWaitForMessage();

        expect(message().textContent).toMatch(/sign in again/i);
        click(button("Sign in again"));
        expect(signOut).toHaveBeenCalledWith({ redirectUrl: "/generate?style=japandi&room=bedroom" });

        // Choices changed after the message keep their new values.
        click(option("Style", "Coastal"));
        click(button("Sign in again"));
        expect(signOut).toHaveBeenLastCalledWith({ redirectUrl: "/generate?style=coastal&room=bedroom" });
    });

    it("says up front when the balance is too low for the chosen quality, with a way to buy credits", async () => {
        const network = stubGenerate(json(200, { success: true, predictionId: "gen_1", outputUrls: [RESULT] }));
        useUserStore.getState().setUser({ id: "u1", credits: 1 } as never);
        useUserStore.getState().setCredits(1);
        render();
        await uploadPhoto();
        expect(message().textContent).toBe("");

        click(option("Quality", "Pro"));

        expect(message().textContent).toMatch(/not enough credits/i);
        expect(message().textContent).toMatch(/pro uses 2 credits and you have 1/i);
        const buy = Array.from(message().querySelectorAll("a")).find((a) => a.textContent === "Buy credits");
        expect(buy?.getAttribute("href")).toBe("/pricing");
        click(generateButton());
        expect(network.requests).not.toContain("/api/generate");

        // Quick fits the balance again.
        click(option("Quality", "Quick"));
        expect(message().textContent).toBe("");
    });

    it("shows the real balance and a way to buy credits when the API says the balance is too low", async () => {
        // The screen thought there were 5 credits; the account has none left.
        stubGenerate(json(402, { error: "Insufficient credits" }), { creditsAfter: 0 });
        useUserStore.getState().setUser({ id: "u1", credits: 5 } as never);
        render();
        await uploadPhoto();
        await generateAndWaitForMessage();

        await waitFor(() => expect(message().textContent).toMatch(/quick uses 1 credit and you have 0/i));
        expect(message().textContent).not.toMatch(/went wrong/i);
        const buy = Array.from(message().querySelectorAll("a")).filter((a) => a.textContent === "Buy credits");
        expect(buy).toHaveLength(1);
        expect(buy[0].getAttribute("href")).toBe("/pricing");
    });

    it("still offers to buy credits after a 402 when the balance cannot be re-read", async () => {
        vi.stubGlobal("fetch", (url: string) =>
            url === "/api/generate"
                ? json(402, { error: "Insufficient credits" })()
                : Promise.resolve(new Response("{}", { status: 500 }))
        );
        useUserStore.getState().setUser({ id: "u1", credits: 5 } as never);
        render();
        await uploadPhoto();
        await generateAndWaitForMessage();

        await waitFor(() => expect(message().textContent).toMatch(/not enough credits/i));
        const buy = Array.from(message().querySelectorAll("a")).filter((a) => a.textContent === "Buy credits");
        expect(buy).toHaveLength(1);
    });

    it("says why a photo over 20 MB was not used, and keeps the current photo", async () => {
        render();
        await uploadPhoto();

        const huge = new File([new Uint8Array([137, 80, 78, 71])], "huge.png", { type: "image/png" });
        Object.defineProperty(huge, "size", { value: 21 * 1024 * 1024 });
        await chooseFile(huge);

        await waitFor(() => expect(message().textContent).toMatch(/over 20 MB/i));
        expect(container.querySelector('img[alt="Your room"]')?.getAttribute("src")).toBe(PHOTO);
    });

    it("says which files it takes when the file is not a JPG, PNG or WebP", async () => {
        render();
        await uploadPhoto();

        await chooseFile(new File(["GIF89a"], "room.gif", { type: "image/gif" }));

        await waitFor(() => expect(message().textContent).toMatch(/JPG, PNG or WebP/i));
        expect(container.querySelector('img[alt="Your room"]')?.getAttribute("src")).toBe(PHOTO);
    });

    it("asks for another photo when the photo cannot be read", async () => {
        class BrokenImage extends LoadedImage {
            set src(_value: string) {
                setTimeout(() => this.onerror?.(), 0);
            }
        }
        vi.stubGlobal("Image", BrokenImage);
        render();

        await chooseFile(new File([new Uint8Array([1, 2, 3])], "room.jpg", { type: "image/jpeg" }));

        await waitFor(() => expect(message().textContent).toMatch(/try another photo/i));
        expect(container.querySelector('img[alt="Your room"]')).toBeNull();
    });

    it("says when the download did not work", async () => {
        const network = stubNetwork();
        render();
        await uploadPhoto();
        click(generateButton());
        await network.finish();
        await waitFor(() => expect(button("Download")).toBeTruthy());

        vi.stubGlobal("fetch", () => Promise.reject(new TypeError("Failed to fetch")));
        click(button("Download"));

        await waitFor(() => expect(message().textContent).toMatch(/download didn't work/i));
    });

    it("says the request timed out when the server gives up before answering", async () => {
        stubGenerate(() => Promise.resolve(new Response("<html>An error occurred</html>", { status: 504 })));
        render();
        await uploadPhoto();
        await generateAndWaitForMessage();

        expect(message().textContent).toMatch(/took too long/i);
        expect(message().textContent).toMatch(/check your connection and try again/i);
    });

    it("says no design was made when the answer has no image", async () => {
        stubGenerate(json(200, { success: true, predictionId: "gen_1", outputUrls: [] }));
        render();
        await uploadPhoto();
        await generateAndWaitForMessage();

        expect(message().textContent).toMatch(/no design was made/i);
        expect(container.querySelector('input[type="range"]')).toBeNull();
    });

    it("asks for another photo when the request is not accepted", async () => {
        stubGenerate(json(400, { error: "Invalid input", issues: [] }));
        render();
        await uploadPhoto();
        await generateAndWaitForMessage();

        expect(message().textContent).toMatch(/try another photo/i);
        expect(message().textContent).toMatch(/not charged/i);
    });

    it("asks to sign in again when the account cannot be found", async () => {
        stubGenerate(json(404, { error: "User not found" }));
        render();
        await uploadPhoto();
        await generateAndWaitForMessage();

        expect(message().textContent).toMatch(/couldn't find your account/i);
        expect(button("Sign in again")).toBeTruthy();
    });
});

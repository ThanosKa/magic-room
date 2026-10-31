import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CompareSlider } from "@/components/compare-slider";

// jsdom has no PointerEvent: a MouseEvent carrying pointerId/pointerType is
// what React's pointer handlers read.
function pointer(
    target: Element,
    type: string,
    { x = 0, y = 75, id = 1, kind = "mouse" }: { x?: number; y?: number; id?: number; kind?: string } = {}
) {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 });
    Object.defineProperty(event, "pointerId", { value: id });
    Object.defineProperty(event, "pointerType", { value: kind });
    Object.defineProperty(event, "isPrimary", { value: id === 1 });
    act(() => {
        target.dispatchEvent(event);
    });
}

function key(target: Element, k: string, init: KeyboardEventInit = {}) {
    act(() => {
        target.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true, ...init }));
    });
}

let container: HTMLDivElement;
let root: Root;

const slider = () => container.querySelector('input[type="range"]') as HTMLInputElement;
const box = () => slider().closest("[data-compare]") as HTMLElement;
const position = () => Number(slider().value);

beforeEach(() => {
    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => {
        root.render(
            <CompareSlider
                before={{ src: "/images/room-before.png", alt: "Room before" }}
                after={{ src: "/images/room-after.png", alt: "Room after" }}
            />
        );
    });
    // The slider box is 200px wide, starting at x = 100.
    box().getBoundingClientRect = () =>
        ({ left: 100, width: 200, top: 0, height: 150, right: 300, bottom: 150, x: 100, y: 0 }) as DOMRect;
});

afterEach(() => {
    act(() => root.unmount());
    container.remove();
});

describe("CompareSlider", () => {
    it("starts in the middle, labelled for screen readers", () => {
        expect(position()).toBe(50);
        expect(slider().getAttribute("aria-label")).toBe("Compare before and after");
    });

    it("moves the divider to where the mouse presses and follows the drag", () => {
        pointer(box(), "pointerdown", { x: 150 });
        expect(position()).toBe(25);
        pointer(box(), "pointermove", { x: 250 });
        expect(position()).toBe(75);
        pointer(box(), "pointerup", { x: 250 });
        pointer(box(), "pointermove", { x: 120 });
        expect(position()).toBe(75);
    });

    it("ignores a second finger while the first one is dragging", () => {
        pointer(box(), "pointerdown", { x: 150, id: 1, kind: "touch" });
        pointer(box(), "pointermove", { x: 160, id: 1, kind: "touch" });
        expect(position()).toBe(30);

        // A second finger lands, moves and lifts: nothing happens.
        pointer(box(), "pointerdown", { x: 280, id: 2, kind: "touch" });
        pointer(box(), "pointermove", { x: 290, id: 2, kind: "touch" });
        pointer(box(), "pointerup", { x: 290, id: 2, kind: "touch" });
        expect(position()).toBe(30);

        // The first finger is still dragging.
        pointer(box(), "pointermove", { x: 200, id: 1, kind: "touch" });
        expect(position()).toBe(50);
    });

    it("leaves the divider alone when a touch turns into a page scroll", () => {
        // The browser takes over for vertical scrolling and cancels the pointer.
        pointer(box(), "pointerdown", { x: 280, kind: "touch" });
        pointer(box(), "pointercancel", { x: 280, kind: "touch" });
        expect(position()).toBe(50);
        pointer(box(), "pointermove", { x: 120, kind: "touch" });
        expect(position()).toBe(50);
    });

    it("ignores the first, mostly vertical moves of a finger that is starting a scroll", () => {
        // Chrome sends a few pointermoves before it takes over and cancels.
        pointer(box(), "pointerdown", { x: 150, y: 100, kind: "touch" });
        pointer(box(), "pointermove", { x: 154, y: 90, kind: "touch" });
        pointer(box(), "pointermove", { x: 158, y: 70, kind: "touch" });
        pointer(box(), "pointercancel", { x: 158, y: 70, kind: "touch" });
        expect(position()).toBe(50);
    });

    it("follows a finger once it moves sideways", () => {
        pointer(box(), "pointerdown", { x: 200, y: 100, kind: "touch" });
        pointer(box(), "pointermove", { x: 208, y: 101, kind: "touch" });
        expect(position()).toBe(54);
        // From then on it follows, even if the finger drifts up or down.
        pointer(box(), "pointermove", { x: 250, y: 140, kind: "touch" });
        expect(position()).toBe(75);
    });

    it("moves the divider on a tap", () => {
        pointer(box(), "pointerdown", { x: 250, kind: "touch" });
        pointer(box(), "pointerup", { x: 250, kind: "touch" });
        expect(position()).toBe(75);
    });

    it("moves with the arrow keys, Shift for bigger steps, Home and End for the edges", () => {
        slider().focus();
        key(slider(), "ArrowRight");
        expect(position()).toBe(55);
        key(slider(), "ArrowLeft");
        key(slider(), "ArrowLeft");
        expect(position()).toBe(45);
        key(slider(), "ArrowLeft", { shiftKey: true });
        expect(position()).toBe(35);
        key(slider(), "End");
        expect(position()).toBe(100);
        key(slider(), "ArrowRight");
        expect(position()).toBe(100);
        key(slider(), "Home");
        expect(position()).toBe(0);
    });

    it("tells screen readers how much of each photo shows", () => {
        expect(slider().getAttribute("aria-valuetext")).toBe("50% before, 50% after");
        slider().focus();
        key(slider(), "ArrowLeft", { shiftKey: true });
        expect(slider().getAttribute("aria-valuetext")).toBe("40% before, 60% after");
    });

    it("shows the fallback photo when a photo fails to load", () => {
        act(() => {
            root.render(
                <CompareSlider
                    before={{ src: "/images/missing.jpg", alt: "Room before", fallback: "/images/room-before.png" }}
                    after={{ src: "/images/room-after.png", alt: "Room after" }}
                />
            );
        });
        const img = container.querySelector('img[alt="Room before"]') as HTMLImageElement;
        expect(img.getAttribute("src")).toContain(encodeURIComponent("/images/missing.jpg"));
        act(() => {
            img.dispatchEvent(new Event("error"));
        });
        const after = container.querySelector('img[alt="Room before"]') as HTMLImageElement;
        expect(after.getAttribute("src")).toContain(encodeURIComponent("/images/room-before.png"));
    });
});

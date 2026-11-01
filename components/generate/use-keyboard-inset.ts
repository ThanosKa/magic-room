"use client";

import { useEffect, useState } from "react";

/**
 * How many pixels at the bottom of the layout viewport the on-screen keyboard
 * covers, while `enabled`. Phones (iOS Safari, and Chrome on Android by
 * default) open the keyboard over the page instead of shrinking it, so a bar
 * stuck to `bottom: 0` ends up behind the keyboard. Setting the bar's `bottom`
 * to this value keeps it just above the keyboard.
 */
export function useKeyboardInset(enabled: boolean): number {
    const [inset, setInset] = useState(0);

    useEffect(() => {
        const viewport = window.visualViewport;
        if (!enabled || !viewport) return;
        const update = () => {
            const covered = window.innerHeight - viewport.height - viewport.offsetTop;
            setInset(covered > 1 ? Math.round(covered) : 0);
        };
        update();
        viewport.addEventListener("resize", update);
        viewport.addEventListener("scroll", update);
        return () => {
            viewport.removeEventListener("resize", update);
            viewport.removeEventListener("scroll", update);
        };
    }, [enabled]);

    return enabled ? inset : 0;
}

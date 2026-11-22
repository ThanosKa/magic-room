"use client";

import { useEffect, useState } from "react";

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

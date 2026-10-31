import { startTransition, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot, type Root } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { SiteMain } from "@/components/site-main";
import { Header } from "@/components/header";

/**
 * Ticket 22: signed-in (and sometimes signed-out) page loads logged React's
 * "Hydration failed" (#418). Each test renders the real component to HTML the
 * way the server does, then hydrates it the way the browser does, under the
 * timing that broke it, and expects React to report nothing.
 */

// --- Clerk: what the server knows (nothing) vs what the browser may already know.
const clerk = { isLoaded: false, isSignedIn: undefined as boolean | undefined };
vi.mock("@clerk/nextjs", () => ({
    useUser: () => ({
        isLoaded: clerk.isLoaded,
        isSignedIn: clerk.isSignedIn,
        user: clerk.isSignedIn ? { id: "clerk_user_123" } : clerk.isLoaded ? null : undefined,
    }),
    SignInButton: ({ children }: { children: ReactNode }) => children,
    SignUpButton: ({ children }: { children: ReactNode }) => children,
    UserButton: () => <button type="button">Account</button>,
}));

vi.mock("next/navigation", () => ({ usePathname: () => "/pricing" }));

beforeAll(() => {
    window.matchMedia ??= ((query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    globalThis.ResizeObserver ??= class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

let root: Root | null = null;
afterEach(() => {
    root?.unmount();
    root = null;
    document.body.innerHTML = "";
    vi.restoreAllMocks();
});

/**
 * Server-renders `server`, hydrates `client` over it in a transition (as
 * Next.js does), waits for React to settle, and returns every hydration
 * problem React reported: recoverable errors and dev-mode mismatch warnings.
 */
async function hydrate(server: ReactNode, client: ReactNode, beforeHydrate?: () => void) {
    const container = document.createElement("div");
    container.innerHTML = renderToString(server);
    document.body.appendChild(container);

    const problems: string[] = [];
    vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
        const text = args.map(String).join(" ");
        if (/hydrat/i.test(text)) problems.push(text);
    });

    beforeHydrate?.();
    startTransition(() => {
        root = hydrateRoot(container, client, {
            onRecoverableError: (error) => problems.push(String((error as Error).message ?? error)),
        });
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { problems, container };
}

const page = (
    <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{}" }} />
        <section>Page</section>
    </>
);

/**
 * The page as the browser first receives it from Next: an element still
 * waiting on a client chunk (in the app: app/error.tsx, which the layout
 * router needs). It settles one microtask after React first asks for it, so it
 * is pending when hydration reaches <main> and ready by React's next task.
 */
function pageArrivingLate(): PromiseLike<ReactNode> {
    const waiting: Array<(value: ReactNode) => void> = [];
    let ready = false;
    return {
        then(onFulfilled) {
            if (ready) {
                onFulfilled?.(page);
            } else {
                if (waiting.length === 0) {
                    queueMicrotask(() => {
                        ready = true;
                        waiting.splice(0).forEach((resolve) => resolve(page));
                    });
                }
                waiting.push((value) => onFulfilled?.(value));
            }
            return this as never;
        },
    };
}

describe("hydration (ticket 22)", () => {
    it("the layout's <main> hydrates a page that arrives a moment late", async () => {
        const frame = (children: ReactNode) => (
            <div>
                <header>Header</header>
                <SiteMain>{children}</SiteMain>
                <footer>Footer</footer>
            </div>
        );

        const { problems, container } = await hydrate(frame(page), frame(pageArrivingLate() as unknown as ReactNode));

        expect(problems).toEqual([]);
        expect(container.querySelector("main > section")?.textContent).toBe("Page");
    });

    it("the header hydrates when Clerk already knows the user is signed in", async () => {
        clerk.isLoaded = false;
        clerk.isSignedIn = undefined;

        // clerk-js can finish loading (it is cached) before React hydrates.
        const { problems, container } = await hydrate(<Header />, <Header />, () => {
            clerk.isLoaded = true;
            clerk.isSignedIn = true;
        });

        expect(problems).toEqual([]);
        // After hydration the header catches up with Clerk.
        expect(container.textContent).not.toContain("Sign In");
    });

    it("the header hydrates when Clerk already knows the visitor is signed out", async () => {
        clerk.isLoaded = false;
        clerk.isSignedIn = undefined;

        const { problems, container } = await hydrate(<Header />, <Header />, () => {
            clerk.isLoaded = true;
            clerk.isSignedIn = false;
        });

        expect(problems).toEqual([]);
        expect(container.querySelector("[data-bar-item].opacity-0")).toBeNull();
    });
});

"use client";

import { useSyncExternalStore } from "react";
import { useUser } from "@clerk/nextjs";

const subscribe = () => () => {};

/**
 * Clerk's `useUser`, safe to render from on a server-rendered page.
 *
 * The server never knows who is signed in (Clerk decides that in the
 * browser), so it renders every page as "Clerk not loaded yet". In the browser
 * clerk-js is often cached and finishes before React hydrates; `useUser` then
 * reports the real user on the very first render, the markup differs from the
 * server's (credits pill vs "Sign In"), and React logs a hydration error #418
 * (ticket 22). This hook reports "not loaded" until hydration is done, then
 * re-renders with Clerk's real state. On client-side navigations it is just
 * `useUser`.
 */
export function useHydratedUser() {
  const { isLoaded, isSignedIn, user } = useUser();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!hydrated || !isLoaded) {
    return { isLoaded: false, isSignedIn: undefined, user: undefined } as const;
  }
  return { isLoaded: true, isSignedIn: Boolean(isSignedIn), user: user ?? null } as const;
}

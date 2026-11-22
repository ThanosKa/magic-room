"use client";

import { useSyncExternalStore } from "react";
import { useUser } from "@clerk/nextjs";

const subscribe = () => () => {};

/**
 * Clerk's `useUser`, safe to render from a server-rendered page: it reports
 * "not loaded" until hydration is done, then re-renders with Clerk's real
 * state, so the first client render matches the server's markup.
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

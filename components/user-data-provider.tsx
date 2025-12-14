"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "@/stores/user-store";

/**
 * Fetches user data from the database when authenticated.
 * Ensures credits and user info are available on all pages.
 */
export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useUser();
  const { refreshUser } = useUserStore();

  useEffect(() => {
    if (isLoaded && clerkUser?.id) {
      refreshUser(clerkUser.id);
    }
  }, [isLoaded, clerkUser?.id, refreshUser]);

  return <>{children}</>;
}

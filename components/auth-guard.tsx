"use client";

import React, { ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import { RedirectToSignIn } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * AuthGuard component wraps pages that require authentication.
 * Shows a loading skeleton while checking auth, or redirects to sign-in if not authenticated.
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // Show loading skeleton while checking auth state
  if (!isLoaded) {
    return fallback || <AuthLoadingFallback />;
  }

  // If not signed in, redirect to sign-in page
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // User is authenticated, render content
  return <>{children}</>;
}

/**
 * Default loading fallback while auth state is being verified
 */
function AuthLoadingFallback() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-16">
      <Skeleton className="h-12 w-48" />
      <div className="grid w-full gap-4 md:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}


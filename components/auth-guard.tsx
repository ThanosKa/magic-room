"use client";

import React, { ReactNode } from "react";
import { useAuth } from "@clerk/nextjs";
import { RedirectToSignIn } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return fallback || <AuthLoadingFallback />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
}

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


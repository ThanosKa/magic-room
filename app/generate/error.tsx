"use client";

import { ErrorScreen } from "@/components/error-screen";

export default function GenerateError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorScreen
      className="min-h-[60vh]"
      title="Something went wrong"
      message={
        error.message || "An error occurred while processing your request"
      }
      onRetry={reset}
    />
  );
}

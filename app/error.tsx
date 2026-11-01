"use client";

import { ErrorScreen } from "@/components/error-screen";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorScreen
      className="min-h-[70vh]"
      title="Oops! Something went wrong"
      message={
        error.message ||
        "An unexpected error occurred while processing your request. Our team has been notified."
      }
      onRetry={reset}
      digest={error.digest}
    />
  );
}

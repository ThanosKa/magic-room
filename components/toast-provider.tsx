"use client";

import React from "react";
import { Toaster } from "sonner";

/**
 * ToastProvider wraps the Sonner toaster with theme support
 */
export function ToastProvider() {
  return (
    <Toaster
      theme="system"
      position="bottom-right"
      richColors
      closeButton
      expand={false}
      visibleToasts={3}
    />
  );
}

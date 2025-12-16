"use client";

import React from "react";
import { Toaster } from "sonner";

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


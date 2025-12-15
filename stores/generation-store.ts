import { create } from "zustand";
import { IGenerationResult } from "@/types";

interface GenerationStore {
  activeGeneration: IGenerationResult | null;
  uploadedImageUrl: string | null;
  uploadedImagePath: string | null;

  // Actions
  setActiveGeneration: (generation: IGenerationResult | null) => void;
  setUploadedImage: (url: string, path: string) => void;
  clearUploadedImage: () => void;

  // Status updates
  updateGenerationStatus: (generation: IGenerationResult) => void;
  reset: () => void;
}

/**
 * Generation store for managing upload and generation state.
 * 
 * Simplified for OpenRouter synchronous flow:
 * - Removed isPolling state (no polling needed)
 * - uploadedImageUrl is now base64 data URL
 * - uploadedImagePath is empty (no bucket upload)
 */
export const useGenerationStore = create<GenerationStore>((set) => ({
  activeGeneration: null,
  uploadedImageUrl: null,
  uploadedImagePath: null,

  setActiveGeneration: (generation) => set({ activeGeneration: generation }),
  setUploadedImage: (url, path) =>
    set({ uploadedImageUrl: url, uploadedImagePath: path }),
  clearUploadedImage: () =>
    set({ uploadedImageUrl: null, uploadedImagePath: null }),

  updateGenerationStatus: (generation) => {
    set((state) => ({
      activeGeneration: state.activeGeneration
        ? { ...state.activeGeneration, ...generation }
        : generation,
    }));
  },

  reset: () => {
    set({
      activeGeneration: null,
      uploadedImageUrl: null,
      uploadedImagePath: null,
    });
  },
}));

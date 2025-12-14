import { create } from "zustand";
import { IGenerationResult } from "@/types";

interface GenerationStore {
  activeGeneration: IGenerationResult | null;
  isPolling: boolean;
  uploadedImageUrl: string | null;
  uploadedImagePath: string | null;

  // Actions
  setActiveGeneration: (generation: IGenerationResult | null) => void;
  setIsPolling: (polling: boolean) => void;
  setUploadedImage: (url: string, path: string) => void;
  clearUploadedImage: () => void;

  // Status updates
  updateGenerationStatus: (generation: IGenerationResult) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationStore>((set) => ({
  activeGeneration: null,
  isPolling: false,
  uploadedImageUrl: null,
  uploadedImagePath: null,

  setActiveGeneration: (generation) => set({ activeGeneration: generation }),
  setIsPolling: (polling) => set({ isPolling: polling }),
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
      isPolling: false,
      uploadedImageUrl: null,
      uploadedImagePath: null,
    });
  },
}));


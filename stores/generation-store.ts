import { create } from "zustand";
import { IGenerationResult } from "@/types";

interface GenerationStore {
  activeGeneration: IGenerationResult | null;
  uploadedImageUrl: string | null;
  uploadedImagePath: string | null;

  setActiveGeneration: (generation: IGenerationResult | null) => void;
  setUploadedImage: (url: string, path: string) => void;
  clearUploadedImage: () => void;

  updateGenerationStatus: (generation: IGenerationResult) => void;
  reset: () => void;
}

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

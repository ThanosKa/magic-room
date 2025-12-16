import { create } from "zustand";
import { IUser } from "@/types";

interface UserStore {
  user: IUser | null;
  credits: number;
  isLoading: boolean;
  error: string | null;

  setUser: (user: IUser | null) => void;
  setCredits: (credits: number) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  refreshUser: (clerkUserId: string) => Promise<void>;
  deductCredit: () => void;
  addCredits: (amount: number) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  credits: 0,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setCredits: (credits) => set({ credits }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  refreshUser: async (clerkUserId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/user?clerkUserId=${clerkUserId}`);
      if (!response.ok) {
        throw new Error("Failed to refresh user");
      }
      const data = await response.json();
      set({ user: data.user, credits: data.user.credits });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  deductCredit: () => {
    set((state) => ({
      credits: Math.max(0, state.credits - 1),
    }));
  },

  addCredits: (amount) => {
    set((state) => ({
      credits: state.credits + amount,
    }));
  },

  reset: () => {
    set({
      user: null,
      credits: 0,
      isLoading: false,
      error: null,
    });
  },
}));


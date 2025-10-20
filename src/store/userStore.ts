import { UserProfile } from "@/types/userprofile";
import { create } from "zustand";

type UserStore = {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),

  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : state.user,
    })),
}));

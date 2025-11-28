import { FounderMatch } from "@/types/matches";
import { create } from "zustand";

// --- Zustand Store Type ---
interface FounderMatchStore {
  matches: FounderMatch[];
  loading: boolean;
  setMatches: (matches: FounderMatch[]) => void;
  addMatch: (match: FounderMatch) => void;
  updateMatchStatus: (
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

// --- Zustand Store ---
export const useMatches = create<FounderMatchStore>((set) => ({
  matches: [],
  loading: false,

  setMatches: (matches) => set({ matches }),

  addMatch: (match) =>
    set((state) => ({
      matches: [...state.matches, match],
    })),

  updateMatchStatus: (id, status) =>
    set((state) => ({
      matches: state.matches.map((m) => (m.id === id ? { ...m, status } : m)),
    })),

  setLoading: (loading) => set({ loading }),

  reset: () => set({ matches: [], loading: false }),
}));

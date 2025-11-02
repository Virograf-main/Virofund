// store/tableStore.ts

import { create } from "zustand";

/* ---------- 1. Types ---------- */
export interface TableRow {
  userId: string;
  name: string;
  location: string;
  industry: string;
  skills: string;
  score: React.ReactNode;
}

interface TableState<T> {
  loading: boolean;
  tableData: T[];
  setLoading: (isLoading: boolean) => void;
  setTable: (data: T[]) => void;
  clearTable: () => void;
}

/* ---------- 2. Create ONE store instance ---------- */
const useTableStore = create<TableState<TableRow>>((set) => ({
  loading: true,
  tableData: [] as TableRow[],
  setLoading: (isLoading) => set({ loading: isLoading }),
  setTable: (data) => set({ tableData: data }),
  clearTable: () => set({ tableData: [], loading: false }),
}));

export { useTableStore }; // ← export the hook

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnboardingData } from "@/types/userprofile";

interface OnboardingStore {
  data: OnboardingData;
  updateField: <K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K]
  ) => void;
  reset: () => void;
}

const initialData: OnboardingData = {
  founderStatus: "",
  skills: [],
  industry: "",
  currentOccupation: "",
  yearsExperience: 0,
  commitmentLevel: "",
  financialContribution: "",
  personalityTraits: [],
  location: "",
  preferredSkills: [],
  preferredFounderType: "",
  preferredIndustry: "",
  preferredCommitmentLevel: "",
  preferredFinancial: "",
  preferredPersonalityTraits: [],
  preferredLocation: "",
  gender: "",
  dateOfBirth: "",
  linkedInUrl: "",
  hasStartup: false,
  workStyle: "",
  riskManagementStyle: "",
  bio: "",
  pastExperience: "",
  userName: "noname",
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      data: initialData,
      updateField: (field, value) =>
        set((state) => ({
          data: { ...state.data, [field]: value },
        })),
      reset: () => set({ data: initialData }),
    }),
    {
      name: "onboarding-storage",
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);

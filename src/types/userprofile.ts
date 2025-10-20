export interface OnboardingData {
  founderStatus?: string;
  skills?: string[];
  industry?: string;
  currentOccupation?: string;
  yearsExperience?: number;
  commitmentLevel?: string;
  financialContribution?: string;
  personalityTraits?: string[];
  location?: string;
  preferredSkills?: string[];
  preferredFounderType?: string;
  preferredIndustry?: string;
  preferredCommitmentLevel?: string;
  preferredFinancial?: string;
  preferredPersonalityTraits?: string[];
  preferredLocation?: string; // looks like your snippet got cut at "preferredLo"
}

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string; // ISO timestamp string
  updatedAt: string; // ISO timestamp string
}

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
  preferredLocation?: string;
  gender: string;
  dateOfBirth: string;
  linkedInUrl: string;
  hasStartup: boolean;
  workStyle: string;
  riskManagementStyle: string;
  bio: string;
  pastExperience: string;
  userName: string;
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

export interface Founder {
  id: number;
  userId: number;
  founderStatus: string;
  skills: string[];
  industry: string;
  currentOccupation: string;
  yearsExperience: number;
  commitmentLevel: string;
  financialContribution: string;
  personalityTraits: string[];
  location: string;

  preferredSkills: string[];
  preferredFounderType: string;
  preferredIndustry: string;
  preferredCommitmentLevel: string;
  preferredFinancial: string;
  preferredPersonalityTraits: string[];
  preferredLocation: string;

  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

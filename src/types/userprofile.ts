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
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  profile: Profile;
}

export interface Profile {
  id: string;
  userName: string;
  bio: string;
  dateOfBirth: string;
  gender: string;
  linkedInUrl: string;
  founderStatus: string;
  skills: string[];
  industry: string;
  currentOccupation: string;
  yearsExperience: number;
  commitmentLevel: string;
  financialContribution: string;
  personalityTraits: string[];
  location: string;
  workStyle: string;
  hasStartup: boolean;
  riskManagementStyle: string;
  pastExperience: string;
  preferredSkills: string[];
  preferredFounderType: string;
  preferredIndustry: string;
  preferredCommitmentLevel: string;
  preferredFinancial: string;
  preferredPersonalityTraits: string[];
  preferredLocation: string;
  createdAt: string;
  updatedAt: string;
}

export interface Founder {
  id: string;
  userId: string;
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

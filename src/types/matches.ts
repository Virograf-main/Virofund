export interface MatchedFounderDetails {
  name: string;
  founderStatus: string;
  skills: string[];
  industry: string;
  yearsExperience: number;
  location: string;
}

export interface FounderMatch {
  id: string;
  founderId: string;
  matchedFounderId: string;
  overallScore: number;
  industryScore: number;
  skillsScore: number;
  founderStatusScore: number;
  commitmentScore: number;
  financialScore: number;
  personalityScore: number;
  locationScore: number;
  status: "pending" | "approved" | "rejected"; // adjust as needed
  matchedFounderDetails: MatchedFounderDetails;
  createdAt: string; // ISO date string
}

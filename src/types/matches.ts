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
  matchedProfileId: string;
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

export interface ConnectionRequest {
  id: string;
  sender: UserInfo;
  receiver: UserInfo;
  status: "pending" | "accepted" | "declined" | string;
  compatibilityScore: number;
  createdAt: string; // or Date if you convert it
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matchedProfileId?: string;
}

// Where a given user stands relative to the logged-in user:
// - "none": no request either way, show Connect
// - "pending_sent": logged-in user sent a request, awaiting response
// - "pending_incoming": the other user sent a request, awaiting our response
// - "accepted": the two are connected
export type ConnectionStatus =
  | "none"
  | "pending_sent"
  | "pending_incoming"
  | "accepted";

export interface ConnectionStatusResult {
  status: ConnectionStatus;
  request?: ConnectionRequest;
}

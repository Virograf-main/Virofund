"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Profile from "@/components/pages/profile";
import { getSpecificProfile } from "@/lib/profile";
import { Founder } from "@/types/userprofile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Founder | null>(null);
  const [loading, setLoading] = useState(true);
  const profileId = params.profileId as string;

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const data = await getSpecificProfile(profileId, router);
      if (!data) {
        toast.error("something went wrong");
        setLoading(false);
        return;
      }
      setProfile(data);
      setLoading(false);
    }
    fetchUser();
  }, [profileId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground">User profile not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header for other user profile */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{profile.firstName} {profile.lastName}</h1>
          <p className="text-sm text-muted-foreground">Viewing user profile</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Connect
        </button>
      </div>

      <Profile
        variant="other"
        basicInfo={{
          fullname: `${profile.firstName} ${profile.lastName}`,
          role: profile.currentOccupation || "No occupation listed",
          location: {
            state: profile.location,
          },
          socials: profile.linkedInUrl || "Not provided",
          image: "/images/clinton.jpg",
        }}
        bio={profile.bio}
        details={{
          keyRoles: [
            profile.founderStatus || "Not specified",
            profile.industry || "Not specified",
            profile.commitmentLevel || "Not specified",
          ],
          workStyles: profile.workStyle
            ? [profile.workStyle]
            : [],
          skills: profile.skills || [],
          personalityTraits: profile.personalityTraits || [],
        }}
        experience={[
          { title: profile.currentOccupation || "Current occupation", date: "Present" },
          { title: `${profile.yearsExperience || 0} years of experience`, date: "" },
          { title: profile.pastExperience || "Past experience", date: "" },
        ]}
        needs={{
          coFounder: [
            ...(profile.preferredFounderType ? [profile.preferredFounderType] : []),
            ...(profile.financialContribution ? [profile.financialContribution] : []),
          ],
          CurrentSkills: profile.preferredSkills || [],
          Industry: profile.preferredIndustry
            ? [profile.preferredIndustry]
            : [],
        }}
        projects={{
          name: profile.hasStartup ? "Current Startup" : "No current startup",
          description: profile.pastExperience || "No startup experience listed",
          status: profile.commitmentLevel || "Not specified",
          link: "",
        }}
      />
    </div>
  );
}

export default UserProfilePage;

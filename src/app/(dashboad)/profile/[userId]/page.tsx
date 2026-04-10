"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Profile, { FounderProfile } from "@/components/pages/profile";
import { getSpecificProfile } from "@/lib/profile";
import { UserProfile } from "@/types/userprofile";
import toast from "react-hot-toast";

function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<FounderProfile | null>(null);
  const [notFound, setNotFound] = useState(false);
  const userId = params.userId as string;

  useEffect(() => {
    async function fetchUser() {
      const data: UserProfile | undefined = await getSpecificProfile(
        userId,
        router,
      );
      if (!data) {
        setNotFound(true);
        toast.error("User not found");
        return;
      }

      const mapped: FounderProfile = {
        id: data.id,
        userId: data.id,
        userName: `${data.firstName} ${data.lastName}`,
        founderStatus: data.profile.founderStatus,
        bio: data.profile.bio,
        email: data.email,
        skills: data.profile.skills,
        workStyle: data.profile.workStyle,
        industry: data.profile.industry,
        currentOccupation: data.profile.currentOccupation,
        yearsExperience: data.profile.yearsExperience,
        commitmentLevel: data.profile.commitmentLevel,
        financialContribution: data.profile.financialContribution,
        personalityTraits: data.profile.personalityTraits,
        location: data.profile.location,
        preferredSkills: data.profile.preferredSkills,
        preferredFounderType: data.profile.preferredFounderType,
        preferredIndustry: data.profile.preferredIndustry,
        preferredCommitmentLevel: data.profile.preferredCommitmentLevel,
        preferredFinancial: data.profile.preferredFinancial,
        preferredPersonalityTraits: data.profile.preferredPersonalityTraits,
        preferredLocation: data.profile.preferredLocation,
        createdAt: data.profile.createdAt,
        updatedAt: data.profile.updatedAt,
      };

      setProfile(mapped);
    }
    fetchUser();
  }, [userId]);

  if (notFound) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-3">
        <p className="text-5xl">👤</p>
        <h1 className="text-xl font-semibold text-[#1C1A16]">User not found</h1>
        <p className="text-sm text-[#A09A8E]">
          This profile doesn&apos;t exist or may have been removed.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-2 text-sm text-[#1a6b4a] underline underline-offset-2"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!profile) return null; // loading

  return <Profile profile={profile} />;
}

export default UserProfilePage;

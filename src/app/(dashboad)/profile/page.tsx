"use client";

import Profile from "@/components/pages/profile";
import { Button } from "@/components/atoms";
import { getMatchingProfile } from "@/lib/profile";
import { Founder } from "@/types/userprofile";
import { useEffect, useState } from "react";
import { Loader2, SlidersHorizontal, Settings } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Founder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      setLoading(true);
      const data = await getMatchingProfile();
      if (!mounted) return;

      if (data && "id" in data) {
        setProfile(data as Founder);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

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
        <p className="text-muted-foreground">No profile found. Please create one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/profile/preferences">
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Co-founder Preferences
            </Button>
          </Link>
          <Link href="/profile/edit">
            <Button className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      <Profile
        variant="own"
        basicInfo={{
          fullname: `${profile.firstName} ${profile.lastName}`,
          role: profile.currentOccupation || "No occupation listed",
          location: { state: profile.location },
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
          workStyles: profile.workStyle ? [profile.workStyle] : [],
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

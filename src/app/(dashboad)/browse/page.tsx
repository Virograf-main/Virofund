"use client";

import { Button } from "@/components/atoms";
import { Loader } from "@/components/atoms";
import { SuggestionCard } from "@/components/molecules";
import { browseProfiles, sendRequest } from "@/lib/matches";
import { UserRoundSearch, LogIn } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface BrowseProfile {
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  founderStatus: string;
  skills: string[];
  industry: string;
  currentOccupation: string;
  yearsExperience: number;
  commitmentLevel: string;
  financialContribution: string;
  personalityTraits: string[];
  location: string;
  compatibilityScore: number;
  canSendRequest: boolean;
}

export default function BrowsePage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<BrowseProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const data = await browseProfiles();
      if (Array.isArray(data)) {
        setProfiles(data);
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const handleConnect = async (userId: string) => {
    setSendingTo(userId);
    const result = await sendRequest(userId);
    setSendingTo(null);
    if (result) {
      setProfiles((prev) =>
        prev.map((p) =>
          p.user.id.toString() === userId ? { ...p, canSendRequest: false } : p
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col gap-4 items-center">
          <Image
            src="/svg/no-data.svg"
            width={200}
            height={200}
            alt="no profiles"
          />
          <p className="text-center text-muted-foreground text-lg">
            No profiles available to browse
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Profiles will appear here when other founders join the platform
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Browse Co-founders</h1>
          <p className="text-muted-foreground">
            Discover founders and send connection requests
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          {profiles.length} founder{profiles.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex gap-3 items-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {profile.user.firstName.charAt(0)}
                  {profile.user.lastName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-base">
                    {profile.user.firstName} {profile.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {profile.currentOccupation || profile.founderStatus}
                  </p>
                </div>
              </div>
              {/* Compatibility Score */}
              <div className="flex flex-col items-center">
                <div
                  className={`text-lg font-bold ${
                    profile.compatibilityScore >= 0.75
                      ? "text-green-600"
                      : profile.compatibilityScore >= 0.5
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {(profile.compatibilityScore * 100).toFixed(0)}%
                </div>
                <span className="text-[10px] text-muted-foreground">Match</span>
              </div>
            </div>

            {/* Industry & Location */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Industry:</span>
                <span className="font-medium">{profile.industry}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">{profile.location}</span>
              </div>
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 5).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-secondary rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 5 && (
                  <span className="px-2.5 py-1 text-xs text-muted-foreground">
                    +{profile.skills.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Experience:</span>{" "}
                {profile.yearsExperience} years
              </div>
              <div>
                <span className="text-muted-foreground">Commitment:</span>{" "}
                {profile.commitmentLevel}
              </div>
              <div>
                <span className="text-muted-foreground">Founder Type:</span>{" "}
                {profile.founderStatus}
              </div>
              <div>
                <span className="text-muted-foreground">Financial:</span>{" "}
                {profile.financialContribution.length > 25
                  ? profile.financialContribution.substring(0, 25) + "..."
                  : profile.financialContribution}
              </div>
            </div>

            {/* Traits */}
            {profile.personalityTraits && profile.personalityTraits.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {profile.personalityTraits.slice(0, 3).map((trait, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-primary/5 rounded-md text-xs"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  router.push(`/profile/${profile.user.id}`)
                }
              >
                <UserRoundSearch className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button
                className="flex-1"
                disabled={!profile.canSendRequest || sendingTo === profile.user.id.toString()}
                onClick={() => handleConnect(profile.user.id.toString())}
              >
                {sendingTo === profile.user.id.toString() ? (
                  <>Sending...</>
                ) : profile.canSendRequest ? (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Connect
                  </>
                ) : (
                  "Request Sent"
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

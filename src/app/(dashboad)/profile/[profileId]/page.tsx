"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Profile from "@/components/pages/profile";
import { getSpecificProfile } from "@/lib/profile";
import { Founder } from "@/types/userprofile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Check, Clock3, UserPlus } from "lucide-react";
import { getConnectionStatusWithUser, sendRequest } from "@/lib/matches";
import { ConnectionStatus } from "@/types/matches";
import { useUserStore } from "@/store/userStore";

function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const [profile, setProfile] = useState<Founder | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("none");
  const [connectionLoading, setConnectionLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
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

  useEffect(() => {
    async function fetchConnectionStatus() {
      if (!profile?.userId || profile.userId === user?.id) {
        setConnectionLoading(false);
        return;
      }
      setConnectionLoading(true);
      const result = await getConnectionStatusWithUser(profile.userId);
      setConnectionStatus(result.status);
      setConnectionLoading(false);
    }
    fetchConnectionStatus();
  }, [profile?.userId, user?.id]);

  const handleConnect = async () => {
    if (!profile?.userId) return;
    setSendingRequest(true);
    const result = await sendRequest(profile.userId);
    if (result) {
      setConnectionStatus("pending_sent");
    }
    setSendingRequest(false);
  };

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
        {!connectionLoading && connectionStatus === "accepted" && (
          <span className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-lg font-medium text-sm">
            <Check className="w-4 h-4" />
            Connected
          </span>
        )}

        {!connectionLoading && connectionStatus === "pending_sent" && (
          <span className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm">
            <Clock3 className="w-4 h-4" />
            Request Sent
          </span>
        )}

        {!connectionLoading && connectionStatus === "pending_incoming" && (
          <button
            onClick={() => router.push("/requests")}
            className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all duration-200 font-medium text-sm"
          >
            <Clock3 className="w-4 h-4" />
            Respond to Request
          </button>
        )}

        {!connectionLoading && connectionStatus === "none" && (
          <button
            onClick={handleConnect}
            disabled={sendingRequest}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sendingRequest ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            Connect
          </button>
        )}
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

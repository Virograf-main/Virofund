"use client";
import { TokenChecker } from "@/components/wrappers/access-token-wrapper";
import { generateMatch, getMatches } from "@/lib/matches";
import { getMatchingProfile, getProfile } from "@/lib/profile";
import { useUserStore } from "@/store/userStore";
import { UserProfile } from "@/types/userprofile";
import { useMatches } from "@/store/useMatchesStore";
import { useEffect, useState } from "react";
import { FounderMatch } from "@/types/matches";
import toast from "react-hot-toast";
export function UserProfileWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { setUser } = useUserStore();
  const { setMatches } = useMatches();
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      console.log(token);
      await getProfile();
      const matches: FounderMatch[] = await generateMatch().finally(() =>
        setLoading(false)
      );
      setMatches(matches);
      // await getMatches
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}

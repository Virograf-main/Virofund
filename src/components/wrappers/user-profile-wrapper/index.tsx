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
import { useTableStore } from "@/store/useTableStore";
import { useRouter } from "next/navigation";
export function UserProfileWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { setLoading: setTableLoading, loading: tableLoading } =
    useTableStore();
  const router = useRouter();

  const { setUser } = useUserStore();
  const { setMatches } = useMatches();
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      console.log(token);
      await getProfile().finally(() => setLoading(false));
      if (!tableLoading) return;
      const matches: FounderMatch[] = await generateMatch(router).finally(() =>
        setTableLoading(false)
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

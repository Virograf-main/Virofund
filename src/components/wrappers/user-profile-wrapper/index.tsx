"use client";
import { TokenChecker } from "@/components/wrappers/access-token-wrapper";
import { generateMatch, getIncomingRequests, getMatches } from "@/lib/matches";
import { getMatchingProfile, getProfile } from "@/lib/profile";
import { useUserStore } from "@/store/userStore";
import { UserProfile } from "@/types/userprofile";
import { useMatches } from "@/store/useMatchesStore";
import { useEffect, useState } from "react";
import { FounderMatch } from "@/types/matches";
import toast from "react-hot-toast";
import { useTableStore } from "@/store/useTableStore";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/atoms";
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
      if (typeof window !== "undefined") {
        await getProfile().finally(() => setLoading(false));
        if (!tableLoading) return;
        const matches: FounderMatch[] = await generateMatch(router).finally(
          () => setTableLoading(false)
        );
        setMatches(matches);
        const data = await getIncomingRequests();
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return <>{children}</>;
}

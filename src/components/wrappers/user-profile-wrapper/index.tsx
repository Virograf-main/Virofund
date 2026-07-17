"use client";
import { getMatches } from "@/lib/matches";
import { getProfile } from "@/lib/profile";
import { useMatches } from "@/store/useMatchesStore";
import { useEffect, useState } from "react";
import { FounderMatch } from "@/types/matches";
import { useTableStore } from "@/store/useTableStore";
import { Loader } from "@/components/atoms";
export function UserProfileWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { setLoading: setTableLoading, loading: tableLoading } =
    useTableStore();

  const { setMatches } = useMatches();
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window !== "undefined") {
        await getProfile().finally(() => setLoading(false));
        if (!tableLoading) return;
        const matches: FounderMatch[] = await getMatches().finally(
          () => setTableLoading(false)
        );
        setMatches(matches);
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

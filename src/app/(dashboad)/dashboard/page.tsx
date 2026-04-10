"use client";
import { Button, DataTable, Loader } from "@/components/atoms";
import { Messages } from "@/components/molecules";
import { useRouter } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { RequestSection } from "@/components/pages/dashboard/requestCard";
import type { Column } from "@/components/atoms";
import { endpoints } from "@/config/endpoints";
import { useQuery } from "@tanstack/react-query";
import { instance } from "@/lib/axios";
import { FounderMatch } from "@/types/matches";

export interface TableRow {
  userId: string;
  name: string;
  location: string;
  industry: string;
  skills: string;
  score: ReactNode;
}

export default function Dashboard() {
  const router = useRouter();
  // const { matches, setMatches } = useState<FounderMatch[]>([]);
  const [allMatchedUsers, setMatchedUsers] = useState<FounderMatch[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [foundMatches, setFoundMatches] = useState<FounderMatch[]>([]);

  const columns: Column<TableRow>[] = [
    { header: "Name", accessor: "name" },
    { header: "Location", accessor: "location" },
    { header: "Industry", accessor: "industry" },
    { header: "Skill stack", accessor: "skills" },
    { header: "Match Score", accessor: "score" },
  ];

  const { data: matchedUsers, isLoading } = useQuery({
    queryKey: ["matched-users"],
    queryFn: async () => {
      const res = await instance.post(endpoints().Matches.post_matches);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (matchedUsers) {
      setMatchedUsers(matchedUsers);
    }
  }, [matchedUsers, setMatchedUsers]);
  const sortedMatches = [...allMatchedUsers].sort(
    (a, b) => b.overallScore - a.overallScore,
  );

  const refinedMatches: TableRow[] = (sortedMatches ?? []).map((match) => {
    const percentage = (match.overallScore * 100).toFixed(0);
    return {
      userId: match.matchedFounderId,
      name: match.matchedFounderDetails.name,
      location: match.matchedFounderDetails.location,
      industry: match.matchedFounderDetails.industry,
      skills: match.matchedFounderDetails.skills.join(", "),
      score:
        match.overallScore > 0.5 && match.overallScore < 0.75 ? (
          <span className="text-red-500 font-medium">{percentage}%</span>
        ) : (
          <span className="text-primary font-medium">{percentage}%</span>
        ),
    };
  });

  return (
    <section className="xl:grid xl:grid-cols-[1fr_400px] xl:gap-6 h-full max-h-[600px] md:max-w-full mx-auto">
      {/* Left column */}
      <section className="flex flex-col gap-6 h-full overflow-y-auto scrollbar">
        {isLoading || refinedMatches.length > 0 ? (
          <section className="bg-white py-2 rounded-2xl w-full flex flex-col">
            <div className="flex justify-between items-center px-4 py-2 flex-shrink-0">
              <p className="font-semibold text-[1.2em]">Suggestions</p>
              <Button
                variant="outline"
                className="m-0"
                onClick={() => router.replace("/suggestions")}
              >
                See All
              </Button>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0 px-2">
              <DataTable
                columns={columns}
                data={refinedMatches}
                isLoading={isLoading}
                rowsPerPage={5}
                onRowClick={(row) => router.push(`/profile/${row.userId}`)}
                actions={(row) => (
                  <Button
                    variant="outline"
                    className="text-xs h-7 px-3"
                    onClick={() => router.push(`/profile/${row.userId}`)}
                  >
                    View
                  </Button>
                )}
              />
            </div>
          </section>
        ) : (
          <div className="flex justify-center items-center bg-white rounded-2xl p-10">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold text-[#1C1A16]">No matches yet</h3>
              <p className="text-sm text-gray-400 max-w-[220px]">
                Once we have found a perfect match for you, they will be
                displayed here for you to connect with them
              </p>
              <Button className="mt-2" onClick={() => router.push("/profile")}>
                View Profile
              </Button>
            </div>
          </div>
        )}

        <RequestSection />
      </section>

      {/* Right column - Messages */}
      <div className="hidden xl:block">
        <Suspense fallback={<Loader />}>
          <Messages />
        </Suspense>
      </div>
    </section>
  );
}

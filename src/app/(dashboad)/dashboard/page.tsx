"use client";
import { Button, Column, DataTable } from "@/components/atoms";
import { Messages } from "@/components/molecules";
import { useMatches } from "@/store/useMatchesStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { endpoints } from "@/config/endpoints";
import { useQuery } from "@tanstack/react-query";
import { instance } from "@/lib/axios";
import { RequestSection } from "@/components/pages/dashboard/requestCard";
import { getUserChats } from "@/lib/chats";
import { useUserStore } from "@/store/userStore";

// types/table.ts
export interface TableRow {
  userId: string;
  name: string;
  location: string;
  industry: string;
  skills: string;
  score: React.ReactNode;
}
export default function Dashboard() {
  const { matches, setMatches } = useMatches();
  const { user } = useUserStore();
  const router = useRouter();

  const columns: Column<TableRow>[] = [
    { key: "name", header: "Name" },
    { key: "location", header: "Location" },
    { key: "industry", header: "Industry" },
    { key: "skills", header: "Skill stack" },
    { key: "score", header: "Match Score" },
  ];

  const users = [
    { id: "user1", name: "Derin" },
    { id: "user2", name: "Ti Developer" },
    { id: "user3", name: "Melody" },
  ];

  const { data: matchedUsers } = useQuery({
    queryKey: ["matched-users"],
    queryFn: async () => {
      const res = await instance.get(endpoints().Matches.get_matches);
      return res.data;
    },
  });

  useEffect(() => {
    if (matchedUsers) {
      setMatches(matchedUsers);
    }
  }, [matchedUsers, setMatches]);

  const refinedMatches = matches?.map((match) => {
    const percentage = (match.overallScore * 100).toFixed(0); // round to nearest integer

    const matchScore =
      match.overallScore > 0.5 && match.overallScore < 0.75 ? (
        <span className="text-red-600">{percentage}%</span>
      ) : (
        // percentage
        <span className="text-primary">{percentage}%</span>
      );
    // percentage;

    return {
      userId: match.matchedFounderId,
      name: match.matchedFounderDetails.name,
      location: match.matchedFounderDetails.location,
      industry: match.matchedFounderDetails.industry,
      skills: match.matchedFounderDetails.skills.join(", "),
      score: matchScore,
    };
  });
  const handleRowClick = (row: {
    userId: string;
    name: string;
    location: string;
    industry: string;
    skills: string;
    score: ReactNode;
  }) => {
    // assuming each row has a userId field
    router.push(`/profile/${row.userId}`);
  };

  useEffect(() => {
    const fetchUserChats = async () => {
      if (!user) return;
      const data = await getUserChats(user?.id);
      console.log(data);
    };
    fetchUserChats();
  }, []);

  return (
    <section className="xl:grid xl:grid-cols-[1fr_400px] xl:gap-6 h-[90vh]  max-h-[600px]   md:max-w-full mx-auto">
      {/* Left column - make it scrollable */}
      <section className="flex flex-col gap-6 h-full overflow-y-auto scrollbar">
        {/* Table section - constrain height and make scrollable */}
        {refinedMatches.length > 0 ? (
          <section className="bg-white py-2 rounded-2xl w-full flex flex-col   ">
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

            {/* Table container - this is the key fix */}
            <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
              <DataTable
                className="w-full"
                columns={columns}
                data={refinedMatches}
                rowFn={handleRowClick}
              />
            </div>
          </section>
        ) : (
          <div className="flex justify-center items-center">
            <div className="flex flex-col gap-4">
              <Image
                src="/svg/no-data.svg"
                width={200}
                height={200}
                alt="no data"
              />
              <p className="text-center">No Match Generated</p>
            </div>
          </div>
        )}

        {/* Co-founder Requests section */}
        <RequestSection />
      </section>

      {/* Right column - Messages */}
      <div className="hidden xl:block">
        <Messages />
      </div>
    </section>
  );
}

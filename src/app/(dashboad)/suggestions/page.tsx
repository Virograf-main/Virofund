"use client";
import { Loader } from "@/components/atoms";
import { SuggestionCard } from "@/components/molecules";
import { useGenerateMatch } from "@/features/suggestions/hooks";
import { sendRequest } from "@/lib/matches";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SuggestionPage() {
  const { data: matches = [], isLoading } = useGenerateMatch();
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="font-semibold text-gray-900">No matches yet</h3>
          <p className="text-sm text-gray-400 max-w-[220px]">
            We&apos;re still finding the right co-founders for you. Check back
            soon!
          </p>
        </div>
      </div>
    );
  }

  console.log(matches);

  const sortedMatches = [...matches].sort(
    (a, b) => b.overallScore - a.overallScore,
  );
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-gray-900 mb-1">
        Suggested Co-founders
      </h1>
      <p className="text-sm text-gray-400 mb-6">
        {matches.length} match{matches.length !== 1 ? "es" : ""} found
      </p>

      <div className="flex flex-wrap gap-4">
        {sortedMatches.map((match) => (
          <SuggestionCard
            key={match.id}
            name={match.matchedFounderDetails.name}
            industry={match.matchedFounderDetails.industry}
            founderStatus={match.matchedFounderDetails.founderStatus}
            skills={match.matchedFounderDetails.skills}
            yearsExperience={match.matchedFounderDetails.yearsExperience}
            location={match.matchedFounderDetails.location}
            overallScore={match.overallScore}
            onConnect={async () => {
              setConnectingId(match.matchedFounderId);
              await sendRequest(match.matchedFounderId);
              setConnectingId(null);
            }}
            isConnecting={connectingId === match.matchedFounderId}
            onViewProfile={() =>
              router.push(`/profile/${match.matchedFounderId}`)
            }
          />
        ))}
      </div>
    </div>
  );
}

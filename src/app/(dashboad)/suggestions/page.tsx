"use client";
import { SuggestionCard } from "@/components/molecules";
import { sendRequest } from "@/lib/matches";
import { useMatches } from "@/store/useMatchesStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SuggestionPage() {
  const { matches } = useMatches();
  const router = useRouter();
  if (matches.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="font-semibold text-[#1C1A16]">No matches yet</h3>
          <p className="text-sm text-gray-400 max-w-[220px]">
            We're still finding the right co-founders for you. Check back soon!
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="">
      {matches.map((match, key) => {
        return (
          <SuggestionCard
            key={key}
            name={match.matchedFounderDetails.name}
            title={match.matchedFounderDetails.industry}
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam voluptas laudantium debitis, nostrum sed tempora quas accusamus amet nulla expedita optio voluptatem. Eius animi quas tempora, accusamus nulla eveniet debitis."
            tags={match.matchedFounderDetails.skills}
            onConnect={() => sendRequest(match.matchedFounderId)}
            onViewProfile={() =>
              router.replace(`/profile/${match.matchedFounderId}`)
            }
          />
        );
      })}
    </div>
  );
}

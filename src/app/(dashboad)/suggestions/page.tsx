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

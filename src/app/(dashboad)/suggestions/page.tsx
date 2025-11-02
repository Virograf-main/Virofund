"use client";
import { SuggestionCard } from "@/components/molecules";
import { useMatches } from "@/store/useMatchesStore";

export default function SuggestionPage() {
  const { matches } = useMatches();
  return (
    <div className="flex">
      {/* <SuggestionCard
        name="Jane Doe"
        title="Frontend DEV"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam voluptas laudantium debitis, nostrum sed tempora quas accusamus amet nulla expedita optio voluptatem. Eius animi quas tempora, accusamus nulla eveniet debitis."
        tags={["React", "Typescript", "Tailwind css"]}
      /> */}
      {matches.map((match, key) => {
        return (
          <SuggestionCard
            key={key}
            name={match.matchedFounderDetails.name}
            title={match.matchedFounderDetails.industry}
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam voluptas laudantium debitis, nostrum sed tempora quas accusamus amet nulla expedita optio voluptatem. Eius animi quas tempora, accusamus nulla eveniet debitis."
            tags={match.matchedFounderDetails.skills}
          />
        );
      })}
    </div>
  );
}

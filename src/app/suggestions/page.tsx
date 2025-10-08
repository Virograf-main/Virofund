import SuggestionCard from "@/components/molecules/suggestion-card";

export default function SuggestionPage() {
  return (
    <div className="flex">
      <SuggestionCard
        name="Jane Doe"
        title="Frontend DEV"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam voluptas laudantium debitis, nostrum sed tempora quas accusamus amet nulla expedita optio voluptatem. Eius animi quas tempora, accusamus nulla eveniet debitis."
        tags={["React", "Typescript", "Tailwind css"]}
      />
    </div>
  );
}

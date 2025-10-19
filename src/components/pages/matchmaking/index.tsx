import {
  Div,
  Section,
  MatchCard,
  SectionContainer,
} from "@/components/molecules";
import Link from "next/link";
import { Button, SelectElement } from "@/components/atoms";

export function Matchmaking() {
  return (
    <div>
      <SectionContainer title="Your Matches">
        <Div>
          <MatchCard
            name="Ade Grace"
            email="grad5grace@gmail.com"
            workType="Onsite - Fulltime"
            duration="120h 45m"
            description="A collaborative developer with innovative ideas and industry valued experience and top notch technicality"
            department="Design"
            jobTitle="Creative Director"
            percentage={80}
          />
        </Div>
      </SectionContainer>
    </div>
  );
}

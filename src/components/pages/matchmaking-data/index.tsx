"use client";
import { useEffect, useState } from "react";
import { Button, MultiSelect, SelectElement } from "@/components/atoms";
import { Div, Section } from "@/components/molecules";
import {
  INDUSTRIES,
  SKILL_CATEGORIES,
  LOCATIONS,
  COMMITMENT_LEVELS,
  FINANCIAL_CONTRIBUTIONS,
  FOUNDER_STATUSES,
} from "@/lib/constants";
import { useOnboardingStore } from "@/store/onboardingStore";
import { createProfile } from "@/lib/profile";
import { useRouter } from "next/navigation";

const industries = INDUSTRIES.map((value) => ({
  value,
  label: value,
}));
const skillCategories = SKILL_CATEGORIES.map((value) => ({
  value,
  label: value,
}));
const locations = LOCATIONS.map((value) => ({
  value,
  label: value,
}));
const commitmentLevels = COMMITMENT_LEVELS.map((value) => ({
  value,
  label: value,
}));
const financialContributions = FINANCIAL_CONTRIBUTIONS.map((value) => ({
  value,
  label: value,
}));
const founderStatuses = FOUNDER_STATUSES.map((value) => ({
  value,
  label: value,
}));
const options = [
  {
    label: "We’ll both work unpaid initially and split equity",
    value: "We’ll both work unpaid initially and split equity",
  },
  {
    label: "I can’t pay now, but I’ll offer equity or future pay",
    value: "I can’t pay now, but I’ll offer equity or future pay",
  },
  {
    label: "I’m open to paying a stipend/salary if needed",
    value: "I’m open to paying a stipend/salary if needed",
  },
  {
    label: "Let’s figure it out together",
    value: "Let’s figure it out together",
  },
];

export function MatchmakingData() {
  const { data, updateField } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    setLoading(true);
    const profile = await createProfile(data, router, setLoading);
    console.log(profile);
  };
  return (
    <div className="">
      <Section title="Co-founder Preferences cont'd">
        <Div>
          <SelectElement
            label="What industry would you like your co-founder to be in?"
            items={industries}
            value={data.preferredIndustry}
            onChange={(value) => updateField("preferredIndustry", value)}
          />
          <MultiSelect
            label="What skills do you prefer in a co-founder?"
            items={skillCategories}
            value={data.preferredSkills}
            max={3}
            onChange={(value) => updateField("preferredSkills", value)}
          />
          <SelectElement
            label="Where would you like your co-founder to be located?"
            items={locations}
            value={data.preferredLocation}
            onChange={(value) => updateField("preferredLocation", value)}
          />
          <SelectElement
            label="What level of commitment do you want from a co-founder?"
            items={commitmentLevels}
            value={data.preferredCommitmentLevel}
            onChange={(value) => updateField("preferredCommitmentLevel", value)}
          />
          <SelectElement
            label="Do you expect your co-founder to contribute financially?"
            items={financialContributions}
            value={data.preferredFinancial}
            onChange={(value) => updateField("preferredFinancial", value)}
          />
          <SelectElement
            label="What is your preferred co-founder status?"
            items={founderStatuses}
            value={data.preferredFounderType}
            onChange={(value) => updateField("preferredFounderType", value)}
          />
          <SelectElement
            label="What are your expectations around compensation?"
            items={options}
          />
        </Div>
      </Section>
      <Button className="w-full" onClick={handleCreate} disabled={loading}>
        {loading ? "Loading..." : "Finish"}
      </Button>
    </div>
  );
}

"use client";
import {
  Button,
  MultiSelect,
  SelectElement,
  Textarea,
} from "@/components/atoms";
import { Div, Section } from "@/components/molecules";
import { PERSONALITY_TRAITS } from "@/lib/constants";
import { useOnboardingStore } from "@/store/onboardingStore";
import Link from "next/link";
import { useEffect } from "react";

const personalityTraits = PERSONALITY_TRAITS.map((trait) => ({
  label: trait,
  value: trait,
}));
const agePreferences = [
  { label: "No preference", value: "no_preference" },
  { label: "18–25", value: "18-25" },
  { label: "26–35", value: "26-35" },
  { label: "36–45", value: "36-45" },
  { label: "46+", value: "46+" },
];
const experiencePreferences = [
  { label: "No preference", value: "no_preference" },
  { label: "1–3", value: "1-3" },
  { label: "4–6", value: "4-6" },
  { label: "7+", value: "7+" },
];
const genderPreferences = [
  { label: "No preference", value: "no_preference" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export function CofounderProfile() {
  const { data, updateField } = useOnboardingStore();
  return (
    <div>
      <Section title="Co-founder Preferences">
        <Div>
          <SelectElement
            label="Do you currently have a co-founder"
            items={[
              { label: "No", value: "no" },
              { label: "Yes", value: "yes" },
            ]}
          />
          <Textarea
            label="What past successes or failures (if any) have you had in startups or business?"
            placeholder="Add a brief description here"
            rows={8}
          />
          <MultiSelect
            label="What personality traits would you prefer in a co-founder?"
            items={personalityTraits}
            placeholder="Select up to 3"
            max={3}
            value={data.preferredPersonalityTraits}
            onChange={(value) =>
              updateField("preferredPersonalityTraits", value)
            }
          />
          <SelectElement
            label="What is your age range preference for a co-founder? (Optional)"
            placeholder="Optional"
            items={agePreferences}
          />
          <SelectElement
            label="Do you have any preference for your co-founder's gender? (Optional)"
            placeholder="Optional"
            items={genderPreferences}
          />
          <SelectElement
            label="What level of experience should your co-founder have?"
            placeholder="Optional"
            items={experiencePreferences}
          />
        </Div>
      </Section>
      <Link href="/matchmaking-data">
        <Button>Next</Button>
      </Link>
    </div>
  );
}

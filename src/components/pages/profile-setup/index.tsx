"use client";
import { Div, Section } from "@/components/molecules";
import {
  Button,
  Input,
  MultiSelect,
  ProfilePicture,
  SelectElement,
  Textarea,
} from "@/components/atoms";
import {
  COMMITMENT_LEVELS,
  PERSONALITY_TRAITS,
  FINANCIAL_CONTRIBUTIONS,
} from "@/lib/constants";
import { useOnboardingStore } from "@/store/onboardingStore";
import Link from "next/link";
import { useEffect } from "react";

const commitmentLevels = COMMITMENT_LEVELS.map((value) => ({
  value,
  label: value,
}));

const personalityTraits = PERSONALITY_TRAITS.map((value) => ({
  value,
  label: value,
}));

const financialContributions = FINANCIAL_CONTRIBUTIONS.map((value) => ({
  value,
  label: value,
}));

const riskManagement = [
  "Conservative",
  "Moderate",
  "Aggressive",
  "Calculated Risk-taker",
  "Risk-averse",
];

const riskManagementStyles = riskManagement.map((value) => ({
  value,
  label: value,
}));

export function ProfileSetup() {
  const { data, updateField } = useOnboardingStore();
  return (
    <div>
      <Section title="Let's setup your profile">
        <Div>
          <ProfilePicture
            value="/jpg/blank-profile.webp"
            className="m-auto md:m-0"
          />
          <Input
            label="Preferred username (optional)"
            type="text"
            placeholder="John Doe"
            value={data.userName}
            onChange={(e) => updateField("userName", e.target.value)}
          />
          <Textarea
            label="Write a short bio about yourself and what you do."
            placeholder="Add bio"
            rows={10}
            value={data.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </Div>
      </Section>
      <Section title="Contribution and personality">
        <Div>
          <SelectElement
            placeholder="Select one"
            items={commitmentLevels}
            label="How much time can you commit?"
            value={data.commitmentLevel}
            onChange={(value) => updateField("commitmentLevel", value)}
          />
          <MultiSelect
            placeholder="Select up to 3"
            items={personalityTraits}
            label="What best describes your personality"
            max={3}
            value={data.personalityTraits}
            onChange={(value) => updateField("personalityTraits", value)}
          />
          <SelectElement
            label="How are you willing to contribute financially"
            placeholder="Select one"
            items={financialContributions}
            value={data.financialContribution}
            onChange={(value) => updateField("financialContribution", value)}
          />
          <SelectElement
            label="How do you handle risk and uncertainty?"
            placeholder="Select one"
            items={riskManagementStyles}
            value={data.riskManagementStyle}
            onChange={(value) => updateField("riskManagementStyle", value)}
          />
        </Div>
      </Section>
      <Section title="Additional Information">
        <Div>
          <Input
            label="Current occupation"
            type="text"
            placeholder="Student"
            value={data.currentOccupation}
            onChange={(e) => updateField("currentOccupation", e.target.value)}
          />
        </Div>
      </Section>
      <Link href="/cofounder-preference">
        <Button>Next</Button>
      </Link>
    </div>
  );
}

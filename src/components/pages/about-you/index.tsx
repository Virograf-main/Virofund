"use client";
import {
  Button,
  DatePicker,
  Input,
  MultiSelect,
  SelectElement,
} from "@/components/atoms";
import { Div, Section } from "@/components/molecules";
import {
  LOCATIONS,
  INDUSTRIES,
  FOUNDER_STATUSES,
  SKILL_CATEGORIES,
} from "@/lib/constants";
import Link from "next/link";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useEffect } from "react";

const gender = [
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
];

const locations = LOCATIONS.map((value: string) => {
  return { value: value, label: value };
});
const industries = INDUSTRIES.map((value: string) => {
  return { value: value, label: value };
});
const founderStatuses = FOUNDER_STATUSES.map((value: string) => {
  return { value: value, label: value };
});
const skillCategories = SKILL_CATEGORIES.map((value) => {
  return { value: value, label: value };
});

const decideBoolean = [
  {
    value: "yes",
    label: "Yes",
  },
  {
    value: "no",
    label: "No",
  },
];
const roles = [
  {
    value: "technical",
    label: "Technical",
  },
  {
    value: "business",
    label: "Business",
  },
  {
    value: "creative",
    label: "Creative",
  },
  {
    value: "other",
    label: "Other",
  },
];

export function AboutYou() {
  const { data, updateField } = useOnboardingStore();
  return (
    <div>
      <Section title="Tell us about yourself">
        <Div>
          <SelectElement
            label="Gender"
            placeholder="Select Gender"
            items={gender}
          />
          <DatePicker label="Date of birth" placeholder="pick a date" />
          <SelectElement
            label="Location"
            placeholder="Select Location"
            items={locations}
            value={data.location}
            onChange={(value) => updateField("location", value)}
          />
        </Div>
      </Section>
      <Section title="Industry & Experience">
        <Div>
          <SelectElement
            label="Are you a first time founder?"
            placeholder="Select one"
            items={decideBoolean}
          />
          <SelectElement
            items={industries}
            label="What industry do you work in?"
            value={data.industry}
            onChange={(value) => updateField("industry", value)}
          />
        </Div>
      </Section>
      <Section title="Founder status & Experience ">
        <Div>
          <Input
            label="How many years of experience do you have in your field?"
            placeholder="4"
            type="number"
            value={data.yearsExperience?.toString() ?? ""}
            onChange={(e) =>
              updateField("yearsExperience", Number(e.target.value))
            }
          />

          <SelectElement
            label="What is your current status as a founder?"
            items={founderStatuses}
            value={data.founderStatus}
            onChange={(value) => updateField("founderStatus", value)}
          />
          <SelectElement
            label="What best describes your role"
            placeholder="Select one"
            items={roles}
          />
        </Div>
      </Section>
      <Section title="Skills & Profile">
        <Div>
          <MultiSelect
            label="What are your top 3 skills"
            items={skillCategories}
            value={data.skills}
            onChange={(value) => updateField("skills", value)}
            max={3}
          />
          <Input
            label="Linkedin Profile URL"
            placeholder="https://linkedin.com/..."
            type="text"
          />
        </Div>
      </Section>
      <Link href="/profile-setup">
        <Button>Next</Button>
      </Link>
    </div>
  );
}

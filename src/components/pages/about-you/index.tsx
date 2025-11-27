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
import { useEffect, useState } from "react";
import { formatDateToYMD } from "@/lib/helpers";

const gender = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
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
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];
const roles = ["Remote", "Hybrid", "On-site"];

const workStyles = roles.map((value) => {
  return { value: value, label: value };
});

export function AboutYou() {
  const { data, updateField } = useOnboardingStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const disabled = !data.gender || !date || !data.location || !data.industry;

  return (
    <div>
      <Section title="Tell us about yourself">
        <Div>
          <SelectElement
            label="Gender"
            placeholder="Select Gender"
            items={gender}
            value={data.gender}
            onChange={(value) => updateField("gender", value)}
          />
          <DatePicker
            label="Date of birth"
            placeholder="pick a date"
            value={date}
            onChange={(value) => {
              setDate(value);
              updateField("dateOfBirth", formatDateToYMD(value));
            }}
          />
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
            label="Do you already have a startup?"
            placeholder="Select one"
            items={decideBoolean}
            value={String(data.hasStartup)}
            onChange={(value) => updateField("hasStartup", value === "true")}
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
            label="What best describes your preferred work style?"
            placeholder="Select one"
            items={workStyles}
            value={data.workStyle}
            onChange={(value) => updateField("workStyle", value)}
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
            value={data.linkedInUrl}
            onChange={(e) => updateField("linkedInUrl", e.target.value)}
          />
        </Div>
      </Section>
      <Link href="/profile-setup">
        <Button className="w-full">Next</Button>
      </Link>
    </div>
  );
}

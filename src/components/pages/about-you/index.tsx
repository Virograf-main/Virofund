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
import { useOnboardingStore } from "@/store/onboardingStore";
import { useEffect, useState } from "react";
import { formatDateToYMD } from "@/lib/helpers";
import { useRouter } from "next/navigation"; // Add this import

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
  const router = useRouter(); // For programmatic navigation
  const { data, updateField } = useOnboardingStore();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Optional: Sync date from store if needed (e.g., on mount)
  useEffect(() => {
    if (data.dateOfBirth) {
      setDate(new Date(data.dateOfBirth));
    }
  }, [data.dateOfBirth]);

  // Auto-dismiss alert after 7 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    if (!data.gender) newErrors.gender = "Gender is required";
    if (!data.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (!data.location) newErrors.location = "Location is required";
    if (!data.industry) newErrors.industry = "Industry is required";

    // Add more validations if other fields are required, e.g.:
    if (!data.yearsExperience) newErrors.yearsExperience = "Years of experience is required";
    if (!data.founderStatus) newErrors.founderStatus = "Founder status is required";
    // if (data.skills.length < 3) newErrors.skills = "Select at least 3 skills"; // Example for MultiSelect
    if (!data.linkedInUrl) newErrors.linkedInUrl = "LinkedIn URL is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const fieldDisplayNames: Record<string, string> = {
        gender: "Gender",
        dateOfBirth: "Date of Birth",
        location: "Location",
        industry: "Industry",
        yearsExperience: "Years of Experience",
        founderStatus: "Founder Status",
        linkedInUrl: "LinkedIn Profile URL",   // ← fixed nicely here
        // Add more fields later if needed
      };
      if (Object.keys(newErrors).length > 4) {
        setAlertMessage("Whoa, looks like a lot is missing! Please fill out all required fields to continue.");
      } else {
        const missedFields = Object.keys(newErrors)
          .map((key) => fieldDisplayNames[key] || key)  // use nice name if exists, fallback to key
          .join(", ");

        setAlertMessage(`Please fill in the following fields: ${missedFields}`);
      }
      setShowAlert(true);
      return;
    }
    // If valid, clear errors/alert and navigate
    setErrors({});
    setShowAlert(false);
    router.push("/profile-setup");
  };

  return (
    <div>
   
      {showAlert && (
  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 max-w-md w-full z-50 
                  flex items-center gap-4 p-4 rounded-xl border border-destructive/20 
                  bg-card/95 backdrop-blur-sm shadow-2xl shadow-destructive/10 
                  animate-in fade-in zoom-in duration-300">
    
    {/* Round Svg alert icon*/}
    <div className="flex-shrink-0 w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
      <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    {/* Message */}
    <div className="flex-1">
      <h3 className="text-sm font-bold text-destructive">Attention Required</h3>
      <p className="text-xs text-destructive/80 leading-relaxed">{alertMessage}</p>
    </div>

    {/* Close X Button */}
    <button
      onClick={() => setShowAlert(false)}
      className="p-1.5 rounded-lg text-destructive/60 hover:bg-destructive/10 hover:text-destructive transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
)}
      <Section title="Tell us about yourself">
        <Div>
          <SelectElement
            label="Gender"
            placeholder="Select Gender"
            items={gender}
            value={data.gender}
            onChange={(value) => updateField("gender", value)}
            error={!!errors.gender} // Pass error prop (add to your SelectElement if needed)
          />
          <DatePicker
            label="Date of birth"
            placeholder="pick a date"
            value={date}
            onChange={(value) => {
              setDate(value);
              updateField("dateOfBirth", formatDateToYMD(value));
            }}
            error={!!errors.dateOfBirth} // Pass error prop (add to your DatePicker if needed)
          />
          <SelectElement
            label="Location"
            placeholder="Select Location"
            items={locations}
            value={data.location}
            onChange={(value) => updateField("location", value)}
            error={!!errors.location}
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
            error={!!errors.industry}
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
            error={!!errors.yearsExperience} // If you make this required
          />

          <SelectElement
            label="What is your current status as a founder?"
            items={founderStatuses}
            value={data.founderStatus}
            onChange={(value) => updateField("founderStatus", value)}
            error={!!errors.founderStatus} // If required
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
            error={!!errors.skills} // If required
          />
          <Input
            label="Linkedin Profile URL"
            placeholder="https://linkedin.com/..."
            type="text"
            value={data.linkedInUrl}
            onChange={(e) => updateField("linkedInUrl", e.target.value)}
            error={!!errors.linkedInUrl}
          />
        </Div>
      </Section>
      <Button onClick={handleNext} className="w-full">
        Next
      </Button>
    </div>
  );
}
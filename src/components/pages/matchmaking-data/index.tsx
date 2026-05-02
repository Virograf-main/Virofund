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
import { ChevronLeft } from "lucide-react";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const router = useRouter();

  // Auto-dismiss alert after 7 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleCreate = async () => {
    const newErrors: { [key: string]: string } = {};

    // Required fields for matchmaking
    if (!data.preferredIndustry) {
      newErrors.preferredIndustry = "Preferred industry is required";
    }

    if ((data.preferredSkills ?? []).length === 0) {
      newErrors.preferredSkills = "Please select at least one preferred skill";
    }

    if (!data.preferredLocation) {
      newErrors.preferredLocation = "Preferred location is required";
    }

    if (!data.preferredCommitmentLevel) {
      newErrors.preferredCommitmentLevel = "Preferred commitment level is required";
    }

    if (!data.preferredFinancial) {
      newErrors.preferredFinancial = "Financial expectation is required";
    }

    if (!data.preferredFounderType) {
      newErrors.preferredFounderType = "Preferred founder status is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 4) {
        setAlertMessage(
          "Whoa, looks like a lot is missing! Please complete your matchmaking preferences."
        );
      } else {
        const missedFields = Object.keys(newErrors)
          .map((key) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"))
          .join(", ");

        setAlertMessage(`Please fill in: ${missedFields}`);
      }

      setShowAlert(true);
      return;
    }

    // All good → proceed to create profile
    setErrors({});
    setShowAlert(false);

    setLoading(true);
    try {
      const profile = await createProfile(data, router, setLoading);
      console.log("Profile created:", profile);
      // Optional: router.push("/dashboard") or success page
    } catch (error) {
      console.error("Profile creation failed:", error);
      setAlertMessage("Something went wrong while creating your profile. Please try again.");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
        {showAlert && (
  <div className="fixed top-6 left-1/2 transform -translate-x-1/2 max-w-md w-full z-50 
                  flex items-center gap-4 p-4 rounded-xl border border-red-200 
                  bg-white/95 backdrop-blur-sm shadow-2xl shadow-red-200/50 
                  animate-in fade-in zoom-in duration-300">
    
    {/* Round Svg alert icon*/}
    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    {/* Message */}
    <div className="flex-1">
      <h3 className="text-sm font-bold text-red-900">Attention Required</h3>
      <p className="text-xs text-red-700 leading-relaxed">{alertMessage}</p>
    </div>

    {/* Close X Button */}
    <button
      onClick={() => setShowAlert(false)}
      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
)}
<div>
  <ChevronLeft onClick={router.back}/>
</div>

      <Section title="Co-founder Preferences cont'd">
        <Div>
          <SelectElement
            label="What industry would you like your co-founder to be in?"
            items={industries}
            value={data.preferredIndustry}
            onChange={(value) => updateField("preferredIndustry", value)}
            placeholder="Select industry"
            error={!!errors.preferredIndustry}
          />

          <MultiSelect
            label="What skills do you prefer in a co-founder?"
            items={skillCategories}
            value={data.preferredSkills}
            max={3}
            onChange={(value) => updateField("preferredSkills", value)}
            placeholder="Select up to 3 skills"
            error={!!errors.preferredSkills}
          />

          <SelectElement
            label="Where would you like your co-founder to be located?"
            items={locations}
            value={data.preferredLocation}
            onChange={(value) => updateField("preferredLocation", value)}
            placeholder="Select location"
            error={!!errors.preferredLocation}
          />

          <SelectElement
            label="What level of commitment do you want from a co-founder?"
            items={commitmentLevels}
            value={data.preferredCommitmentLevel}
            onChange={(value) => updateField("preferredCommitmentLevel", value)}
            placeholder="Select commitment level"
            error={!!errors.preferredCommitmentLevel}
          />

          <SelectElement
            label="Do you expect your co-founder to contribute financially?"
            items={financialContributions}
            value={data.preferredFinancial}
            onChange={(value) => updateField("preferredFinancial", value)}
            placeholder="Select financial expectation"
            error={!!errors.preferredFinancial}
          />

          <SelectElement
            label="What is your preferred co-founder status?"
            items={founderStatuses}
            value={data.preferredFounderType}
            onChange={(value) => updateField("preferredFounderType", value)}
            placeholder="Select founder status"
            error={!!errors.preferredFounderType}
          />

          <SelectElement
            label="What are your expectations around compensation?"
            items={options}
            placeholder="Select compensation expectation"
            error={!!errors.preferredCompensation}
          />
        </Div>
      </Section>

      <Button
        className="w-full"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "Creating profile..." : "Finish"}
      </Button>
    </div>
  );
}
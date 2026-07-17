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
import { createProfile } from "@/lib/profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { data, updateField } = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Auto-dismiss alert after 7 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleNext = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!data.userName?.trim()) newErrors.userName = "Preferred username is required";
    if (!data.bio?.trim()) newErrors.bio = "Bio is required";
    if (!data.commitmentLevel) newErrors.commitmentLevel = "Commitment level is required";
    if (data.personalityTraits?.length === 0) newErrors.personalityTraits = "At least one personality trait is required";
    if (!data.financialContribution) newErrors.financialContribution = "Financial contribution is required";
    if (!data.riskManagementStyle) newErrors.riskManagementStyle = "Risk management style is required";
    if (!data.currentOccupation?.trim()) newErrors.currentOccupation = "Current occupation is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 4) {
        setAlertMessage("Whoa, looks like a lot is missing! Please fill out all required fields to continue.");
      } else {
        const missedFields = Object.keys(newErrors)
          .map(
            (key) =>
              key.charAt(0).toUpperCase() +
              key.slice(1).replace(/([A-Z])/g, " $1")
          )
          .join(", ");
        setAlertMessage(`Please fill in the following fields: ${missedFields}`);
      }
      setShowAlert(true);
      return;
    }

    // If valid, clear errors/alert and create profile
    setErrors({});
    setShowAlert(false);
    setLoading(true);
    try {
      await createProfile(data, router, setLoading);
    } catch (error) {
      console.error("Profile creation failed:", error);
      setAlertMessage("Something went wrong while creating your profile. Please try again.");
      setShowAlert(true);
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Alert Banner - Fixed, centered, shorter width, auto-dismiss */}
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
            error={!!errors.bio}
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
            error={!!errors.commitmentLevel}
          />
          <MultiSelect
            placeholder="Select up to 3"
            items={personalityTraits}
            label="What best describes your personality"
            max={3}
            value={data.personalityTraits}
            onChange={(value) => updateField("personalityTraits", value)}
            error={!!errors.personalityTraits}
          />
          <SelectElement
            label="How are you willing to contribute financially"
            placeholder="Select one"
            items={financialContributions}
            value={data.financialContribution}
            onChange={(value) => updateField("financialContribution", value)}
            error={!!errors.financialContribution}
          />
          <SelectElement
            label="How do you handle risk and uncertainty?"
            placeholder="Select one"
            items={riskManagementStyles}
            value={data.riskManagementStyle}
            onChange={(value) => updateField("riskManagementStyle", value)}
            error={!!errors.riskManagementStyle}
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
            error={!!errors.currentOccupation}
          />
          <Textarea
            label="What past successes or failures (if any) have you had in startups or business?"
            placeholder="Add a brief description here"
            rows={6}
            value={data.pastExperience}
            onChange={(e) => updateField("pastExperience", e.target.value)}
          />
        </Div>
      </Section>
      <Button onClick={handleNext} disabled={loading}>
        {loading ? "Creating profile..." : "Finish"}
      </Button>
    </div>
  );
}
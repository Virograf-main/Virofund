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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

const hasCofounderOptions = [
  { label: "No", value: "no" },
  { label: "Yes", value: "yes" },
];

export function CofounderProfile() {
  const router = useRouter();
  const { data, updateField } = useOnboardingStore();

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

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};


    if (!data.pastExperience?.trim()) {
      newErrors.pastExperience = "Please describe your past startup/business experience";
    }

    if ((data.preferredPersonalityTraits ?? []).length === 0) {
      newErrors.preferredPersonalityTraits = "Select at least one preferred personality trait";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 4) {
        setAlertMessage(
          "Whoa, looks like a lot is missing! Please fill out all required fields to continue."
        );
      } else {
        const missedFields = Object.keys(newErrors)
          .map((key) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"))
          .join(", ");

        setAlertMessage(`Please fill in the following fields: ${missedFields}`);
      }

      setShowAlert(true);
      return;
    }

    // All good → proceed
    setErrors({});
    setShowAlert(false);
    router.push("/matchmaking-data");
  };

  return (
    <div>
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

      <Section title="Co-founder Preferences">
        <Div>
          <SelectElement
            label="Do you currently have a co-founder"
            items={hasCofounderOptions}
            placeholder="Select one"
            error={!!errors.hasCofounder}
          />

          <Textarea
            label="What past successes or failures (if any) have you had in startups or business?"
            placeholder="Add a brief description here"
            rows={8}
            value={data.pastExperience}
            onChange={(e) => updateField("pastExperience", e.target.value)}
            error={!!errors.pastExperience}
          />

          <MultiSelect
            label="What personality traits would you prefer in a co-founder?"
            items={personalityTraits}
            placeholder="Select up to 3"
            max={3}
            value={data.preferredPersonalityTraits}
            onChange={(value) => updateField("preferredPersonalityTraits", value)}
            error={!!errors.preferredPersonalityTraits}
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

      <Button onClick={handleNext} className="w-full">
        Next
      </Button>
    </div>
  );
}
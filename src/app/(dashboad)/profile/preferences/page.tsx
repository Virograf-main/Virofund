"use client";

import { Button, MultiSelect, SelectElement } from "@/components/atoms";
import { Div, Section } from "@/components/molecules";
import { updatePreferences } from "@/lib/profile";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  INDUSTRIES,
  SKILL_CATEGORIES,
  LOCATIONS,
  COMMITMENT_LEVELS,
  FINANCIAL_CONTRIBUTIONS,
  FOUNDER_STATUSES,
  PERSONALITY_TRAITS,
} from "@/lib/constants";
import { ArrowLeft, Save, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

const industries = INDUSTRIES.map((v) => ({ value: v, label: v }));
const skillCategories = SKILL_CATEGORIES.map((v) => ({ value: v, label: v }));
const locations = LOCATIONS.map((v) => ({ value: v, label: v }));
const commitmentLevels = COMMITMENT_LEVELS.map((v) => ({ value: v, label: v }));
const financialContributions = FINANCIAL_CONTRIBUTIONS.map((v) => ({ value: v, label: v }));
const founderStatuses = FOUNDER_STATUSES.map((v) => ({ value: v, label: v }));
const personalityTraits = PERSONALITY_TRAITS.map((v) => ({ value: v, label: v }));

interface PreferencesForm {
  preferredIndustry: string;
  preferredSkills: string[];
  preferredLocation: string;
  preferredCommitmentLevel: string;
  preferredFinancial: string;
  preferredFounderType: string;
  preferredPersonalityTraits: string[];
}

export default function PreferencesPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<PreferencesForm>({
    preferredIndustry: "",
    preferredSkills: [],
    preferredLocation: "",
    preferredCommitmentLevel: "",
    preferredFinancial: "",
    preferredFounderType: "",
    preferredPersonalityTraits: [],
  });

  // Clear the one-time preferences prompt flag on mount
  useEffect(() => {
    localStorage.removeItem("showPreferencesPrompt");
  }, []);

  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      setForm({
        preferredIndustry: p.preferredIndustry || "",
        preferredSkills: p.preferredSkills || [],
        preferredLocation: p.preferredLocation || "",
        preferredCommitmentLevel: p.preferredCommitmentLevel || "",
        preferredFinancial: p.preferredFinancial || "",
        preferredFounderType: p.preferredFounderType || "",
        preferredPersonalityTraits: p.preferredPersonalityTraits || [],
      });
    }
  }, [user]);

  const updateField = <K extends keyof PreferencesForm>(
    field: K,
    value: PreferencesForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const result = await updatePreferences({
      preferredIndustry: form.preferredIndustry,
      preferredSkills: form.preferredSkills,
      preferredLocation: form.preferredLocation,
      preferredCommitmentLevel: form.preferredCommitmentLevel,
      preferredFinancial: form.preferredFinancial,
      preferredFounderType: form.preferredFounderType,
      preferredPersonalityTraits: form.preferredPersonalityTraits,
    });
    if (result) {
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1500);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="p-2 rounded-lg hover:bg-secondary transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Co-founder Preferences</h1>
            <p className="text-muted-foreground text-sm">
              Tell us what you&apos;re looking for in a co-founder to improve your matches
            </p>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/10">
          <CheckCircle className="w-5 h-5 text-primary" />
          <p className="text-sm text-primary font-medium">
            Preferences saved successfully! Redirecting...
          </p>
        </div>
      )}

      <div className="space-y-6">
        <Section title="Co-founder Preferences">
          <Div>
            <SelectElement
              label="What industry would you like your co-founder to be in?"
              items={industries}
              value={form.preferredIndustry}
              onChange={(value) => updateField("preferredIndustry", value)}
              placeholder="Select industry"
            />

            <MultiSelect
              label="What skills do you prefer in a co-founder?"
              items={skillCategories}
              value={form.preferredSkills}
              max={3}
              onChange={(value) => updateField("preferredSkills", value)}
              placeholder="Select up to 3 skills"
            />

            <SelectElement
              label="Where would you like your co-founder to be located?"
              items={locations}
              value={form.preferredLocation}
              onChange={(value) => updateField("preferredLocation", value)}
              placeholder="Select location"
            />

            <SelectElement
              label="What level of commitment do you want from a co-founder?"
              items={commitmentLevels}
              value={form.preferredCommitmentLevel}
              onChange={(value) => updateField("preferredCommitmentLevel", value)}
              placeholder="Select commitment level"
            />

            <SelectElement
              label="Do you expect your co-founder to contribute financially?"
              items={financialContributions}
              value={form.preferredFinancial}
              onChange={(value) => updateField("preferredFinancial", value)}
              placeholder="Select financial expectation"
            />

            <SelectElement
              label="What is your preferred co-founder status?"
              items={founderStatuses}
              value={form.preferredFounderType}
              onChange={(value) => updateField("preferredFounderType", value)}
              placeholder="Select founder status"
            />

            <MultiSelect
              label="What personality traits would you prefer in a co-founder?"
              items={personalityTraits}
              placeholder="Select up to 3"
              max={3}
              value={form.preferredPersonalityTraits}
              onChange={(value) => updateField("preferredPersonalityTraits", value)}
            />
          </Div>
        </Section>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t">
        <Link href="/profile" className="flex-1">
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
        </Link>
        <Button
          className="flex-1"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

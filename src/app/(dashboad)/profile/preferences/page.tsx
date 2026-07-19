"use client";

import { Button, MultiSelect, SelectElement } from "@/components/atoms";
import { Div, Section, EditableField } from "@/components/molecules";
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
import { valuesEqual } from "@/lib/helpers";
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

const emptyForm: PreferencesForm = {
  preferredIndustry: "",
  preferredSkills: [],
  preferredLocation: "",
  preferredCommitmentLevel: "",
  preferredFinancial: "",
  preferredFounderType: "",
  preferredPersonalityTraits: [],
};

export default function PreferencesPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<PreferencesForm>(emptyForm);
  // Last-saved values — used to compute what's dirty and what to revert to.
  const [original, setOriginal] = useState<PreferencesForm>(emptyForm);

  // Per-field save state, keyed by field name
  const [savingFields, setSavingFields] = useState<Set<string>>(new Set());
  const [justSavedFields, setJustSavedFields] = useState<Set<string>>(new Set());

  // Clear the one-time preferences prompt flag on mount
  useEffect(() => {
    localStorage.removeItem("showPreferencesPrompt");
  }, []);

  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      const loaded: PreferencesForm = {
        preferredIndustry: p.preferredIndustry || "",
        preferredSkills: p.preferredSkills || [],
        preferredLocation: p.preferredLocation || "",
        preferredCommitmentLevel: p.preferredCommitmentLevel || "",
        preferredFinancial: p.preferredFinancial || "",
        preferredFounderType: p.preferredFounderType || "",
        preferredPersonalityTraits: p.preferredPersonalityTraits || [],
      };
      setForm(loaded);
      setOriginal(loaded);
    }
  }, [user]);

  const updateField = <K extends keyof PreferencesForm>(
    field: K,
    value: PreferencesForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isDirty = <K extends keyof PreferencesForm>(field: K) =>
    !valuesEqual(form[field], original[field]);

  const flashSaved = (field: keyof PreferencesForm) => {
    setJustSavedFields((prev) => new Set(prev).add(field as string));
    setTimeout(() => {
      setJustSavedFields((prev) => {
        const next = new Set(prev);
        next.delete(field as string);
        return next;
      });
    }, 2000);
  };

  // Saves just this one preference field, independent of the rest.
  const saveField = async <K extends keyof PreferencesForm>(field: K) => {
    setSavingFields((prev) => new Set(prev).add(field as string));
    const result = await updatePreferences({ [field]: form[field] });
    if (result) {
      setOriginal((prev) => ({ ...prev, [field]: form[field] }));
      flashSaved(field);
    }
    setSavingFields((prev) => {
      const next = new Set(prev);
      next.delete(field as string);
      return next;
    });
  };

  const cancelField = <K extends keyof PreferencesForm>(field: K) => {
    setForm((prev) => ({ ...prev, [field]: original[field] }));
  };

  const dirtyFields = (Object.keys(form) as (keyof PreferencesForm)[]).filter(
    (key) => isDirty(key)
  );

  const handleSaveAll = async () => {
    if (dirtyFields.length === 0) return;
    setSaving(true);
    setSuccess(false);
    // Only send the fields that actually changed.
    const diff = dirtyFields.reduce((acc, key) => {
      acc[key] = form[key] as never;
      return acc;
    }, {} as Partial<PreferencesForm>);
    const result = await updatePreferences(diff);
    if (result) {
      setOriginal((prev) => ({ ...prev, ...diff }));
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
              Tell us what you&apos;re looking for in a co-founder to improve your matches — each answer saves on its own
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
            <EditableField
              label="What industry would you like your co-founder to be in?"
              dirty={isDirty("preferredIndustry")}
              saving={savingFields.has("preferredIndustry")}
              justSaved={justSavedFields.has("preferredIndustry")}
              onSave={() => saveField("preferredIndustry")}
              onCancel={() => cancelField("preferredIndustry")}
            >
              <SelectElement
                items={industries}
                value={form.preferredIndustry}
                onChange={(value) => updateField("preferredIndustry", value)}
                placeholder="Select industry"
              />
            </EditableField>

            <EditableField
              label="What skills do you prefer in a co-founder?"
              dirty={isDirty("preferredSkills")}
              saving={savingFields.has("preferredSkills")}
              justSaved={justSavedFields.has("preferredSkills")}
              onSave={() => saveField("preferredSkills")}
              onCancel={() => cancelField("preferredSkills")}
            >
              <MultiSelect
                label=""
                items={skillCategories}
                value={form.preferredSkills}
                max={3}
                onChange={(value) => updateField("preferredSkills", value)}
                placeholder="Select up to 3 skills"
              />
            </EditableField>

            <EditableField
              label="Where would you like your co-founder to be located?"
              dirty={isDirty("preferredLocation")}
              saving={savingFields.has("preferredLocation")}
              justSaved={justSavedFields.has("preferredLocation")}
              onSave={() => saveField("preferredLocation")}
              onCancel={() => cancelField("preferredLocation")}
            >
              <SelectElement
                items={locations}
                value={form.preferredLocation}
                onChange={(value) => updateField("preferredLocation", value)}
                placeholder="Select location"
              />
            </EditableField>

            <EditableField
              label="What level of commitment do you want from a co-founder?"
              dirty={isDirty("preferredCommitmentLevel")}
              saving={savingFields.has("preferredCommitmentLevel")}
              justSaved={justSavedFields.has("preferredCommitmentLevel")}
              onSave={() => saveField("preferredCommitmentLevel")}
              onCancel={() => cancelField("preferredCommitmentLevel")}
            >
              <SelectElement
                items={commitmentLevels}
                value={form.preferredCommitmentLevel}
                onChange={(value) => updateField("preferredCommitmentLevel", value)}
                placeholder="Select commitment level"
              />
            </EditableField>

            <EditableField
              label="Do you expect your co-founder to contribute financially?"
              dirty={isDirty("preferredFinancial")}
              saving={savingFields.has("preferredFinancial")}
              justSaved={justSavedFields.has("preferredFinancial")}
              onSave={() => saveField("preferredFinancial")}
              onCancel={() => cancelField("preferredFinancial")}
            >
              <SelectElement
                items={financialContributions}
                value={form.preferredFinancial}
                onChange={(value) => updateField("preferredFinancial", value)}
                placeholder="Select financial expectation"
              />
            </EditableField>

            <EditableField
              label="What is your preferred co-founder status?"
              dirty={isDirty("preferredFounderType")}
              saving={savingFields.has("preferredFounderType")}
              justSaved={justSavedFields.has("preferredFounderType")}
              onSave={() => saveField("preferredFounderType")}
              onCancel={() => cancelField("preferredFounderType")}
            >
              <SelectElement
                items={founderStatuses}
                value={form.preferredFounderType}
                onChange={(value) => updateField("preferredFounderType", value)}
                placeholder="Select founder status"
              />
            </EditableField>

            <EditableField
              label="What personality traits would you prefer in a co-founder?"
              dirty={isDirty("preferredPersonalityTraits")}
              saving={savingFields.has("preferredPersonalityTraits")}
              justSaved={justSavedFields.has("preferredPersonalityTraits")}
              onSave={() => saveField("preferredPersonalityTraits")}
              onCancel={() => cancelField("preferredPersonalityTraits")}
            >
              <MultiSelect
                label=""
                items={personalityTraits}
                placeholder="Select up to 3"
                max={3}
                value={form.preferredPersonalityTraits}
                onChange={(value) => updateField("preferredPersonalityTraits", value)}
              />
            </EditableField>
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
          disabled={saving || dirtyFields.length === 0}
          onClick={handleSaveAll}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {dirtyFields.length > 0
                ? `Save ${dirtyFields.length} Changed Field${dirtyFields.length > 1 ? "s" : ""}`
                : "No Changes to Save"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

"use client";

import { Button, Input, MultiSelect, SelectElement, Textarea, DatePicker } from "@/components/atoms";
import { Div, Section, EditableField } from "@/components/molecules";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateProfile } from "@/lib/profile";
import { useUserStore } from "@/store/userStore";
import { OnboardingData } from "@/types/userprofile";
import {
  LOCATIONS, INDUSTRIES, FOUNDER_STATUSES, SKILL_CATEGORIES,
  COMMITMENT_LEVELS, PERSONALITY_TRAITS, FINANCIAL_CONTRIBUTIONS,
} from "@/lib/constants";
import { formatDateToYMD, valuesEqual } from "@/lib/helpers";
import { Loader2, ArrowLeft, Save, CheckCircle } from "lucide-react";
import Link from "next/link";

// Map constants to dropdown options
const locations = LOCATIONS.map((v) => ({ value: v, label: v }));
const industries = INDUSTRIES.map((v) => ({ value: v, label: v }));
const founderStatuses = FOUNDER_STATUSES.map((v) => ({ value: v, label: v }));
const skillCategories = SKILL_CATEGORIES.map((v) => ({ value: v, label: v }));
const commitmentLevels = COMMITMENT_LEVELS.map((v) => ({ value: v, label: v }));
const personalityTraits = PERSONALITY_TRAITS.map((v) => ({ value: v, label: v }));
const financialContributions = FINANCIAL_CONTRIBUTIONS.map((v) => ({ value: v, label: v }));

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const workStyles = ["Remote", "Hybrid", "On-site"].map((v) => ({ value: v, label: v }));
const riskManagementStyles = [
  "Conservative", "Moderate", "Aggressive", "Calculated Risk-taker", "Risk-averse",
].map((v) => ({ value: v, label: v }));
const yesNoOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

type FormData = OnboardingData;

const defaultForm: FormData = {
  gender: "", dateOfBirth: "", linkedInUrl: "", hasStartup: false, workStyle: "",
  riskManagementStyle: "", bio: "", pastExperience: "", userName: "",
  founderStatus: "", skills: [], industry: "", currentOccupation: "",
  yearsExperience: 0, commitmentLevel: "", financialContribution: "",
  personalityTraits: [], location: "",
};

export default function ProfileEditPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>(defaultForm);
  // The last-saved values — used to figure out which fields are dirty and
  // what to revert to when a single field's edit is cancelled.
  const [original, setOriginal] = useState<FormData>(defaultForm);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  // Per-field save state, keyed by field name
  const [savingFields, setSavingFields] = useState<Set<string>>(new Set());
  const [justSavedFields, setJustSavedFields] = useState<Set<string>>(new Set());

  // Load existing profile data from user store
  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      if (p.dateOfBirth) {
        setDate(new Date(p.dateOfBirth));
      }
      const loaded: FormData = {
        bio: p.bio || "",
        pastExperience: p.pastExperience || "",
        userName: p.userName || "",
        gender: p.gender || "",
        dateOfBirth: p.dateOfBirth || "",
        linkedInUrl: p.linkedInUrl || "",
        hasStartup: p.hasStartup || false,
        workStyle: p.workStyle || "",
        riskManagementStyle: p.riskManagementStyle || "",
        founderStatus: p.founderStatus || "",
        skills: p.skills || [],
        industry: p.industry || "",
        currentOccupation: p.currentOccupation || "",
        yearsExperience: p.yearsExperience || 0,
        commitmentLevel: p.commitmentLevel || "",
        financialContribution: p.financialContribution || "",
        personalityTraits: p.personalityTraits || [],
        location: p.location || "",
      };
      setForm(loaded);
      setOriginal(loaded);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isDirty = <K extends keyof FormData>(field: K) =>
    !valuesEqual(form[field], original[field]);

  const flashSaved = (field: keyof FormData) => {
    setJustSavedFields((prev) => new Set(prev).add(field as string));
    setTimeout(() => {
      setJustSavedFields((prev) => {
        const next = new Set(prev);
        next.delete(field as string);
        return next;
      });
    }, 2000);
  };

  // Saves just this one field, independent of everything else on the page.
  const saveField = async <K extends keyof FormData>(field: K) => {
    setSavingFields((prev) => new Set(prev).add(field as string));
    const payload = { [field]: form[field] } as Partial<FormData>;
    const result = await updateProfile(payload);
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

  // Discards the in-progress edit for a single field, reverting it back to
  // its last-saved value.
  const cancelField = <K extends keyof FormData>(field: K) => {
    setForm((prev) => ({ ...prev, [field]: original[field] }));
    if (field === "dateOfBirth") {
      setDate(original.dateOfBirth ? new Date(original.dateOfBirth) : undefined);
    }
  };

  // Every field the user has touched but not yet saved individually.
  const dirtyFields = (Object.keys(form) as (keyof FormData)[]).filter((key) =>
    isDirty(key)
  );

  const handleSaveAll = async () => {
    if (dirtyFields.length === 0) return;
    setSaving(true);
    setSuccess(false);
    // Only send the fields that actually changed, not the whole form.
    const diff = dirtyFields.reduce((acc, key) => {
      acc[key] = form[key];
      return acc;
    }, {} as Partial<FormData>);
    const result = await updateProfile(diff, (b) => setSaving(b));
    if (result) {
      setOriginal((prev) => ({ ...prev, ...diff }));
      setSuccess(true);
      setTimeout(() => router.push("/profile"), 1500);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="p-2 rounded-lg hover:bg-secondary transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Edit Profile</h1>
            <p className="text-muted-foreground text-sm">
              Update your founder profile — each field saves on its own, so you can change just one thing at a time
            </p>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/10">
          <CheckCircle className="w-5 h-5 text-primary" />
          <p className="text-sm text-primary font-medium">
            Profile updated successfully! Redirecting...
          </p>
        </div>
      )}

      {/* Form sections */}
      <div className="space-y-6">
        {/* Section 1: About You */}
        <Section title="About You">
          <Div>
            <EditableField
              label="Gender"
              dirty={isDirty("gender")}
              saving={savingFields.has("gender")}
              justSaved={justSavedFields.has("gender")}
              onSave={() => saveField("gender")}
              onCancel={() => cancelField("gender")}
            >
              <SelectElement
                placeholder="Select Gender"
                items={genderOptions}
                value={form.gender}
                onChange={(value) => updateField("gender", value)}
              />
            </EditableField>

            <EditableField
              label="Date of Birth"
              dirty={isDirty("dateOfBirth")}
              saving={savingFields.has("dateOfBirth")}
              justSaved={justSavedFields.has("dateOfBirth")}
              onSave={() => saveField("dateOfBirth")}
              onCancel={() => cancelField("dateOfBirth")}
            >
              <DatePicker
                placeholder="Select date"
                value={date}
                onChange={(value) => {
                  setDate(value);
                  updateField("dateOfBirth", formatDateToYMD(value));
                }}
              />
            </EditableField>

            <EditableField
              label="Location"
              dirty={isDirty("location")}
              saving={savingFields.has("location")}
              justSaved={justSavedFields.has("location")}
              onSave={() => saveField("location")}
              onCancel={() => cancelField("location")}
            >
              <SelectElement
                placeholder="Select Location"
                items={locations}
                value={form.location}
                onChange={(value) => updateField("location", value)}
              />
            </EditableField>

            <EditableField
              label="Industry"
              dirty={isDirty("industry")}
              saving={savingFields.has("industry")}
              justSaved={justSavedFields.has("industry")}
              onSave={() => saveField("industry")}
              onCancel={() => cancelField("industry")}
            >
              <SelectElement
                placeholder="Select Industry"
                items={industries}
                value={form.industry}
                onChange={(value) => updateField("industry", value)}
              />
            </EditableField>

            <EditableField
              label="Founder Status"
              dirty={isDirty("founderStatus")}
              saving={savingFields.has("founderStatus")}
              justSaved={justSavedFields.has("founderStatus")}
              onSave={() => saveField("founderStatus")}
              onCancel={() => cancelField("founderStatus")}
            >
              <SelectElement
                placeholder="Select founder status"
                items={founderStatuses}
                value={form.founderStatus}
                onChange={(value) => updateField("founderStatus", value)}
              />
            </EditableField>

            <EditableField
              label="Years of Experience"
              dirty={isDirty("yearsExperience")}
              saving={savingFields.has("yearsExperience")}
              justSaved={justSavedFields.has("yearsExperience")}
              onSave={() => saveField("yearsExperience")}
              onCancel={() => cancelField("yearsExperience")}
            >
              <Input
                placeholder="5"
                type="number"
                value={form.yearsExperience?.toString() ?? ""}
                onChange={(e) => updateField("yearsExperience", Number(e.target.value))}
              />
            </EditableField>

            <EditableField
              label="Work Style"
              dirty={isDirty("workStyle")}
              saving={savingFields.has("workStyle")}
              justSaved={justSavedFields.has("workStyle")}
              onSave={() => saveField("workStyle")}
              onCancel={() => cancelField("workStyle")}
            >
              <SelectElement
                placeholder="Select work style"
                items={workStyles}
                value={form.workStyle}
                onChange={(value) => updateField("workStyle", value)}
              />
            </EditableField>

            <EditableField
              label="Do you already have a startup?"
              dirty={isDirty("hasStartup")}
              saving={savingFields.has("hasStartup")}
              justSaved={justSavedFields.has("hasStartup")}
              onSave={() => saveField("hasStartup")}
              onCancel={() => cancelField("hasStartup")}
            >
              <SelectElement
                placeholder="Select one"
                items={yesNoOptions}
                value={String(form.hasStartup)}
                onChange={(value) => updateField("hasStartup", value === "true")}
              />
            </EditableField>

            <EditableField
              label="LinkedIn Profile URL"
              dirty={isDirty("linkedInUrl")}
              saving={savingFields.has("linkedInUrl")}
              justSaved={justSavedFields.has("linkedInUrl")}
              onSave={() => saveField("linkedInUrl")}
              onCancel={() => cancelField("linkedInUrl")}
            >
              <Input
                placeholder="https://linkedin.com/in/..."
                type="text"
                value={form.linkedInUrl}
                onChange={(e) => updateField("linkedInUrl", e.target.value)}
              />
            </EditableField>
          </Div>
        </Section>

        {/* Section 2: Profile Setup */}
        <Section title="Profile Details">
          <Div>
            <EditableField
              label="Preferred Username"
              dirty={isDirty("userName")}
              saving={savingFields.has("userName")}
              justSaved={justSavedFields.has("userName")}
              onSave={() => saveField("userName")}
              onCancel={() => cancelField("userName")}
            >
              <Input
                placeholder="johndoe"
                type="text"
                value={form.userName}
                onChange={(e) => updateField("userName", e.target.value)}
              />
            </EditableField>

            <EditableField
              label="Bio"
              dirty={isDirty("bio")}
              saving={savingFields.has("bio")}
              justSaved={justSavedFields.has("bio")}
              onSave={() => saveField("bio")}
              onCancel={() => cancelField("bio")}
            >
              <Textarea
                placeholder="Tell us about yourself..."
                rows={5}
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
              />
            </EditableField>

            <EditableField
              label="Skills"
              dirty={isDirty("skills")}
              saving={savingFields.has("skills")}
              justSaved={justSavedFields.has("skills")}
              onSave={() => saveField("skills")}
              onCancel={() => cancelField("skills")}
            >
              <MultiSelect
                label=""
                placeholder="Select your skills"
                items={skillCategories}
                value={form.skills}
                onChange={(value) => updateField("skills", value)}
              />
            </EditableField>

            <EditableField
              label="Commitment Level"
              dirty={isDirty("commitmentLevel")}
              saving={savingFields.has("commitmentLevel")}
              justSaved={justSavedFields.has("commitmentLevel")}
              onSave={() => saveField("commitmentLevel")}
              onCancel={() => cancelField("commitmentLevel")}
            >
              <SelectElement
                placeholder="Select commitment"
                items={commitmentLevels}
                value={form.commitmentLevel}
                onChange={(value) => updateField("commitmentLevel", value)}
              />
            </EditableField>

            <EditableField
              label="Personality Traits"
              dirty={isDirty("personalityTraits")}
              saving={savingFields.has("personalityTraits")}
              justSaved={justSavedFields.has("personalityTraits")}
              onSave={() => saveField("personalityTraits")}
              onCancel={() => cancelField("personalityTraits")}
            >
              <MultiSelect
                label=""
                placeholder="Select up to 3"
                items={personalityTraits}
                max={3}
                value={form.personalityTraits}
                onChange={(value) => updateField("personalityTraits", value)}
              />
            </EditableField>

            <EditableField
              label="Financial Contribution"
              dirty={isDirty("financialContribution")}
              saving={savingFields.has("financialContribution")}
              justSaved={justSavedFields.has("financialContribution")}
              onSave={() => saveField("financialContribution")}
              onCancel={() => cancelField("financialContribution")}
            >
              <SelectElement
                placeholder="Select one"
                items={financialContributions}
                value={form.financialContribution}
                onChange={(value) => updateField("financialContribution", value)}
              />
            </EditableField>

            <EditableField
              label="Risk Management Style"
              dirty={isDirty("riskManagementStyle")}
              saving={savingFields.has("riskManagementStyle")}
              justSaved={justSavedFields.has("riskManagementStyle")}
              onSave={() => saveField("riskManagementStyle")}
              onCancel={() => cancelField("riskManagementStyle")}
            >
              <SelectElement
                placeholder="Select one"
                items={riskManagementStyles}
                value={form.riskManagementStyle}
                onChange={(value) => updateField("riskManagementStyle", value)}
              />
            </EditableField>

            <EditableField
              label="Current Occupation"
              dirty={isDirty("currentOccupation")}
              saving={savingFields.has("currentOccupation")}
              justSaved={justSavedFields.has("currentOccupation")}
              onSave={() => saveField("currentOccupation")}
              onCancel={() => cancelField("currentOccupation")}
            >
              <Input
                placeholder="Software Engineer"
                type="text"
                value={form.currentOccupation}
                onChange={(e) => updateField("currentOccupation", e.target.value)}
              />
            </EditableField>
          </Div>
        </Section>

        {/* Section 3: Experience */}
        <Section title="Experience & Background">
          <Div>
            <EditableField
              label="Past Startup Experience"
              dirty={isDirty("pastExperience")}
              saving={savingFields.has("pastExperience")}
              justSaved={justSavedFields.has("pastExperience")}
              onSave={() => saveField("pastExperience")}
              onCancel={() => cancelField("pastExperience")}
            >
              <Textarea
                placeholder="Describe your past successes or failures..."
                rows={5}
                value={form.pastExperience}
                onChange={(e) => updateField("pastExperience", e.target.value)}
              />
            </EditableField>
          </Div>
        </Section>


      </div>

      {/* Link to Preferences */}
      <div className="p-4 bg-secondary/50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Co-founder Preferences</p>
            <p className="text-sm text-muted-foreground">
              Set what you&apos;re looking for in a co-founder
            </p>
          </div>
          <Link href="/profile/preferences">
            <Button variant="outline" size="sm">
              Edit Preferences
            </Button>
          </Link>
        </div>
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

"use client";

import { Button, Input, MultiSelect, SelectElement, Textarea, DatePicker } from "@/components/atoms";
import { Div, Section } from "@/components/molecules";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updateProfile } from "@/lib/profile";
import { useUserStore } from "@/store/userStore";
import { OnboardingData } from "@/types/userprofile";
import {
  LOCATIONS, INDUSTRIES, FOUNDER_STATUSES, SKILL_CATEGORIES,
  COMMITMENT_LEVELS, PERSONALITY_TRAITS, FINANCIAL_CONTRIBUTIONS,
} from "@/lib/constants";
import { formatDateToYMD } from "@/lib/helpers";
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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [success, setSuccess] = useState(false);

  // Load existing profile data from user store
  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      if (p.dateOfBirth) {
        setDate(new Date(p.dateOfBirth));
      }
      setForm({
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
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const result = await updateProfile(form, (b) => setSaving(b));
    if (result) {
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
              Update your founder profile
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
            <SelectElement
              label="Gender"
              placeholder="Select Gender"
              items={genderOptions}
              value={form.gender}
              onChange={(value) => updateField("gender", value)}
            />
            <DatePicker
              label="Date of Birth"
              placeholder="Select date"
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
              value={form.location}
              onChange={(value) => updateField("location", value)}
            />
            <SelectElement
              label="Industry"
              placeholder="Select Industry"
              items={industries}
              value={form.industry}
              onChange={(value) => updateField("industry", value)}
            />
            <SelectElement
              label="Founder Status"
              placeholder="Select founder status"
              items={founderStatuses}
              value={form.founderStatus}
              onChange={(value) => updateField("founderStatus", value)}
            />
            <Input
              label="Years of Experience"
              placeholder="5"
              type="number"
              value={form.yearsExperience?.toString() ?? ""}
              onChange={(e) => updateField("yearsExperience", Number(e.target.value))}
            />
            <SelectElement
              label="Work Style"
              placeholder="Select work style"
              items={workStyles}
              value={form.workStyle}
              onChange={(value) => updateField("workStyle", value)}
            />
            <SelectElement
              label="Do you already have a startup?"
              placeholder="Select one"
              items={yesNoOptions}
              value={String(form.hasStartup)}
              onChange={(value) => updateField("hasStartup", value === "true")}
            />
            <Input
              label="LinkedIn Profile URL"
              placeholder="https://linkedin.com/in/..."
              type="text"
              value={form.linkedInUrl}
              onChange={(e) => updateField("linkedInUrl", e.target.value)}
            />
          </Div>
        </Section>

        {/* Section 2: Profile Setup */}
        <Section title="Profile Details">
          <Div>
            <Input
              label="Preferred Username"
              placeholder="johndoe"
              type="text"
              value={form.userName}
              onChange={(e) => updateField("userName", e.target.value)}
            />
            <Textarea
              label="Bio"
              placeholder="Tell us about yourself..."
              rows={5}
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
            />
            <MultiSelect
              label="Skills"
              placeholder="Select your skills"
              items={skillCategories}
              value={form.skills}
              onChange={(value) => updateField("skills", value)}
            />
            <SelectElement
              label="Commitment Level"
              placeholder="Select commitment"
              items={commitmentLevels}
              value={form.commitmentLevel}
              onChange={(value) => updateField("commitmentLevel", value)}
            />
            <MultiSelect
              label="Personality Traits"
              placeholder="Select up to 3"
              items={personalityTraits}
              max={3}
              value={form.personalityTraits}
              onChange={(value) => updateField("personalityTraits", value)}
            />
            <SelectElement
              label="Financial Contribution"
              placeholder="Select one"
              items={financialContributions}
              value={form.financialContribution}
              onChange={(value) => updateField("financialContribution", value)}
            />
            <SelectElement
              label="Risk Management Style"
              placeholder="Select one"
              items={riskManagementStyles}
              value={form.riskManagementStyle}
              onChange={(value) => updateField("riskManagementStyle", value)}
            />
            <Input
              label="Current Occupation"
              placeholder="Software Engineer"
              type="text"
              value={form.currentOccupation}
              onChange={(e) => updateField("currentOccupation", e.target.value)}
            />
          </Div>
        </Section>

        {/* Section 3: Experience */}
        <Section title="Experience & Background">
          <Div>
            <Textarea
              label="Past Startup Experience"
              placeholder="Describe your past successes or failures..."
              rows={5}
              value={form.pastExperience}
              onChange={(e) => updateField("pastExperience", e.target.value)}
            />
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
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

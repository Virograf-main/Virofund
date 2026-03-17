"use client";

import React from "react";

// ─── Types matching the API response ─────────────────────────────────────────

export interface FounderProfile {
  id: string;
  userId: string;
  userName: string;
  founderStatus: string;
  bio: string;
  email: string;
  skills: string[];
  workStyle: string;
  industry: string;
  currentOccupation: string;
  yearsExperience: number;
  commitmentLevel: string;
  financialContribution: string;
  personalityTraits: string[];
  location: string;
  preferredSkills: string[];
  preferredFounderType: string;
  preferredIndustry: string;
  preferredCommitmentLevel: string;
  preferredFinancial: string;
  preferredPersonalityTraits: string[];
  preferredLocation: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#94f0c5]/15 text-[#1a6b4a] border border-[#94f0c5]/40 tracking-wide">
      {label}
    </span>
  );
}
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A09A8E]">
        {title}
      </p>
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="border-[#EDE9E1]" />;
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5 bg-[#F9F7F3] rounded-xl px-4 py-3 border border-[#EDE9E1]">
      <span className="text-[10px] uppercase tracking-widest text-[#A09A8E] font-semibold">
        {label}
      </span>
      <span className="text-sm font-semibold text-[#1C1A16]">{value}</span>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9B99A] to-[#8C7B65] flex items-center justify-center flex-shrink-0">
      <span className="text-white text-xl font-bold tracking-tight">
        {initials}
      </span>
    </div>
  );
}

// ─── Main Profile Component ───────────────────────────────────────────────────

export default function Profile({ profile }: { profile: FounderProfile }) {
  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen bg-[#FAF8F4] p-4 md:p-8"
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-3xl mx-auto space-y-4">
        {/* ── Header card ── */}
        <div className="bg-white rounded-2xl border border-[#EDE9E1] p-6 flex gap-4 items-start shadow-sm">
          <Avatar name={profile.userName} />

          <div className="flex-1 min-w-0">
            <h1
              style={{ fontFamily: "'DM Serif Display', serif" }}
              className="text-2xl text-[#1C1A16] leading-tight"
            >
              {profile.userName}
            </h1>
            <p className="text-sm text-[#6B6560] mt-0.5">
              {profile.currentOccupation} · {profile.industry}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-[#A09A8E] flex items-center gap-1">
                📍 {profile.location}
              </span>
              <span className="text-xs text-[#A09A8E] flex items-center gap-1">
                ✉️ {profile.email}
              </span>
            </div>
          </div>

          <div className="hidden md:block">
            <Tag label={profile.founderStatus} />
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatPill
            label="Experience"
            value={`${profile.yearsExperience} yrs`}
          />
          <StatPill label="Commitment" value={profile.commitmentLevel} />
          <StatPill label="Work style" value={profile.workStyle} />
          <StatPill label="Financial" value={profile.financialContribution} />
        </div>

        {/* ── Bio ── */}
        <div className="bg-white rounded-2xl border border-[#EDE9E1] p-6 shadow-sm">
          <Section title="About">
            <p className="text-[15px] text-[#3D3A33] leading-relaxed">
              {profile.bio}
            </p>
          </Section>
        </div>

        {/* ── Skills & Traits ── */}
        <div className="bg-white rounded-2xl border border-[#EDE9E1] p-6 shadow-sm space-y-5">
          <Section title="Skills & Strengths">
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <Tag key={s} label={s} />
              ))}
            </div>
          </Section>

          <Divider />

          <Section title="Personality Traits">
            <div className="flex flex-wrap gap-2">
              {profile.personalityTraits.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>
          </Section>
        </div>

        {/* ── What they're looking for ── */}
        <div className="bg-white rounded-2xl border border-[#EDE9E1] p-6 shadow-sm space-y-5">
          <p
            style={{ fontFamily: "'DM Serif Display', serif" }}
            className="text-lg text-[#1C1A16]"
          >
            What {profile.userName.split(" ")[0]} is looking for
          </p>

          <Section title="Co-founder type">
            <div className="flex flex-wrap gap-2">
              <Tag label={profile.preferredFounderType} />
            </div>
          </Section>

          <Divider />

          <Section title="Preferred skills">
            <div className="flex flex-wrap gap-2">
              {profile.preferredSkills.map((s) => (
                <Tag key={s} label={s} />
              ))}
            </div>
          </Section>

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Section title="Industry">
              <Tag label={profile.preferredIndustry} />
            </Section>
            <Section title="Commitment">
              <Tag label={profile.preferredCommitmentLevel} />
            </Section>
            <Section title="Location">
              <Tag label={profile.preferredLocation} />
            </Section>
          </div>

          <Divider />

          <Section title="Personality traits they value">
            <div className="flex flex-wrap gap-2">
              {profile.preferredPersonalityTraits.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>
          </Section>

          <Divider />

          <Section title="Financial contribution">
            <Tag label={profile.preferredFinancial} />
          </Section>
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-xs text-[#C4BFB6] pb-4">
          Member since{" "}
          {new Date(profile.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

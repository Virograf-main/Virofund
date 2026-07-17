"use client";
import { Card } from "@/components/atoms";
import KeyValue from "@/components/atoms/keyvalue-pair";
import Pills from "@/components/atoms/pills";
import BasicInfo from "@/components/molecules/profile/basic-info";
import Subcard from "@/components/molecules/profile/subcard";
import React from "react";

type ProfileProps = {
  fullname: string;
  role: string;
  location?: {
    state?: string;
    country?: string;
  };
  socials?: string;
  image?: string;
};

type Details = {
  keyRoles: string[];
  workStyles?: string[];
  skills?: string[];
  personalityTraits?: string[];
};


type Experience = {
  title: string;
  date: string;
};

type Needs = {
  coFounder?: string[];
  CurrentSkills?: string[];
  Industry?: string[];
};

type Projects = {
  name: string;
  description: string;
  status: string;
  link?: string;
};

const Profile = ({
  basicInfo,
  bio,
  details,
  experience,
  needs,
  projects,
  variant = "own",
}: {
  basicInfo: ProfileProps;
  bio?: string;
  details: Details;
  experience?: Experience[];
  needs?: Needs;
  projects?: Projects;
  variant?: "own" | "other";
}) => {
  const Details = [
    {
      title: "Key Roles",
      subdetails: details.keyRoles,
    },
    {
      title: "Work Styles",
      subdetails: details.workStyles,
    },
    {
      title: "Skills & Strengths",
      subdetails: details.skills,
    },
    {
      title: "Personality Traits",
      subdetails: details.personalityTraits,
    },
  ];

  // Filter out sections with no data to avoid empty subcards
  const visibleDetails = Details.filter(
    (d) => d.subdetails && d.subdetails.length > 0
  );

  const Needs = [
    {
      title: "Type of co-founder",
      details: needs?.coFounder,
    },
    {
      title: "Current stage",
      details: needs?.CurrentSkills,
    },
    {
      title: "Industry or sector",
      details: needs?.Industry,
    },
  ];

  const Projects = [
    {
      key: "Project name",
      value: projects?.name,
    },
    {
      key: "Project description",
      value: projects?.description,
    },
    {
      key: "Project status",
      value: projects?.status,
    },
    {
      key: "Website link",
      value: projects?.link,
    },
  ];
  const isOwnProfile = variant === "own";

  return (
    <div>
      <Card className={`space-y-4 shadow-sm border-border relative overflow-hidden ${
        isOwnProfile
          ? "border-t-[3px] border-t-primary"
          : ""
      }`}>
        {/* Green accent badge for own profile */}
        {isOwnProfile && (
          <div className="absolute top-0 right-0">
            <div className="bg-primary/10 text-primary text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
              Your Profile
            </div>
          </div>
        )}

        <BasicInfo
          props={{
            name: basicInfo.fullname,
            role: basicInfo.role,
            location: {
              state: basicInfo.location?.state,
              country: basicInfo.location?.country,
            },
            socials: basicInfo.socials,
          }}
        />

        <div className="p-5 space-y-6">
          <KeyValue
            label={{
              value: "Bio",
              className: "font-bold text-lg md:text-2xl text-foreground",
            }}
          >
            <p className="text-sm md:text-base text-muted-foreground mt-1 leading-relaxed">
              {bio}
            </p>
          </KeyValue>

          <div className="flex flex-wrap gap-3 w-full">
            {visibleDetails.map((detail, idx) => (
              <div key={idx} className="flex-1 min-w-[200px]">
                <Subcard
                  text={detail.title}
                  className="text-base font-semibold text-foreground"
                >
                  <div className="flex flex-wrap gap-2 w-full max-w-full pt-2.5">
                    {detail.subdetails?.map((subdetail, subIdx) => (
                      <Pills key={subIdx} text={`${subdetail}`} />
                    ))}
                  </div>
                </Subcard>
              </div>
            ))}
          </div>

          <Subcard text="Experience" className="text-base font-semibold text-foreground">
            <div className="md:flex justify-between gap-4 pt-2.5 space-y-3">
              {experience?.map((ex, idx) => (
                <div key={idx} className="flex-1">
                  <KeyValue
                    label={{
                      value: ex.title,
                      className: "font-medium text-sm md:text-base text-foreground",
                    }}
                  >
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      {ex.date}
                    </p>
                  </KeyValue>
                </div>
              ))}
            </div>
          </Subcard>

          <Subcard
            text="What John is looking for"
            className="text-base font-semibold text-foreground"
          >
            <div className="flex flex-col gap-3 pt-2.5">
              {Needs.map((need, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground min-w-[130px]">
                    {need.title}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {need.details?.map((detail, dIdx) => (
                      <Pills key={dIdx} text={detail} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Subcard>

          <div className="border-t border-border" />

          <div className="space-y-3">
            <p className="font-semibold text-lg text-foreground">
              Startup or project
            </p>
            <div className="space-y-2">
              {Projects.map((project, idx) => (
                <div key={idx} className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{project.key}:</span>
                  {' '}{project.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;

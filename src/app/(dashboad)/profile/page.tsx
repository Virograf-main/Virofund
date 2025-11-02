"use client";
import Profile from "@/components/pages/profile";
import { useUserStore } from "@/store/userStore";
import React, { useEffect, useState } from "react";
import { getMatchingProfile } from "@/lib/profile";
import { Founder, UserProfile } from "@/types/userprofile";

const ProfilePage = () => {
  const { user } = useUserStore();
  const [profile, setProfile] = useState<Founder>();

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getMatchingProfile();
      console.log(data);
      if (data) {
        setProfile(data);
      }
      console.log(data);
    };
    fetchProfile();
  }, []);
  return (
    <div>
      <Profile
        basicInfo={{
          fullname: user ? `${user?.firstName} ${user?.lastName}` : "No User",
          role: "UI/UX Designer",
          location: {
            state: profile?.location,
            // country: "Nigeria",
          },
          socials: "LinkedIn - GitHub",
          image: "/images/clinton.jpg",
        }}
        bio="Building products that make money move easier."
        details={{
          keyRoles: ["Full time", "Senior level"],
          workStyles: profile?.personalityTraits,
          skills: profile?.skills,
        }}
        experience={[
          { title: "UI Team Lead at Tech Solutions", date: "Jul 2022 - 2024" },
          {
            title: "Product Designer at FlipConnect",
            date: "Jan 2021 - Jun 2022",
          },
          {
            title: "Design Intern at DigitalCraft",
            date: "Aug 2020 - Dec 2020",
          },
        ]}
        needs={{
          coFounder: profile?.preferredFounderType
            ? [profile?.preferredFounderType]
            : [""],
          CurrentSkills: profile?.preferredSkills,
          Industry: profile?.preferredIndustry
            ? [profile?.preferredIndustry]
            : [],
        }}
        projects={{
          name: "FlipConnect",
          description:
            "A social fintech platform connecting users and payments",
          status: "In Progress",
          link: "https://flipconnect.io",
        }}
      />
    </div>
  );
};

export default ProfilePage;

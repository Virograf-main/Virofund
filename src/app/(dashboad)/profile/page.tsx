// src/app/(dashboad)/profile/ProfilePage.tsx
"use client";

import Profile from "@/components/pages/profile";
import { useUserStore } from "@/store/userStore";
import { getMatchingProfile } from "@/lib/profile";
import { Founder } from "@/types/userprofile";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/config/endpoints";
import { instance } from "@/lib/axios";

export default function ProfilePage() {
  const { user } = useUserStore();
  const [profile, setProfile] = useState<Founder | undefined>();

  // fetch only in the browser
  useEffect(() => {
    let mounted = true;

    getMatchingProfile().then((data) => {
      if (!mounted) return;

      if (data && "id" in data) {
        // assuming Founder has an `id` field
        setProfile(data);
      } else {
        setProfile(undefined); // or handle message
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const { data: myprofile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const res = await instance.get(endpoints().Profiles.my_profile);
      return res.data;
    },
  });

  console.log('this is meee', myprofile)
  return (
    <div>
      <Profile
        basicInfo={{
          fullname: user ? `${user.firstName} ${user.lastName}` : "No User",
          role: "UI/UX Designer",
          location: { state: profile?.location },
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
            ? [profile.preferredFounderType]
            : [""],
          CurrentSkills: profile?.preferredSkills,
          Industry: profile?.preferredIndustry
            ? [profile.preferredIndustry]
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
}

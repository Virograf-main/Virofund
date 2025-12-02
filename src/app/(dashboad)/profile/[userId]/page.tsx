"use client";
import React, { useEffect, useState } from "react";
import { useMatches } from "@/store/useMatchesStore";
import { useParams } from "next/navigation";
import Profile from "@/components/pages/profile";
import { useTableStore } from "@/store/useTableStore";
import { getSpecificProfile } from "@/lib/profile";
import { Founder, UserProfile } from "@/types/userprofile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>();
  const userId = params.userId as string;
  useEffect(() => {
    async function fetchUser() {
      const data = await getSpecificProfile(userId, router);
      if (!data) {
        toast.error("something went wrong");
        return;
      }
      setUser(data);
    }
    fetchUser();
  }, []);
  return (
    <div>
      <Profile
        basicInfo={{
          fullname: user?.profile?.userName
            ? user?.profile?.userName
            : user?.firstName + " " + user?.lastName,
          role: "UI/UX Designer",
          location: {
            state: user?.profile.location,
            // country: "Nigeria",
          },
          socials: user?.profile.linkedInUrl,
          image: "/images/clinton.jpg",
        }}
        bio={user?.profile.bio}
        details={{
          keyRoles: ["Full time", "Senior level"],
          workStyles: user?.profile.workStyle
            ? [user?.profile.workStyle]
            : ["unspecified"],
          skills: user?.profile.skills,
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
          coFounder: user?.profile.preferredFounderType
            ? [user?.profile.preferredFounderType]
            : [""],
          CurrentSkills: user?.profile.preferredSkills,
          Industry: user?.profile.preferredIndustry
            ? [user?.profile.preferredIndustry]
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

export default UserProfilePage;

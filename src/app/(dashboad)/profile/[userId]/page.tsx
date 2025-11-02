"use client";
import React, { useEffect, useState } from "react";
import { useMatches } from "@/store/useMatchesStore";
import { useParams } from "next/navigation";
import Profile from "@/components/pages/profile";
import { useTableStore } from "@/store/useTableStore";
import { getSpecificProfile } from "@/lib/profile";
import { Founder } from "@/types/userprofile";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<Founder>();
  const userId = params.userId as string;
  const { matches } = useMatches();
  const { loading } = useTableStore();
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
          fullname: "No User",
          role: "UI/UX Designer",
          location: {
            state: user?.location,
            // country: "Nigeria",
          },
          socials: "LinkedIn - GitHub",
          image: "/images/clinton.jpg",
        }}
        bio="Building products that make money move easier."
        details={{
          keyRoles: ["Full time", "Senior level"],
          //  workStyles: currentMatchProfile[0].matchedFounderDetails.,
          skills: user?.skills,
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
          coFounder: user?.preferredFounderType
            ? [user?.preferredFounderType]
            : [""],
          CurrentSkills: user?.preferredSkills,
          Industry: user?.preferredIndustry ? [user?.preferredIndustry] : [],
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

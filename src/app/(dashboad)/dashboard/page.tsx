"use client";
import { Button, Column, DataTable } from "@/components/atoms";
import { Messages } from "@/components/molecules";
import RequestCard from "@/components/molecules/request-card";
import { useMatches } from "@/store/useMatchesStore";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
// types/table.ts
export interface TableRow {
  userId: number;
  name: string;
  location: string;
  industry: string;
  skills: string;
  score: React.ReactNode;
}
export default function TeamTable() {
  const { matches } = useMatches();
  const router = useRouter();
  const columns: Column<TableRow>[] = [
    { key: "name", header: "Name" },
    { key: "location", header: "Location" },
    { key: "industry", header: "Industry" },
    { key: "skills", header: "Skill stack" },
    { key: "score", header: "Match Score" },
  ];

  const RequestCardProps = {
    image: "/jpg/no-image.jpg",
    alt: "string",
    name: "Chido Obi",
    email: "creativeobi@gmail.com",
    available: "Onsite - Remote",
    timeAvailable: "160h 55m",
    details:
      "A collaborative developer with innovative ideas and industry valued experience and top notch technicality",
    keyValue: {
      department: "string",
      role: "string",
      backgroundColour: "string",
      dotColour: "string",
    },
  };

  const sampleMessages = [
    {
      name: "Julian Chidi",
      textmessage: "Hey! Did you finish the wireframe for the mobile app?",
      day: "Today",
      time: "6:30 PM",
    },
    {
      name: "Amaka Peters",
      textmessage: "Can you review the dashboard layout before our standup?",
      day: "Today",
      time: "5:45 PM",
    },
    {
      name: "Emmanuel King",
      textmessage: "Client just approved the final color palette 🎨",
      day: "Yesterday",
      time: "9:10 PM",
    },
    {
      name: "Tomiwa Ade",
      textmessage: "Please share the updated user journey slides.",
      day: "Yesterday",
      time: "3:20 PM",
    },
    {
      name: "Lara Smith",
      textmessage: "Let’s sync on the research findings tomorrow morning.",
      day: "2 days ago",
      time: "11:00 AM",
    },
    {
      name: "Joshua Uche",
      textmessage: "Your Figma file link seems broken — can you resend?",
      day: "2 days ago",
      time: "8:15 PM",
    },
    {
      name: "Mariam Abdul",
      textmessage: "The animations look amazing! Motion done right 🔥",
      day: "3 days ago",
      time: "7:40 PM",
    },
    {
      name: "Mariam Abdul",
      textmessage: "The animations look amazing! Motion done right 🔥",
      day: "3 days ago",
      time: "7:40 PM",
    },
    {
      name: "Mariam Abdul",
      textmessage: "The animations look amazing! Motion done right 🔥",
      day: "3 days ago",
      time: "7:40 PM",
    },
    {
      name: "Mariam Abdul",
      textmessage: "The animations look amazing! Motion done right 🔥",
      day: "3 days ago",
      time: "7:40 PM",
    },
    {
      name: "Mariam Abdul",
      textmessage: "The animations look amazing! Motion done right 🔥",
      day: "3 days ago",
      time: "7:40 PM",
    },
    {
      name: "Mariam Abdul",
      textmessage: "The animations look amazing! Motion done right 🔥",
      day: "3 days ago",
      time: "7:40 PM",
    },
  ];

  const runningProjects = [
    {
      name: "FinFlow Mobile",
      textmessage: "Building out the payment interface for iOS users.",
      day: "This Week",
      time: "In Progress",
    },
    {
      name: "PayLink Dashboard",
      textmessage: "Designing analytics cards and merchant reports.",
      day: "Last Week",
      time: "Review",
    },
    {
      name: "WalletX UX Refresh",
      textmessage: "Revamping navigation and microinteractions.",
      day: "2 Weeks Ago",
      time: "In Progress",
    },
  ];

  const refinedMatches = matches.map((match) => {
    const percentage = (match.overallScore * 100).toFixed(0); // round to nearest integer

    const matchScore =
      match.overallScore > 0.5 && match.overallScore < 0.75 ? (
        <span className="text-red-600">{percentage}%</span>
      ) : (
        // percentage
        <span className="text-primary">{percentage}%</span>
      );
    // percentage;

    return {
      userId: match.matchedFounderId,
      name: match.matchedFounderDetails.name,
      location: match.matchedFounderDetails.location,
      industry: match.matchedFounderDetails.industry,
      skills: match.matchedFounderDetails.skills.join(", "),
      score: matchScore,
    };
  });
  const handleRowClick = (row: {
    userId: number;
    name: string;
    location: string;
    industry: string;
    skills: string;
    score: ReactNode;
  }) => {
    // assuming each row has a userId field
    router.push(`/profile/${row.userId}`);
  };
  return (
    <section className="xl:grid xl:grid-cols-[1fr_400px] xl:gap-6 h-[90vh] ">
      <section className="flex flex-col gap-6 overflow-y-auto scrollbar">
        <section className="bg-white py-2 rounded-2xl w-full">
          <div className="flex justify-between items-center px-4 py-2">
            <p className="font-semibold text-[1.2em]">Suggestions</p>
            <Button variant="outline" className="m-0">
              See All
            </Button>
          </div>

          <div className="border w-full max-w-[100%] overflow-x-auto">
            <DataTable
              className="px-2"
              columns={columns}
              data={refinedMatches}
              rowFn={handleRowClick}
            />
          </div>
        </section>

        <section className="bg-[#F3F4F6] p-2 rounded-2xl">
          <p className="font-semibold text-[1.2em] py-2">Co-founder Requests</p>
          <div className="flex flex-col gap-4 ">
            {/* <RequestCard props={RequestCardProps} />
            <RequestCard props={RequestCardProps} />
            <RequestCard props={RequestCardProps} />
            <RequestCard props={RequestCardProps} />
            <RequestCard props={RequestCardProps} />
            <RequestCard props={RequestCardProps} /> */}
          </div>
        </section>
      </section>
      <div className="hidden xl:block">
        <Messages
          messages={sampleMessages}
          projects={runningProjects}
          projectCount={runningProjects.length}
          // onSearch={handleSearch}
        />
      </div>
    </section>
  );
}

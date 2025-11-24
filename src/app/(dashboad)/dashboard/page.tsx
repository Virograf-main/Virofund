"use client";
import { Button, Column, DataTable } from "@/components/atoms";
import { Messages } from "@/components/molecules";
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
  // const { matches } = useMatches();

  const matches = [
    {
      matchedFounderId: 1,
      overallScore: 0.92,
      matchedFounderDetails: {
        name: "Amaka Petersinnwrrghvs",
        location: "Lagos, Nigeria",
        industry: "Fintech",
        skills: ["React", "Node.js", "TypeScript"],
      },
    },
    {
      matchedFounderId: 2,
      overallScore: 0.68,
      matchedFounderDetails: {
        name: "Tomiwa Ade",
        location: "Abuja, Nigeria",
        industry: "HealthTech",
        skills: ["Python", "Flask", "Pandas"],
      },
    },
    {
      matchedFounderId: 3,
      overallScore: 0.78,
      matchedFounderDetails: {
        name: "Chidi Obi",
        location: "Nairobi, Kenya",
        industry: "EdTech",
        skills: ["Next.js", "Prisma", "Supabase"],
      },
    },
    {
      matchedFounderId: 4,
      overallScore: 0.53,
      matchedFounderDetails: {
        name: "Lara Smith",
        location: "Accra, Ghana",
        industry: "E-commerce",
        skills: ["Vue.js", "Firebase", "UI Design"],
      },
    },
    {
      matchedFounderId: 5,
      overallScore: 0.97,
      matchedFounderDetails: {
        name: "Julian Chidi",
        location: "Cape Town, South Africa",
        industry: "AI/ML",
        skills: ["TensorFlow", "Keras", "Python"],
      },
    },
  ];

const users = [
  { id: "user1", name: "Derin" },
  { id: "user2", name: "Ti Developer" },
  { id: "user3", name: "Melody" },
];


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
    <section className="xl:grid xl:grid-cols-[1fr_400px] xl:gap-6 h-[90vh] sm:max-w-[300px] max-h-[600px]  max-w-[400px] md:max-w-full mx-auto">
      {/* Left column - make it scrollable */}
      <section className="flex flex-col gap-6 h-full overflow-y-auto scrollbar">
        
        {/* Table section - constrain height and make scrollable */}
        <section className="bg-white py-2 rounded-2xl w-full flex flex-col   ">
          <div className="flex justify-between items-center px-4 py-2 flex-shrink-0">
            <p className="font-semibold text-[1.2em]">Suggestions</p>
            <Button variant="outline" className="m-0">
              See All
            </Button>
          </div>

          {/* Table container - this is the key fix */}
          <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
            <DataTable
              className="w-full"
              columns={columns}
              data={refinedMatches}
              rowFn={handleRowClick}
            />
          </div>
        </section>

        {/* Co-founder Requests section */}
        <section className="bg-[#F3F4F6] p-2 rounded-2xl flex-shrink-0">
          <p className="font-semibold text-[1.2em] py-2">Co-founder Requests</p>
          <div className="flex flex-col gap-4">
            {/* Your request cards */}
          </div>
        </section>
      </section>

      {/* Right column - Messages */}
      <div className="hidden xl:block">
        {/* <Messages
          messages={sampleMessages}
          projects={runningProjects}
          projectCount={runningProjects.length}
        /> */}
         <Messages currentUserId="user1" users={users} />
      </div>
    </section>
  );
}

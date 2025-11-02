"use client";

import { Button, MultiSelect } from "@/components/atoms";
import { Input } from "@/components/atoms";
import { Demarcation } from "@/components/atoms";
import { Checkbox } from "@/components/atoms";
import { SelectElement } from "@/components/atoms";
import { ProfilePicture } from "@/components/atoms/profile-upload";
import { DatePicker } from "@/components/atoms";
import { useState } from "react";
import { Messages, Section } from "@/components/molecules";
import { Signin } from "@/components/pages";

const items = ["light", "dark", "system"];
const newItems = [
  { label: "light", value: "light" },
  { label: "dark", value: "dark" },
  { label: "system", value: "system" },
];

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

export default function Home() {
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <div>
      <Signin />
      {/* <Messages
        messages={sampleMessages}
        projects={runningProjects}
        projectCount={runningProjects.length}
        onSearch={handleSearch}
      /> */}
    </div>
  );
}

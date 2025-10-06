"use client";

import { Button, MultiSelect } from "@/components/atoms";
import { Input } from "@/components/atoms";
import { Demarcation } from "@/components/atoms";
import { Checkbox } from "@/components/atoms";
import { SelectElement } from "@/components/atoms";
import { ProfilePictureUpload } from "@/components/atoms/profile-upload";
import { DatePicker } from "@/components/atoms";
import { useState } from "react";
import { Section } from "@/components/molecules";
import { Signin } from "@/components/pages";
import RequestCard from "@/components/molecules/requestcard";

const items = ["light", "dark", "system"];
const newItems = [
  { label: "light", value: "light" },
  { label: "dark", value: "dark" },
  { label: "system", value: "system" },
];

export default function Home() {
  return (
    <div className="">
      {/* <Signin /> */}
      <div className="flex gap-2 p-3 bg-green-400">
      <RequestCard className="flex-1" props={{
        name: 'Chidi Obi',
        email: 'john@gmail.com',
        available: 'Remote - Fulltime',
        timeAvailable: '120h 45m',
        details: 'An open-minded individual ready to work',
        keyValue: {
          department: 'Development',
          role: 'Game Developer',
          backgroundColour: 'primary',
          dotColour: 'green'
        }
      }} /> 
      <RequestCard className="flex-1" props={{
        name: 'John Bush',
        email: 'john@gmail.com',
        available: 'Remote - Fulltime',
        timeAvailable: '120h 45m',
        details: 'An open-minded individual ready to work',
        keyValue: {
          department: 'Development',
          role: 'Game Developer',
          backgroundColour: 'primary',
          dotColour: 'green'
        }
      }} />
      </div>
    </div>
  );
}

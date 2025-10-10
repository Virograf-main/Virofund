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
import BasicInfo from "@/components/molecules/profile/basic-info";
import Profile from "@/components/pages/profile";

const items = ["light", "dark", "system"];
const newItems = [
  { label: "light", value: "light" },
  { label: "dark", value: "dark" },
  { label: "system", value: "system" },
];

export default function Home() {
  return (
    <div className="">
      <Signin />
    </div>
  );
}

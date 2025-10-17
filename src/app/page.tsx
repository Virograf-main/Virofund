"use client";
import { Signin } from "@/components/pages";

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

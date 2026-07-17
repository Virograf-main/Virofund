"use client";
import { VerticalStepper } from "@/components/atoms";

export function Stepper() {
  return (
    <div className="fixed top-[100px] left-[1.5em] hidden lg:block">
      <VerticalStepper
        steps={[
          { label: "Basic information", href: "/about-you" },
          { label: "Profile setup", href: "/profile-setup" },
        ]}
      />
    </div>
  );
}

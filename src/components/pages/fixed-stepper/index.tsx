"use client";
import { VerticalStepper } from "@/components/atoms";
import { usePathname } from "next/navigation";

export function Stepper() {
  const pathname = usePathname();
  const isInVisible = pathname.includes("/cofounder-preference");

  return (
    <div className="fixed top-[100px] left-[1.5em] hidden lg:block">
      {!isInVisible && (
        <VerticalStepper
          steps={[
            { label: "Basic information", href: "/about-you" },
            { label: "Profile setup", href: "/profile-setup" },
            {
              label: "Co-founder preferences",
              href: "/cofounder-profile",
            },
            { label: "Matchmaking", href: "/matchmaking-data" },
          ]}
        />
      )}
    </div>
  );
}

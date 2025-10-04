"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Step {
  label: string;
  href: string;
}

interface VerticalStepperProps {
  steps: Step[];
}

export function VerticalStepper({ steps }: VerticalStepperProps) {
  const pathname = usePathname();
  const currentStep = steps.findIndex((s) => pathname.startsWith(s.href)) + 1;

  return (
    <div className="flex flex-col gap-6">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={step.label} className="flex items-start">
            {/* Circle + Line */}
            <div className="flex flex-col items-center mr-3">
              {/* Step circle */}
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium transition",
                  isCompleted && "bg-secondary border-secondary text-white",
                  isActive &&
                    "bg-primary border-primary text-white ring-2 ring-green-200",
                  !isCompleted &&
                    !isActive &&
                    "bg-gray-200 border-gray-300 text-gray-500"
                )}
              >
                {stepNumber}
              </div>

              {/* Connector line (except last step) */}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "w-px flex-1 transition-colors",
                    currentStep > stepNumber ? "bg-green-500" : "bg-gray-300"
                  )}
                />
              )}
            </div>

            {/* Step label */}
            <p
              // href={step.href}
              className={cn(
                "mt-1 text-sm transition",
                isCompleted && "text-secondary cursor-default",
                isActive && "text-primary font-medium",
                !isCompleted && !isActive && "text-gray-500"
              )}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

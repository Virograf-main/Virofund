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
                  isCompleted && "bg-secondary border-secondary text-secondary-foreground",
                  isActive &&
                    "bg-primary border-primary text-primary-foreground ring-2 ring-primary/20",
                  !isCompleted &&
                    !isActive &&
                    "bg-muted border-border text-muted-foreground"
                )}
              >
                {stepNumber}
              </div>

              {/* Connector line (except last step) */}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "w-px flex-1 transition-colors",
                    currentStep > stepNumber ? "bg-primary" : "bg-border"
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
                !isCompleted && !isActive && "text-muted-foreground"
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

"use client";
import * as React from "react";
import { Input as ShadInput } from "@/components/ui/input";
import { Label as ShadLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type InputProps = React.ComponentPropsWithoutRef<typeof ShadInput> & {
  label?: string; // optional label text
  description?: string; // optional helper text
  error?: string; // optional error text
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 my-2 flex-1 w-full">
        {label && (
          <ShadLabel className="font-semibold text-sm">{label}</ShadLabel>
        )}
        {description && <span className="text-xs">{description}</span>}
        <ShadInput
          ref={ref}
          className={cn(
            "border-input shadow-none border focus-within:shadow-none focus-visible:shadow-none focus-visible:border-input",
            className
          )}
          {...props}
        />
        {error && <span className="text-destructive text-xs">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

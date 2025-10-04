"use client";

import * as React from "react";
import { Textarea as ShadTextarea } from "@/components/ui/textarea";
import { Label as ShadLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TextareaProps = React.ComponentPropsWithoutRef<typeof ShadTextarea> & {
  label?: string; // optional label text
  description?: string; // optional helper text
  error?: string; // optional error text
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, description, error, className, rows = 4, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 my-2">
        {label && (
          <ShadLabel className="font-semibold text-sm">{label}</ShadLabel>
        )}
        {description && <span className="text-xs">{description}</span>}
        <ShadTextarea
          ref={ref}
          rows={rows}
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

Textarea.displayName = "Textarea";

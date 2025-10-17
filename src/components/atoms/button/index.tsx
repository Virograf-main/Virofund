// src/components/atoms/button/index.tsx
"use client";

import * as React from "react";
import { Button as ShadButton } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // shadcn generates this by default

type ButtonProps = React.ComponentPropsWithoutRef<typeof ShadButton>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <ShadButton
        ref={ref}
        variant={variant}
        className={cn(
          "rounded-lg px-6 py-3 font-semibold transition cursor-pointer my-4 h-9",
          variant !== "link" && " ",
          variant === "default" && "bg-[#128C72] hover:bg-[#107a63]",
          variant === "ghost" && "bg-transparent border border-[#D1D5DB]",
          variant === "secondary" && "bg-[#94F0C5] hover:bg-[#79c2a0] ",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

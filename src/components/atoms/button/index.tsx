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
          "rounded-lg px-6 py-3 font-semibold transition cursor-pointer h-9",
          variant !== "link" && " ",
          variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === "ghost" && "bg-transparent border border-border",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

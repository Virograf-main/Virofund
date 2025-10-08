"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export type MoreVerticalDotsProps = {
  className?: string;
  iconSize?: number;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const MoreVerticalDots: React.FC<MoreVerticalDotsProps> = ({
  className,
  iconSize = 10,
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label="More actions"
      className={cn(
        "border rounded-sm p-1 inline-flex items-center justify-center hover:cursor-pointer",
        className
      )}
      {...props}
    >
      <MoreVertical size={iconSize} />
    </button>
  );
};
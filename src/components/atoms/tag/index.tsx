"use client";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  variant?: "default" | "outline";
}

export function Tag({
  label,
  variant = "outline",
  className,
  ...props
}: TagProps) {
  return (
    <Badge
      variant={variant}
      className={cn("text-xs font-medium px-2 py-1 rounded-md", className)}
      {...props}
    >
      {label}
    </Badge>
  );
}

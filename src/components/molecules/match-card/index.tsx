"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tag } from "@/components/atoms/tag";
import { cn } from "@/lib/utils";

export interface MatchCardProps {
  name: string;
  imageUrl?: string;
  location?: string;
  industry?: string;
  tags?: string[];
  score: number; // 0-1
  onClick?: () => void;
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function scoreStyles(score: number) {
  if (score >= 0.75) {
    return "bg-primary/10 text-primary";
  }
  if (score >= 0.5) {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
  return "bg-destructive/10 text-destructive";
}

export function MatchCard({
  name,
  imageUrl,
  location,
  industry,
  tags = [],
  score,
  onClick,
  className,
}: MatchCardProps) {
  const percentage = Math.round(score * 100);
  const visibleTags = tags.slice(0, 3);
  const remaining = tags.length - visibleTags.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-11 w-11 shrink-0 ring-2 ring-border">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sm text-foreground">
              {name}
            </p>
            {(industry || location) && (
              <p className="truncate text-xs text-muted-foreground">
                {[industry, location].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>

        <div
          className={cn(
            "flex shrink-0 flex-col items-center justify-center rounded-full h-11 w-11 text-xs font-bold",
            scoreStyles(score)
          )}
        >
          {percentage}%
        </div>
      </div>

      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <Tag
              key={tag}
              label={tag}
              variant="outline"
              className="rounded-full border-border text-muted-foreground font-normal"
            />
          ))}
          {remaining > 0 && (
            <span className="inline-flex items-center px-2 py-1 text-xs text-muted-foreground">
              +{remaining} more
            </span>
          )}
        </div>
      )}
    </button>
  );
}

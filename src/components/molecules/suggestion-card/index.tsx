"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/atoms";
import { MapPin, Briefcase, Star, Loader2 } from "lucide-react";

interface SuggestionCardProps {
  name: string;
  industry?: string;
  founderStatus?: string;
  skills?: string[];
  yearsExperience?: number;
  location?: string;
  overallScore?: number;
  imageUrl?: string;
  onConnect?: () => void;
  onViewProfile?: () => void;
  isConnecting?: boolean;
}

export function SuggestionCard({
  name,
  industry,
  founderStatus,
  skills = [],
  yearsExperience,
  location,
  overallScore,
  imageUrl,
  onConnect,
  onViewProfile,
  isConnecting = false,
}: SuggestionCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const scorePercent = overallScore ? Math.round(overallScore * 100) : null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow w-full max-w-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {name}
            </h3>
            {industry && (
              <p className="text-xs text-gray-400 mt-0.5">{industry}</p>
            )}
          </div>
        </div>

        {/* Match score */}
        {scorePercent && (
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full shrink-0">
            <Star className="w-3 h-3 fill-emerald-500 stroke-none" />
            {scorePercent}%
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        {location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {location}
          </div>
        )}
        {(yearsExperience !== undefined || founderStatus) && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            {yearsExperience}y exp · {founderStatus}
          </div>
        )}
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          onClick={onViewProfile}
          className="flex-1 text-sm rounded-full border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          View Profile
        </Button>
        <Button
          onClick={onConnect}
          disabled={isConnecting}
          className="flex-1 text-sm rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {isConnecting ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Sending...
            </span>
          ) : (
            "Connect"
          )}
        </Button>
      </div>
    </div>
  );
}

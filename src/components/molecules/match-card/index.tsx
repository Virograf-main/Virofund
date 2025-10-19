"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/atoms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tag } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface MatchCardProps {
  name: string;
  email: string;
  workType: string;
  duration: string;
  description: string;
  department: string;
  jobTitle: string;
  percentage: number;
  avatarUrl?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onViewProfile?: () => void;
}

export function MatchCard({
  name,
  email,
  workType,
  duration,
  description,
  department,
  jobTitle,
  percentage,
  avatarUrl,
  onApprove,
  onReject,
  onViewProfile,
}: MatchCardProps) {
  // determine match level based on percentage
  let matchLevel: "low" | "average" | "very-high";

  if (percentage <= 45) matchLevel = "low";
  else if (percentage <= 70) matchLevel = "average";
  else matchLevel = "very-high";

  // map colors and titles dynamically
  const colorMap: Record<string, string> = {
    "very-high": "bg-[#00C851]", // green
    average: "bg-[#007BFF]", // blue
    low: "bg-[#FF4444]", // red
  };

  const titleMap: Record<string, string> = {
    "very-high": "VERY HIGH",
    average: "AVERAGE",
    low: "LOW",
  };

  return (
    <div className="relative w-full flex">
      {/* Colored background bar behind the card */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-10 rounded-t-2xl",
          colorMap[matchLevel]
        )}
      >
        <div
          className={cn(
            "rounded-full text-white text-xs font-semibold py-1 text-center w-full",
            colorMap[matchLevel]
          )}
        >
          {titleMap[matchLevel]} – {percentage}%
        </div>
      </div>

      <Card className="relative z-10 overflow-hidden rounded-2xl shadow-md border border-gray-200 bg-white mt-7 w-full px-0">
        <div className="absolute top-2 right-2">
          <Button
            variant="outline"
            size="sm"
            className=" !px-2.5 !py-2.5 text-[10px] rounded-md  
    sm:!px-2 sm:!py-2 sm:text-[12px] 
    h-auto border-gray-300 bg-white  hover:bg-gray-100 whitespace-nowrap "
            onClick={onViewProfile}
          >
            View Profile
          </Button>
        </div>
        <CardContent className="p-6 space-y-4 space-x-2">
          {/* Top Section: Avatar + Info*/}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <Avatar className="h-15 w-15">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-md sm:text-lg  text-gray-900">
                  {name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">{email}</p>
              </div>
            </div>
          </div>

          {/* Work info */}
          <div className="flex items-center text-sm text-gray-600 gap-1">
            <p>{workType}</p>
            <Clock className="h-3 w-3" />
            <p>{duration}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-900 leading-relaxed">{description}</p>

          {/* Department & Job title */}
          <div className="flex items-center gap-8 text-xs">
            <div>
              <p className="text-gray-500">Department:</p>
              <Tag
                label={department}
                className="mt-1 bg-[#E3F2FD] text-gray-700 border-none px-2 py-1 rounded-full"
              />
            </div>
            <div>
              <p className="text-gray-500">Job Title:</p>
              <p className="mt-1 text-gray-700">{jobTitle}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-3">
            <Button
              variant="outline"
              className="flex-1 border-green-500 text-green-600 hover:bg-green-50 font-medium text-xs sm:text-sm h-8 sm:h-9"
              onClick={onApprove}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-500 text-red-600 hover:bg-red-50 font-medium text-xs sm:text-sm h-8 sm:h-9"
              onClick={onReject}
            >
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

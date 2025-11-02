"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/atoms";
import { Tag } from "@/components/atoms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookmarkPlusIcon } from "lucide-react";

interface SuggestionCardProps {
  name: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
  onBookmark?: () => void;
  onConnect?: () => void;
  onViewProfile?: () => void;
  bgClass?: string;
  bgColor?: string;
  className?: string;
}

export function SuggestionCard({
  name,
  title,
  description,
  imageUrl,
  tags = [],
  onBookmark,
  onConnect,
  onViewProfile,
  bgClass,
  bgColor,
  className,
}: SuggestionCardProps) {
  const rootStyle = bgColor ? { backgroundColor: bgColor } : undefined;

  return (
    <Card
      className={`relative max-w-[420px] rounded-xl shadow-md ${
        bgClass ?? "bg-secondary text-secondary-foreground"
      } ${className ?? ""}`}
      style={rootStyle}
    >
      <CardContent className="p-5">
        {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.();
          }}
          aria-label="bookmark"
          title="Bookmark"
          className="absolute right-3 top-3 rounded-full p-2 border border-border bg-background/80 hover:scale-105 transition-transform"
        >
          <BookmarkPlusIcon className="h-7 w-7" />
        </button>

        {/* Header: avatar and name */}
        <div className="flex items-center gap-3">
          <Avatar className="h-15 w-15">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-base font-semibold leading-tight">{name}</h3>
            {title && <p className="text-xs text-muted-foreground">{title}</p>}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="mt-3 text-md text-muted-foreground text-black leading-relaxed">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 mt-4">
            {tags.map((tag) => (
              <Tag
                key={tag}
                label={tag}
                variant="outline"
                className="rounded-full px-3 py-1 text-xs border-gray-400 text-gray-700"
              />
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onViewProfile}
            className="flex-1 border-gray-300 text-gray-900 text-sm py-2 rounded-full hover:bg-gray-100"
          >
            View Profile
          </Button>
          <Button
            onClick={onConnect}
            className="flex-1 bg-black text-white text-sm py-2 rounded-full hover:bg-gray-800"
          >
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

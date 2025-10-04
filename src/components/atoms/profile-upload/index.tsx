"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";

interface ProfilePictureUploadProps {
  value?: string; // URL of current profile pic
  onChange?: (file: File | null) => void;
  className?: string;
}

export function ProfilePicture({
  value,
  onChange,
  className,
}: ProfilePictureUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(value || null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // create preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    onChange?.(file);
  }

  return (
    <div
      className={cn(
        "relative h-24 w-24 rounded-full overflow-hidden bg-muted cursor-pointer group",
        className
      )}
      onClick={() => fileInputRef.current?.click()}
    >
      {preview ? (
        <img
          src={preview}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <Camera className="h-6 w-6" />
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
        <Camera className="h-6 w-6 text-white" />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        title="Upload profile picture"
      />
    </div>
  );
}

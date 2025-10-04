"use client";

import * as React from "react";
import { format } from "date-fns";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Pick a date",
}: DatePickerProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <Label className="mb-1">{label}</Label>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            data-empty={!value}
            className={cn(
              "data-[empty=true]:text-muted-foreground border border-input hover:bg-transparent w-full justify-between text-left font-normal"
            )}
          >
            {value ? format(value, "PPP") : <span>{placeholder}</span>}
            <Image
              src="/svg/solar_calendar-outline.svg"
              width={16}
              height={16}
              alt="calendar"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

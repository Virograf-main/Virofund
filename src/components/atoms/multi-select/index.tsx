"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";

interface MultiSelectProps {
  items: { label: string; value: string }[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  max?: number; // ✅ optional max
  label?: string; // ✅ optional label
}

export function MultiSelect({
  items,
  value = [],
  onChange,
  placeholder = "Select items",
  className,
  max,
  label = "select one or multiple",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleItem = (val: string) => {
    if (value.includes(val)) {
      onChange?.(value.filter((v) => v !== val));
    } else {
      if (!max || value.length < max) {
        onChange?.([...value, val]);
      }
    }
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <Label>{label}</Label>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center justify-between my-2 rounded-md border border-input px-3 py-2 text-sm",
              className
            )}
          >
            <div className="flex flex-wrap gap-1">
              {value.length > 0 ? (
                value.map((val) => {
                  const item = items.find((i) => i.value === val);
                  return (
                    <Badge
                      key={val}
                      variant="secondary"
                      className="px-2 py-0.5 text-xs"
                    >
                      {item?.label}
                    </Badge>
                  );
                })
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-75" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 min-w-[240px] w-full max-h-[300px] overflow-y-auto"
          align="start"
        >
          <Command className="w-full">
            <CommandGroup className="w-full">
              {items.map((item) => {
                const isSelected = value.includes(item.value);
                const isDisabled =
                  !isSelected && max !== undefined && value.length >= max;

                return (
                  <CommandItem
                    key={item.value}
                    onSelect={() => toggleItem(item.value)}
                    disabled={isDisabled}
                    className={cn(
                      isDisabled && "opacity-50 cursor-not-allowed",
                      !isDisabled && "hover:bg-blue-100 focus:bg-blue-100"
                    )}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

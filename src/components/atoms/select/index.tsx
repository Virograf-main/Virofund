"use client";

import * as React from "react";
import {
  Select as ShadSelect,
  SelectContent as ShadSelectContent,
  SelectItem as ShadSelectItem,
  SelectTrigger as ShadSelectTrigger,
  SelectValue as ShadSelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// Wrapper around Select root
export const Select = ShadSelect;

export const SelectTrigger = React.forwardRef<
  React.ComponentRef<typeof ShadSelectTrigger>,
  React.ComponentPropsWithoutRef<typeof ShadSelectTrigger>
>(({ className, ...props }, ref) => (
  <ShadSelectTrigger
    ref={ref}
    className={cn(
      "w-full border border-input placeholder:text-white rounded-md px-3 py-2",
      className
    )}
    {...props}
  />
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = ShadSelectContent;
export const SelectItem = ShadSelectItem;
export const SelectValue = ShadSelectValue;

interface SelectElementProps {
  items: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const SelectElement = ({
  items,
  placeholder = "select one",
  label = "",
  value,
  onChange,
}: SelectElementProps) => {
  return (
    <div>
      {label && <Label className="my-2">{label}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent align="end">
          {items.map((item, idx) => (
            <SelectItem
              key={idx}
              value={item.value}
              className="focus:bg-secondary"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

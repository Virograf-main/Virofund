"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface OtpProps {
  maxLength?: number;
  groupSize?: number; // how many per group
  separator?: boolean;
  value?: string;
  onChange?: (val: string) => void;
}

export function InputOtp({
  maxLength = 6,
  groupSize = 3,
  separator = true,
  value,
  onChange,
}: OtpProps) {
  const slots = Array.from({ length: maxLength }, (_, i) => i);

  const groups: number[][] = [];
  for (let i = 0; i < slots.length; i += groupSize) {
    groups.push(slots.slice(i, i + groupSize));
  }

  return (
    <InputOTP maxLength={maxLength} value={value} onChange={onChange}>
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center">
          <InputOTPGroup>
            {group.map((index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>

          {separator && groupIndex < groups.length - 1 && <InputOTPSeparator />}
        </div>
      ))}
    </InputOTP>
  );
}

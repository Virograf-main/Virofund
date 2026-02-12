"use client";

import { useEffect, useState } from "react";
import { UrlDialog } from "@/components/molecules/modal/url-dialog";
import { Button } from "@/components/ui/button";
import { InputOtp } from "@/components/atoms/otp";
import { useModal } from "@/hooks/useOpenModalHook";

interface OtpDialogProps {
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void> | void;
}

export function OtpDialog({ onVerify, onResend }: OtpDialogProps) {
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const modal = useModal();
  useEffect(() => {
    if (seconds === 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function handleVerifyClick() {
    if (otp.length !== 6 || isVerifying) return;

    try {
      setIsVerifying(true);
      await onVerify(otp);
      setOtp("");
      modal.closeModal();
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResendClick() {
    if (seconds > 0) return;
    await onResend();
    setSeconds(30);
  }

  return (
    <UrlDialog name="otp" title="OTP Verification">
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground text-center">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-center">
          <InputOtp value={otp} onChange={setOtp} maxLength={6} />
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Didn’t receive the code? Check spam folder.
        </p>

        <div className="space-y-3 pt-2">
          <Button
            className="w-full"
            disabled={otp.length !== 6 || isVerifying}
            onClick={handleVerifyClick}
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            disabled={seconds > 0}
            onClick={handleResendClick}
          >
            {seconds > 0 ? `Resend OTP in ${seconds}s` : "Resend OTP"}
          </Button>
        </div>
      </div>
    </UrlDialog>
  );
}

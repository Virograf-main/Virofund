"use client";

import { useEffect, useState } from "react";
import { UrlDialog } from "@/components/molecules/modal/url-dialog";
import { Button } from "@/components/ui/button";
import { InputOtp } from "@/components/atoms/otp";
import { useModal } from "@/hooks/useOpenModalHook";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

interface OtpDialogProps {
  onVerify: (otp: string, newPassword?: string) => Promise<void>;
  onResend: () => Promise<void> | void;
  isForgotPassword?: boolean;
}

const OTP_REGEX = /^\d{6}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function OtpDialog({
  onVerify,
  onResend,
  isForgotPassword = false,
}: OtpDialogProps) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const modal = useModal();

  useEffect(() => {
    if (seconds === 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function handleVerifyClick() {
    if (!OTP_REGEX.test(otp)) {
      toast.error("OTP must be exactly 6 digits");
      return;
    }

    if (isForgotPassword) {
      if (!newPassword) {
        toast.error("Enter new password");
        return;
      }
      if (!PASSWORD_REGEX.test(newPassword)) {
        toast.error(
          "Password must be 8+ chars with uppercase, lowercase, number and special character",
        );
        return;
      }
    }

    if (isVerifying) return;

    try {
      setIsVerifying(true);
      await onVerify(otp, isForgotPassword ? newPassword : undefined);
      setOtp("");
      setNewPassword("");
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

  const isDisabled =
    !OTP_REGEX.test(otp) ||
    isVerifying ||
    (isForgotPassword && !PASSWORD_REGEX.test(newPassword));

  return (
    <UrlDialog name="otp" title="OTP Verification">
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground text-center">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-center">
          <InputOtp value={otp} onChange={setOtp} maxLength={6} />
        </div>

        {isForgotPassword && (
          <div className="space-y-1">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {newPassword && !PASSWORD_REGEX.test(newPassword) && (
              <p className="text-xs text-red-500">
                8+ chars, uppercase, lowercase, number & special character
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Didn&apos;t receive the code? Check spam folder.
        </p>

        <div className="space-y-3 pt-2">
          <Button
            className="w-full"
            disabled={isDisabled}
            onClick={handleVerifyClick}
          >
            {isVerifying
              ? "Verifying..."
              : isForgotPassword
                ? "Reset Password"
                : "Verify OTP"}
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

"use client";
import { Button, Input } from "@/components/atoms";
import { OtpDialog } from "@/components/molecules/OtmModal";
import { useModal } from "@/hooks/useOpenModalHook";
import {
  handleForgotPasswordOtp,
  handleResetPassword,
  resendForgotPasswordOtp,
} from "@/lib/auth";
import React, { useState } from "react";

function ResetPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const Modal = useModal();

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-[420px]">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <span className="text-2xl">🔐</span>
        </div>

        {/* Heading */}
        <h1
          className="text-2xl text-[#1C1A16] mb-1"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Reset your password
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Enter your email and we&apos;ll send you a code to reset your
          password.
        </p>

        {/* Form */}
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) =>
            handleForgotPasswordOtp(e, setIsLoading, email, () =>
              Modal.openModal("otp"),
            )
          }
        >
          <Input
            onChange={(e) => setEmail(e.target.value)}
            label="Email address"
            className="text-black"
            type="email"
            placeholder="you@example.com"
          />
          <Button
            variant="default"
            className="w-full mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send reset code"}
          </Button>
        </form>

        {/* Back to login */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Remember your password?{" "}
          <a href="/login" className="text-primary font-medium hover:underline">
            Log in
          </a>
        </p>
      </div>

      <OtpDialog
        onVerify={(otp, newPassword) =>
          handleResetPassword(otp, newPassword!, () => Modal.closeModal())
        }
        isForgotPassword
        onResend={resendForgotPasswordOtp}
      />
    </div>
  );
}

export default ResetPage;

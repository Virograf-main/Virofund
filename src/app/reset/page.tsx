"use client";
import { Button, Input } from "@/components/atoms";
import { OtpDialog } from "@/components/molecules/OtmModal";
import { useModal } from "@/hooks/useOpenModalHook";
import {
  handleForgotPasswordOtp,
  handleResetPassword,
  handleSendOtp,
  handleSignUp,
  resendForgotPasswordOtp,
  resendOtp,
} from "@/lib/auth";
import React from "react";

function page() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const Modal = useModal();
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   await handleForgotPasswordOtp()
  //   // Handle password reset logic here
  // };
  return (
    <div className="p-4 text-[black] max-w-[400px] m-auto">
      <h1>Password Reset Page</h1>
      <form
        className="flex flex-col gap-4 mt-4"
        onSubmit={(e) =>
          handleForgotPasswordOtp(e, setIsLoading, email, () =>
            Modal.openModal("otp"),
          )
        }
      >
        <Input
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          className="text-black"
          type="email"
        />
        <Button variant="default" className="w-full mt-4">
          Send
        </Button>
      </form>
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

export default page;

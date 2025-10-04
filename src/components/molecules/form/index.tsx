"use client";
import React, { useState } from "react";
import { Button, Checkbox, Demarcation, Input } from "@/components/atoms";
import { motion, AnimatePresence } from "framer-motion";
import { handleSignUp, handleLogin } from "@/lib/auth";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const fieldVariants = {
  hidden: { opacity: 0, height: 0, marginBottom: 0 },
  visible: { opacity: 1, height: "auto", marginBottom: 16 },
  exit: { opacity: 0, height: 0, marginBottom: 0 },
};

export function Form() {
  const [isPrevUser, setIsPrevUser] = useState(true);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsPrevUser(!isPrevUser);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  // Password rules
  const rules = [
    {
      label: "At least 8 characters",
      test: (pw: string) => pw.length >= 8,
    },
    {
      label: "One uppercase letter",
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: "One number",
      test: (pw: string) => /\d/.test(pw),
    },
  ];

  return (
    <form
      onSubmit={
        isPrevUser
          ? (e) => handleLogin(e, setIsCreatingAccount, email, password, router)
          : (e) => {
              e.preventDefault();
              const allPassed = rules.every((rule) => rule.test(password));
              if (!allPassed) {
                return toast.error(
                  "Password must be at least 8 characters, include an uppercase letter, a number, and a special character"
                );
              }

              handleSignUp(
                e,
                setIsCreatingAccount,
                true,
                password,
                firstName,
                lastName,
                email,
                setIsPrevUser
              );
            }
      }
      className="glass no-glass p-6 rounded-t-3xl"
    >
      {/* Header */}
      <article className="px-5 my-4 md:text-center">
        <motion.h2
          key={isPrevUser ? "welcome-back" : "welcome-new"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="font-[800] text-[36px]"
        >
          {isPrevUser ? "Welcome Back!" : "Create Account!"}
        </motion.h2>
        <motion.p
          key={isPrevUser ? "sub-back" : "sub-new"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-[14px]"
        >
          Select a method to {isPrevUser ? "login" : "Sign in"}
        </motion.p>
      </article>

      {/* Conditional fields */}
      <AnimatePresence initial={false}>
        {!isPrevUser && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fieldVariants}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <Input
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always visible fields */}
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password field with toggle + rules */}
      <div className="mb-4">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Show rules only in Sign Up */}
        {!isPrevUser && password.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm">
            {rules.map((rule, idx) => {
              const passed = rule.test(password);
              return (
                <li
                  key={idx}
                  className={`flex items-center gap-2 ${
                    passed ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {passed ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {rule.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Checkbox
          label={
            isPrevUser ? (
              "Remember me"
            ) : (
              <p>
                I agree to the{" "}
                <Link className="text-[#007aff]" href={""}>
                  Terms and Conditions
                </Link>
              </p>
            )
          }
        />
        {isPrevUser && <p className="text-[14px]">Forgot Password?</p>}
      </div>

      <Button type="submit">
        {isCreatingAccount ? "loading..." : "Sign in"}
      </Button>

      <Demarcation text="or continue with" />

      <Button variant="outline" type="button">
        <Image
          src="/svg/google-svgrepo-com.svg"
          alt="google"
          width={20}
          height={20}
        />
        <p>Google</p>
      </Button>

      {/* Toggle sign in/up */}
      <p className="text-center text-[14px]">
        {isPrevUser ? "Don't have an account? " : "Already have an account? "}
        <span
          className="text-link cursor-pointer text-[#007aff]"
          onClick={handleClick}
        >
          {isPrevUser ? "Sign up" : "Sign in"}
        </span>
      </p>
    </form>
  );
}

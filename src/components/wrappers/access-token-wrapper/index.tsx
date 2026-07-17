"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAccessTokenValid } from "@/lib/auth";

interface TokenCheckerProps {
  onTokenExpired?: () => Promise<void>; // your refresh function
  checkIntervalMs?: number; // how often to check, default 60s
  children: React.ReactNode;
}

export function TokenChecker({
  onTokenExpired,
  checkIntervalMs = 60_000,
  children,
}: TokenCheckerProps) {
  const router = useRouter();

  useEffect(() => {
    const checkToken: () => void = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.replace("/"); // redirect if no token
          return;
        }

        if (!isAccessTokenValid(token)) {
          if (onTokenExpired) {
            await onTokenExpired(); // call your refresh function
          } else {
            router.replace("/"); // fallback to login
          }
        }
      }
    };

    checkToken(); // check immediately on mount
    const interval = setInterval(checkToken, checkIntervalMs);

    return () => clearInterval(interval);
  }, [onTokenExpired, router, checkIntervalMs]);

  return <>{children}</>;
}

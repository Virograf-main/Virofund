"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface TokenCheckerProps {
  onTokenExpired?: () => void; // your refresh function
  checkIntervalMs?: number; // how often to check, default 60s
  children: React.ReactNode;
}

// Utility function to check token validity
function isAccessTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch (e) {
    console.error("Failed to parse token:", e);
    return false;
  }
}

export function TokenChecker({
  onTokenExpired,
  checkIntervalMs = 60_000,
  children,
}: TokenCheckerProps) {
  const router = useRouter();

  useEffect(() => {
    const checkToken: () => void = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.replace("/login"); // redirect if no token
          return;
        }

        if (!isAccessTokenValid(token)) {
          if (onTokenExpired) {
            onTokenExpired(); // call your refresh function
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

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface TokenCheckerProps {
  onTokenExpired?: () => Promise<void>; // your refresh function
  checkIntervalMs?: number; // how often to check, default 60s
  children: React.ReactNode;
}

// Utility function to check token validity
function isAccessTokenValid(token: string | null): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) {
    console.warn("Invalid JWT format");
    return false;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");

    const payload = JSON.parse(atob(base64));

    if (!payload?.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (e) {
    console.error("Failed to decode token payload:", e);
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
    const checkToken = async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.replace("/");
        return;
      }

      const valid = isAccessTokenValid(token);

      if (!valid) {
        try {
          if (onTokenExpired) {
            await onTokenExpired();

            // re-check after refresh
            const newToken = localStorage.getItem("accessToken");
            if (!isAccessTokenValid(newToken)) {
              router.replace("/");
            }
          } else {
            router.replace("/");
          }
        } catch (err) {
          console.error("Refresh failed:", err);
          router.replace("/");
        }
      }
    };

    checkToken(); // check immediately on mount
    const interval = setInterval(checkToken, checkIntervalMs);

    return () => clearInterval(interval);
  }, [onTokenExpired, router, checkIntervalMs]);

  return <>{children}</>;
}

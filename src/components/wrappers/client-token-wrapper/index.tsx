"use client";

import { TokenChecker } from "@/components/wrappers/access-token-wrapper";
import { refreshToken } from "@/lib/auth";

export default function ClientTokenWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TokenChecker onTokenExpired={refreshToken}>{children}</TokenChecker>;
}

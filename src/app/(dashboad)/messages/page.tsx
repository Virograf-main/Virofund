"use client";
import { Messages } from "@/components/molecules";
import { Loader } from "@/components/atoms";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

function MessagesPage() {
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        router.replace("/dashboard");
      }
    };

    // Check immediately on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  return (
    <Suspense fallback={<Loader />}>
      <Messages />
    </Suspense>
  );
}

export default MessagesPage;

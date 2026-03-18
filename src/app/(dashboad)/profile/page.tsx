"use client";

import Profile, { FounderProfile } from "@/components/pages/profile";
import { getMatchingProfile } from "@/lib/profile";
import { useEffect, useState } from "react";
import { Loader } from "@/components/atoms";

export default function ProfilePage() {
  const [profile, setProfile] = useState<FounderProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getMatchingProfile().then((data) => {
      if (!mounted) return;
      if (data && "id" in data) {
        setProfile(data as FounderProfile);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-sm text-gray-400">
        Profile not found
      </div>
    );
  }

  return <Profile profile={profile} />;
}

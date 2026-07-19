"use client";

import { Loader } from "@/components/atoms";
import { getConnections } from "@/lib/matches";
import { ConnectionRequest } from "@/types/matches";
import { useUserStore } from "@/store/userStore";
import { UserRoundSearch, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ConnectionsPage() {
  const { user } = useUserStore();
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      const data = await getConnections();
      setConnections(data || []);
      setLoading(false);
    };
    fetchConnections();
  }, []);

  // Each accepted request has a sender and receiver — figure out which one
  // is "us" so we can show the other person.
  const getOtherPerson = (request: ConnectionRequest) =>
    request.sender.id === user?.id ? request.receiver : request.sender;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <section className="bg-muted p-8 rounded-2xl text-center">
        <Image
          src="/svg/no-data.svg"
          width={180}
          height={180}
          alt="No connections"
          className="mx-auto"
        />
        <p className="mt-4 text-muted-foreground text-lg">
          No connections yet
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Accepted co-founder requests will show up here
        </p>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
        >
          <UserRoundSearch className="w-4 h-4" />
          Browse Co-founders
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6" />
          Connections
        </h1>
        <p className="text-muted-foreground">
          People you're connected with ({connections.length})
        </p>
      </div>

      <div className="space-y-3">
        {connections.map((request) => {
          const person = getOtherPerson(request);
          return (
            <div
              key={request.id}
              className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold">
                    {person.firstName.charAt(0)}
                    {person.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-base">
                      {person.firstName} {person.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {person.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Compatibility: {(request.compatibilityScore * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {person.matchedProfileId ? (
                    <Link
                      href={`/profile/${person.matchedProfileId}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Profile unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

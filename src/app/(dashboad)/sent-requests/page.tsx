"use client";

import { Loader } from "@/components/atoms";
import { getSentRequests } from "@/lib/matches";
import { ConnectionRequest } from "@/types/matches";
import { Clock, Send, UserRoundSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SentRequestsPage() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSentRequests = async () => {
      setLoading(true);
      const data = await getSentRequests();
      if (data) {
        setRequests(data);
      }
      setLoading(false);
    };
    fetchSentRequests();
  }, []);

  const statusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
            <Send className="w-3 h-3" />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-medium">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <section className="bg-muted p-8 rounded-2xl text-center">
        <Image
          src="/svg/no-data.svg"
          width={180}
          height={180}
          alt="No sent requests"
          className="mx-auto"
        />
        <p className="mt-4 text-muted-foreground text-lg">
          No sent requests yet
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Browse profiles and send connection requests to potential co-founders
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
        <h1 className="text-2xl font-bold">Sent Requests</h1>
        <p className="text-muted-foreground">
          Track your outgoing connection requests ({requests.length})
        </p>
      </div>

      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all p-5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold">
                  {request.receiver.firstName.charAt(0)}
                  {request.receiver.lastName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-base">
                    {request.receiver.firstName} {request.receiver.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {request.receiver.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Compatibility:{" "}
                    {(request.compatibilityScore * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {statusBadge(request.status)}
                <Link
                  href={`/profile/${request.receiver.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

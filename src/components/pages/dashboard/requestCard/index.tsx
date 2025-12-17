"use client";

import loading from "@/app/loading";
import { Loader } from "@/components/atoms";
import RequestCard from "@/components/molecules/request-card";
import {
  approveRequest,
  getIncomingRequests,
  rejectRequest,
} from "@/lib/matches";
import { ConnectionRequest } from "@/types/matches";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const RequestSection = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loadingApproveId, setLoadingApproveId] = useState<string | null>(null);
  const [loadingRejectId, setLoadingRejectId] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        const data = await getIncomingRequests();
        setRequests(data || []);
      } catch (err) {
        toast.error("Failed to load requests");
      }
    };
    fetchIncomingRequests();
  }, []);

  {
    /* Test handlers */
  }

  const handleApprove = async (requestId: string) => {
    setLoadingApproveId(requestId);
    try {
      await approveRequest(requestId);
      toast.success("Co-founder request approved!");
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      toast.error("Failed to approve request");
    } finally {
      setLoadingApproveId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setLoadingRejectId(requestId);
    try {
      await rejectRequest(requestId);
      toast.success("Request rejected");
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      toast.error("Failed to reject request");
    } finally {
      setLoadingRejectId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <section className="bg-[#F3F4F6] p-8 rounded-2xl text-center">
        <Image
          src="/svg/no-data.svg"
          width={180}
          height={180}
          alt="No requests"
          className="mx-auto"
        />
        <p className="mt-4 text-muted-foreground">No co-founder requests yet</p>
      </section>
    );
  }
  return (
    <section className="bg-[#F3F4F6] p-2 rounded-2xl shrink-0">
      <p className="font-semibold text-[1.2em] py-2">Co-founder Requests</p>
      {/* <div className="flex flex-col gap-4">Your request cards</div> */}
      <div className="space-y-4">
        {requests.map((request: ConnectionRequest) => {
          const fullName =
            `${request.sender.firstName} ${request.sender.lastName}`.trim();

          return (
            <RequestCard
              key={request.id}
              props={{
                image: "",
                userId: request.sender.id,
                alt: "",
                name: `${request.sender.firstName} ${request.sender.lastName}`,
                email: request.sender.email,
                available: "",
                timeAvailable: "",
                details: "",
                keyValue: {
                  department: "",
                  role: "",
                  backgroundColour: "#e5e7eb",
                  dotColour: "#6b7280",
                },
                isLoadingApprove: loadingApproveId === request.id,
                isLoadingReject: loadingRejectId === request.id,
                handleApprove: () => handleApprove(request.id),
                handleReject: () => handleReject(request.id),
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

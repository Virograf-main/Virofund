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
      <section className="bg-white rounded-2xl p-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">📬</span>
          </div>
          <h3 className="font-semibold text-[#1C1A16]">No requests yet</h3>
          <p className="text-sm text-gray-400 max-w-[220px]">
            When someone wants to connect with you as a co-founder, their
            request will show up here.
          </p>
        </div>
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

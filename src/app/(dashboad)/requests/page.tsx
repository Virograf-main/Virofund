"use client";

import { Loader } from "@/components/atoms";
import RequestCard from "@/components/molecules/request-card";
import {
  getIncomingRequests,
  approveRequest,
  rejectRequest,
} from "@/lib/matches";
import { ConnectionRequest } from "@/types/matches";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const RequestPage = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loadingApproveId, setLoadingApproveId] = useState<string | null>(null);
  const [loadingRejectId, setLoadingRejectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        setLoading(true);
        const data = await getIncomingRequests();
        setRequests(data || []);
      } catch (err) {
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
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
      </div>
    );
  }
  return (
    <section className="bg-[#F3F4F6] p-6 rounded-2xl">
      <p className="font-bold text-xl mb-6">Co-founder Requests</p>

      <div className="space-y-4">
        {requests.map((request: ConnectionRequest) => {
          return (
            <RequestCard
              key={request.id}
              props={{
                image: "",
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
                userId: `${request.sender.id}`,
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

export default RequestPage;

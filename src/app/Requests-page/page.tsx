"use client";

import { useEffect, useState } from "react";
import RequestCard from "@/components/molecules/request-card";
import {
  getIncomingRequests,
  approveRequest,
  rejectRequest,
} from "@/lib/requests";
import Image from "next/image";

interface IncomingRequest {
  id: string;
  image?: string;
  name: string;
  email: string;
  available: boolean;
  timeRange: string;
  details: string;
  department: string;
  role: string;
  departmentColor: string;
  dotColor: string;
}

export default function RequestsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<IncomingRequest[]>([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const data = await getIncomingRequests();
        setRequests(data || []);
      } catch (err) {
        console.error("Error loading requests:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        Loading incoming requests...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="flex flex-col gap-4">
          <Image
            src="/svg/no-data.svg"
            width={200}
            height={200}
            alt="no data"
          />
          <p className="text-center text-sm">No Incoming Requests</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {requests.map((req) => (
        <RequestCard
          key={req.id}
          props={{
            image: req.image,
            alt: req.name,
            name: req.name,
            email: req.email,
            available: req.available ? "Available" : "Unavailable", 
            timeAvailable: req.timeRange,
            details: req.details,
            keyValue: {
              department: req.department,
              role: req.role,
              backgroundColour: req.departmentColor,
              dotColour: req.dotColor,
            },
            handleApprove: () => approveRequest(req.id),
            handleReject: () => rejectRequest(req.id),
          }}
        />
      ))}
    </div>
  );
}

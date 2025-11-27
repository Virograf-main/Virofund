"use client";

import RequestCard from "@/components/molecules/request-card";
import { getIncomingRequests } from "@/lib/matches";
import { ConnectionRequest } from "@/types/matches";
import Image from "next/image";
import { useEffect, useState } from "react";

export const RequestSection = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      const data = await getIncomingRequests();
      if (!data) {
        return;
      }
      setRequests(data);
    };
    fetchIncomingRequests();
  });
  return (
    <section className="bg-[#F3F4F6] p-2 rounded-2xl flex-shrink-0">
      <p className="font-semibold text-[1.2em] py-2">Co-founder Requests</p>
      {/* <div className="flex flex-col gap-4">Your request cards</div> */}
      {requests.length > 0 ? (
        <div className="flex flex-col gap-4">
          {requests.map((request) => (
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
                  backgroundColour: "",
                  dotColour: "",
                },
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="flex flex-col gap-4">
            <Image
              src="/svg/no-data.svg"
              width={200}
              height={200}
              alt="no data"
            />
            <p className="text-center">No Co-founder Requests</p>
          </div>
          {/* <RequestCard props={} /> */}
        </div>
      )}
    </section>
  );
};

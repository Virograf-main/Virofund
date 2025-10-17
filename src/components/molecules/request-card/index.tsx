import Image from "next/image";
import React from "react";
import KeyValue from "../../atoms/keyvalue-pair";
import { Button } from "../../atoms";
import { Timer } from "lucide-react";
import { MoreVerticalDots } from "../../atoms/more-vertical";
import SmallPfp from "@/components/atoms/small-pfp";

type RequestCardProps = {
  image?: string;
  alt?: string;
  name: string;
  email: string;
  available: string;
  timeAvailable?: string;
  details: string;
  keyValue: {
    department: string;
    role: string;
    backgroundColour: string;
    dotColour: string;
  };
  handleApprove?: () => void;
  handleReject?: () => void;
};

const RequestCard = ({
  props,
  className = "",
}: {
  props: RequestCardProps;
  className?: string;
}) => {
  const titles = [
    {
      title: "Department",
      content: props.keyValue.department,
    },
    {
      title: "Job Title",
      content: props.keyValue.role,
    },
  ];

  return (
    <div
      className={`p-3 bg-background font-medium rounded-lg ${className}`}
      style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
    >
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <SmallPfp
              props={{
                image: props.image,
                alt: props.alt,
              }}
            />
            <div className="flex flex-col gap-">
              <p className=" text-[12px]">{props.name}</p>
              <p className=" text-[10px] text-muted-foreground">
                {props.email}
              </p>
            </div>
          </div>
          <div>
            <MoreVerticalDots
              className="inline-flex w-auto h-auto shrink-0 border border-muted-foreground rounded-sm p-1"
              iconSize={10}
            />
          </div>
        </div>
        <div className="flex items-center gap-1  text-[10px] text-muted-foreground">
          <p>{props.available}</p>
          {props.timeAvailable && <Timer size={10} className="" />}
          <p>{props.timeAvailable}</p>
        </div>
      </div>
      <p className="py-2  text-[10px]">{props.details}</p>
      <div className="flex gap-4">
        {titles.map((value, idx) => {
          const isJob = value.title === "Job Title";
          return (
            <div key={idx}>
              <KeyValue
                className="space-y-1"
                label={{
                  value: value.title,
                  className: "text-muted-foreground text-[8px]",
                }}
              >
                {!isJob ? (
                  <div
                    className={`flex gap-0.5 items-center rounded-full px-1 text-[10px]`}
                    style={{ backgroundColor: props.keyValue.backgroundColour }}
                  >
                    <div
                      className={`w-1 h-1 rounded-full`}
                      style={{ backgroundColor: props.keyValue.dotColour }}
                    ></div>
                    <p className="">{props.keyValue.department}</p>
                  </div>
                ) : (
                  <div className=" text-[10px]">{props.keyValue.role}</div>
                )}
              </KeyValue>
            </div>
          );
        })}
      </div>
      <div className="flex gap-2 justify-between ">
        <Button
          className="flex-1 bg-transparent border border-primary text-foreground text-[10px]"
          onClick={props.handleApprove}
        >
          Approve
        </Button>
        <Button
          className="flex-1 bg-transparent border border-destructive hover:bg-destructive text-foreground text-[10px]"
          onClick={props.handleReject}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default RequestCard;

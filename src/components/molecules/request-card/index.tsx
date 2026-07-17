import { Button } from "@/components/atoms";
import SmallPfp from "@/components/atoms/small-pfp";
import KeyValue from "@/components/atoms/keyvalue-pair";
import { MoreVerticalDots } from "@/components/atoms/more-vertical";
import { Loader2 } from "lucide-react";
import { UserRoundSearch } from "lucide-react";
import Link from "next/link";
type RequestCardProps = {
  image?: string;
  alt?: string;
  name: string;
  email: string;
  available?: string;
  timeAvailable?: string;
  details?: string;
  keyValue: {
    department?: string;
    role?: string;
    backgroundColour?: string;
    dotColour?: string;
  };
  isLoadingApprove?: boolean;
  isLoadingReject?: boolean;
  handleApprove?: () => void;
  handleReject?: () => void;
  userId: string;
};

const RequestCard = ({
  props,
  className = "",
}: {
  props: RequestCardProps;
  className?: string;
}) => {
  const {
    image,
    alt,
    name,
    email,
    available = "",
    timeAvailable = "",
    details = "",
    keyValue,
    isLoadingApprove = false,
    isLoadingReject = false,
    handleApprove,
    handleReject,
    userId,
  } = props;

  return (
    <div
      className={`p-5 bg-card rounded-2xl border border-border shadow-sm transition-all ${
        isLoadingApprove || isLoadingReject ? "opacity-70" : "hover:shadow-md"
      } ${className}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <SmallPfp props={{ image, alt: alt || name }} />
            <div>
              <p className="font-semibold text-base">{name}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          <Link href={`/profile/${userId}`}>
            <UserRoundSearch size={18} />
          </Link>
        </div>

        {/* Optional fields – hidden when empty */}
        {(available || timeAvailable || details) && (
          <div className="text-sm text-muted-foreground space-y-1">
            {available && <p>{available}</p>}
            {timeAvailable && <p>{timeAvailable}</p>}
            {details && <p>{details}</p>}
          </div>
        )}

        {/* Department & Role – only show if data exists */}
        {(keyValue.department || keyValue.role) && (
          <div className="flex gap-6">
            {keyValue.department && (
              <KeyValue
                label={{
                  value: "Department",
                  className: "text-xs text-muted-foreground",
                }}
              >
                <div
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: keyValue.backgroundColour
                      ? `${keyValue.backgroundColour}30`
                      : "#f3f4f6",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: keyValue.dotColour || "#6b7280" }}
                  />
                  <span style={{ color: keyValue.dotColour || "inherit" }}>
                    {keyValue.department}
                  </span>
                </div>
              </KeyValue>
            )}
            {keyValue.role && (
              <KeyValue
                label={{
                  value: "Job Title",
                  className: "text-xs text-muted-foreground",
                }}
              >
                <span className="text-sm font-medium">{keyValue.role}</span>
              </KeyValue>
            )}
          </div>
        )}

        {/* Action Buttons 😂😁*/}
        <div className="flex gap-4">
          <Button
            onClick={handleApprove}
            disabled={isLoadingApprove || isLoadingReject}
            className="bg-transparent flex-1 h-12 rounded-xl border-2 border-primary/50 text-primary font-medium hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isLoadingApprove ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Approve"
            )}
          </Button>

          <Button
            onClick={handleReject}
            disabled={isLoadingApprove || isLoadingReject}
            className="bg-transparent flex-1 h-12 rounded-xl border-2 border-destructive/50 text-destructive font-medium hover:bg-destructive/10 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isLoadingReject ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Reject"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;

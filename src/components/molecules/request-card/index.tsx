import { Button } from "@/components/atoms";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Star, UserRoundSearch } from "lucide-react";
import Link from "next/link";

type RequestCardProps = {
  name: string;
  email: string;
  userId: string;
  compatibilityScore?: number;
  status?: string;
  createdAt?: string;
  isLoadingApprove?: boolean;
  isLoadingReject?: boolean;
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
  const {
    name,
    email,
    userId,
    compatibilityScore,
    status,
    createdAt,
    isLoadingApprove = false,
    isLoadingReject = false,
    handleApprove,
    handleReject,
  } = props;

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const scorePercent = compatibilityScore
    ? Math.round(compatibilityScore * 100)
    : null;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const isDisabled = isLoadingApprove || isLoadingReject;

  return (
    <div
      className={`bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow ${
        isDisabled ? "opacity-70" : ""
      } ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Score badge */}
          {scorePercent && (
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-emerald-500 stroke-none" />
              {scorePercent}%
            </div>
          )}

          {/* View profile */}
          <Link
            href={`/profile/${userId}`}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <UserRoundSearch size={16} />
          </Link>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between">
        {/* Status badge */}
        {status && (
          <span
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
              status === "pending"
                ? "bg-yellow-50 text-yellow-600"
                : status === "accepted"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}

        {formattedDate && (
          <p className="text-[11px] text-gray-400">{formattedDate}</p>
        )}
      </div>

      {/* Actions — only show if pending */}
      {status === "pending" && (
        <div className="flex gap-3 pt-1">
          <Button
            onClick={handleApprove}
            disabled={isDisabled}
            className="bg-transparent flex-1 h-10 rounded-xl border-2 border-green-500 text-green-600 text-sm font-medium hover:bg-green-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isLoadingApprove ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Approving...
              </span>
            ) : (
              "Approve"
            )}
          </Button>

          <Button
            onClick={handleReject}
            disabled={isDisabled}
            className="bg-transparent flex-1 h-10 rounded-xl border-2 border-red-400 text-red-500 text-sm font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {isLoadingReject ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Rejecting...
              </span>
            ) : (
              "Reject"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;

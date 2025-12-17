// import Image from "next/image";
// import React from "react";
// import KeyValue from "../../atoms/keyvalue-pair";
// import { Button } from "../../atoms";
// import { Timer } from "lucide-react";
// import { MoreVerticalDots } from "../../atoms/more-vertical";
// import SmallPfp from "@/components/atoms/small-pfp";

// type RequestCardProps = {
//   image?: string;
//   alt?: string;
//   name: string;
//   email: string;
//   available: string;
//   timeAvailable?: string;
//   details: string;
//   keyValue: {
//     department: string;
//     role: string;
//     backgroundColour: string;
//     dotColour: string;
//   };
//   handleApprove?: () => void;
//   handleReject?: () => void;
// };

// const RequestCard = ({
//   props,
//   className = "",
// }: {
//   props: RequestCardProps;
//   className?: string;
// }) => {
//   const titles = [
//     {
//       title: "Department",
//       content: props.keyValue.department,
//     },
//     {
//       title: "Job Title",
//       content: props.keyValue.role,
//     },
//   ];

//   return (
//     <div
//       className={`p-3 bg-background font-medium rounded-lg ${className}`}
//       style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
//     >
//       <div className="space-y-2">
//         <div className="flex justify-between">
//           <div className="flex gap-2 items-center">
//             <SmallPfp
//               props={{
//                 image: props.image,
//                 alt: props.alt,
//               }}
//             />
//             <div className="flex flex-col gap-">
//               <p className=" text-[12px]">{props.name}</p>
//               <p className=" text-[10px] text-muted-foreground">
//                 {props.email}
//               </p>
//             </div>
//           </div>
//           <div>
//             <MoreVerticalDots
//               className="inline-flex w-auto h-auto shrink-0 border border-muted-foreground rounded-sm p-1"
//               iconSize={10}
//             />
//           </div>
//         </div>
//         <div className="flex items-center gap-1  text-[10px] text-muted-foreground">
//           <p>{props.available}</p>
//           {props.timeAvailable && <Timer size={10} className="" />}
//           <p>{props.timeAvailable}</p>
//         </div>
//       </div>
//       <p className="py-2  text-[10px]">{props.details}</p>
//       <div className="flex gap-4">
//         {titles.map((value, idx) => {
//           const isJob = value.title === "Job Title";
//           return (
//             <div key={idx}>
//               <KeyValue
//                 className="space-y-1"
//                 label={{
//                   value: value.title,
//                   className: "text-muted-foreground text-[8px]",
//                 }}
//               >
//                 {!isJob ? (
//                   <div
//                     className={`flex gap-0.5 items-center rounded-full px-1 text-[10px]`}
//                     style={{ backgroundColor: props.keyValue.backgroundColour }}
//                   >
//                     <div
//                       className={`w-1 h-1 rounded-full`}
//                       style={{ backgroundColor: props.keyValue.dotColour }}
//                     ></div>
//                     <p className="">{props.keyValue.department}</p>
//                   </div>
//                 ) : (
//                   <div className=" text-[10px]">{props.keyValue.role}</div>
//                 )}
//               </KeyValue>
//             </div>
//           );
//         })}
//       </div>
//       <div className="flex gap-2 justify-between ">
//         <Button
//           className="flex-1 bg-transparent border border-primary text-foreground text-[10px]"
//           onClick={props.handleApprove}
//         >
//           Approve
//         </Button>
//         <Button
//           className="flex-1 bg-transparent border border-destructive hover:bg-destructive text-foreground text-[10px]"
//           onClick={props.handleReject}
//         >
//           Reject
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default RequestCard;

// components/molecules/request-card.tsx
// import { Button } from "@/components/atoms";
// import SmallPfp from "@/components/atoms/small-pfp";
// import KeyValue from "@/components/atoms/keyvalue-pair";
// import { MoreVerticalDots } from "@/components/atoms/more-vertical";
// import { Loader2 } from "lucide-react";

// type RequestCardProps = {
//   image?: string;
//   alt?: string;
//   name: string;
//   email: string;
//   available?: string;
//   timeAvailable?: string;
//   details?: string;
//   keyValue: {
//     department?: string;
//     role?: string;
//     backgroundColour?: string;
//     dotColour?: string;
//   };
//   loading?: boolean;
//   handleApprove?: () => void;
//   handleReject?: () => void;
// };

// const RequestCard = ({
//   props,
//   className = "",
// }: {
//   props: RequestCardProps;
//   className?: string;
// }) => {
//   const {
//     image,
//     alt,
//     name,
//     email,
//     available = "",
//     timeAvailable = "",
//     details = "",
//     keyValue,
//     loading = false,
//     handleApprove,
//     handleReject,
//   } = props;

//   return (
//     <div
//       className={`p-5 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all ${
//         loading ? "opacity-70" : "hover:shadow-md"
//       } ${className}`}
//     >
//       <div className="space-y-4">
//         {/* Header */}
//         <div className="flex justify-between items-start">
//           <div className="flex gap-3 items-center">
//             <SmallPfp props={{ image, alt: alt || name }} />
//             <div>
//               <p className="font-semibold text-base">{name}</p>
//               <p className="text-sm text-muted-foreground">{email}</p>
//             </div>
//           </div>
//           <MoreVerticalDots className="text-gray-400" iconSize={18} />
//         </div>

//         {/* Optional fields – hidden when empty */}
//         {(available || timeAvailable || details) && (
//           <div className="text-sm text-gray-600 space-y-1">
//             {available && <p>{available}</p>}
//             {timeAvailable && <p>{timeAvailable}</p>}
//             {details && <p>{details}</p>}
//           </div>
//         )}

//         {/* Department & Role – only show if data exists */}
//         {(keyValue.department || keyValue.role) && (
//           <div className="flex gap-6">
//             {keyValue.department && (
//               <KeyValue
//                 label={{
//                   value: "Department",
//                   className: "text-xs text-gray-500",
//                 }}
//               >
//                 <div
//                   className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
//                   style={{
//                     backgroundColor: keyValue.backgroundColour
//                       ? `${keyValue.backgroundColour}30`
//                       : "#f3f4f6",
//                   }}
//                 >
//                   <div
//                     className="w-2 h-2 rounded-full"
//                     style={{ backgroundColor: keyValue.dotColour || "#6b7280" }}
//                   />
//                   <span style={{ color: keyValue.dotColour || "inherit" }}>
//                     {keyValue.department}
//                   </span>
//                 </div>
//               </KeyValue>
//             )}
//             {keyValue.role && (
//               <KeyValue
//                 label={{
//                   value: "Job Title",
//                   className: "text-xs text-gray-500",
//                 }}
//               >
//                 <span className="text-sm font-medium">{keyValue.role}</span>
//               </KeyValue>
//             )}
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex gap-4">
//           <Button
//             onClick={handleApprove}
//             disabled={loading}
//             className="flex-1 h-12 rounded-xl border-2 border-green-500 text-green-600 font-medium hover:bg-green-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
//           >
//             {loading === "approve" ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               "Approve"
//             )}
//           </Button>

//           <Button
//             onClick={handleReject}
//             disabled={loading}
//             className="flex-1 h-12 rounded-xl border-2 border-red-500 text-red-600 font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
//           >
//             {loading === "reject" ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               "Reject"
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RequestCard;

// import Image from "next/image";
// import React from "react";
// import KeyValue from "../../atoms/keyvalue-pair";
// import { Button } from "../../atoms";
// import { Timer } from "lucide-react";
// import { MoreVerticalDots } from "../../atoms/more-vertical";
// import SmallPfp from "@/components/atoms/small-pfp";

// type RequestCardProps = {
//   image?: string;
//   alt?: string;
//   name: string;
//   email: string;
//   available: string;
//   timeAvailable?: string;
//   details: string;
//   keyValue: {
//     department: string;
//     role: string;
//     backgroundColour: string;
//     dotColour: string;
//   };
//   handleApprove?: () => void;
//   handleReject?: () => void;
// };

// const RequestCard = ({
//   props,
//   className = "",
// }: {
//   props: RequestCardProps;
//   className?: string;
// }) => {
//   const titles = [
//     {
//       title: "Department",
//       content: props.keyValue.department,
//     },
//     {
//       title: "Job Title",
//       content: props.keyValue.role,
//     },
//   ];

//   return (
//     <div
//       className={`p-3 bg-background font-medium rounded-lg ${className}`}
//       style={{ fontFamily: "var(--font-plus-jakarta-sans)" }}
//     >
//       <div className="space-y-2">
//         <div className="flex justify-between">
//           <div className="flex gap-2 items-center">
//             <SmallPfp
//               props={{
//                 image: props.image,
//                 alt: props.alt,
//               }}
//             />
//             <div className="flex flex-col gap-">
//               <p className=" text-[12px]">{props.name}</p>
//               <p className=" text-[10px] text-muted-foreground">
//                 {props.email}
//               </p>
//             </div>
//           </div>
//           <div>
//             <MoreVerticalDots
//               className="inline-flex w-auto h-auto shrink-0 border border-muted-foreground rounded-sm p-1"
//               iconSize={10}
//             />
//           </div>
//         </div>
//         <div className="flex items-center gap-1  text-[10px] text-muted-foreground">
//           <p>{props.available}</p>
//           {props.timeAvailable && <Timer size={10} className="" />}
//           <p>{props.timeAvailable}</p>
//         </div>
//       </div>
//       <p className="py-2  text-[10px]">{props.details}</p>
//       <div className="flex gap-4">
//         {titles.map((value, idx) => {
//           const isJob = value.title === "Job Title";
//           return (
//             <div key={idx}>
//               <KeyValue
//                 className="space-y-1"
//                 label={{
//                   value: value.title,
//                   className: "text-muted-foreground text-[8px]",
//                 }}
//               >
//                 {!isJob ? (
//                   <div
//                     className={`flex gap-0.5 items-center rounded-full px-1 text-[10px]`}
//                     style={{ backgroundColor: props.keyValue.backgroundColour }}
//                   >
//                     <div
//                       className={`w-1 h-1 rounded-full`}
//                       style={{ backgroundColor: props.keyValue.dotColour }}
//                     ></div>
//                     <p className="">{props.keyValue.department}</p>
//                   </div>
//                 ) : (
//                   <div className=" text-[10px]">{props.keyValue.role}</div>
//                 )}
//               </KeyValue>
//             </div>
//           );
//         })}
//       </div>
//       <div className="flex gap-2 justify-between ">
//         <Button
//           className="flex-1 bg-transparent border border-primary text-foreground text-[10px]"
//           onClick={props.handleApprove}
//         >
//           Approve
//         </Button>
//         <Button
//           className="flex-1 bg-transparent border border-destructive hover:bg-destructive text-foreground text-[10px]"
//           onClick={props.handleReject}
//         >
//           Reject
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default RequestCard;

// components/molecules/request-card.tsx
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
      className={`p-5 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all ${
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
          <div className="text-sm text-gray-600 space-y-1">
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
                  className: "text-xs text-gray-500",
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
                  className: "text-xs text-gray-500",
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
            className="bg-transparent flex-1 h-12 rounded-xl border-2 border-green-500 text-green-600 font-medium hover:bg-green-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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
            className="bg-transparent flex-1 h-12 rounded-xl border-2 border-red-500 text-red-600 font-medium hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
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

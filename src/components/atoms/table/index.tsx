// // components/atoms/DataTable.tsx
"use client";

import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useTableStore } from "@/store/useTableStore";
import { Loader } from "@/components/atoms/loader";

/* -------------------------------------------------
   Column definition – strongly typed
   ------------------------------------------------- */
export interface Column<T> {
  key: keyof T; // no arbitrary strings
  header: string;
}

/* -------------------------------------------------
   Props – generic typed table
   ------------------------------------------------- */
export interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  rowsPerPage?: number;
  caption?: string;
  className?: string;
  rowFn?: (row: T) => void;
  breakMinWidth?: number;
  fluidBreakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
}

/* -------------------------------------------------
   Helper – safe cell rendering
   ------------------------------------------------- */
const renderCell = (value: unknown): React.ReactNode => {
  if (React.isValidElement(value)) return value;
  if (value === null || value === undefined) return "";
  if (["string", "number", "boolean"].includes(typeof value)) {
    return String(value);
  }
  return JSON.stringify(value);
};

/* -------------------------------------------------
   Main Component
   ------------------------------------------------- */
export function DataTable<T extends object>({
  columns,
  data,
  rowsPerPage = 5,
  caption,
  className,
  rowFn,
  breakMinWidth = 900,
  fluidBreakpoint = "lg",
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
  const start = (page - 1) * rowsPerPage;
  const paginatedData = data.slice(start, start + rowsPerPage);

  const handleNext = () => page < totalPages && setPage((p) => p + 1);
  const handlePrev = () => page > 1 && setPage((p) => p - 1);

  const { loading } = useTableStore();

  return (
    <div className={cn("w-full", className)}>
      {/* LOADING STATE */}
      {loading ? (
        <div className="flex flex-col items-center py-10">
          <div className="w-[40px] mb-2">
            <Loader />
          </div>
          <p className="text-gray-500">Generating matches...</p>
        </div>
      ) : data.length === 0 ? (
        /* NO DATA STATE */
        <div className="flex flex-col items-center py-10">
          <p className="text-gray-500">No data available</p>
        </div>
      ) : (
        /* TABLE CONTENT */
        <div className="w-full">
          <div className="border rounded-lg w-full bg-white">
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto w-full">
                <div className="inline-block min-w-full align-middle">
                  <table
                    className={cn(
                      "w-full border-collapse text-xs sm:text-sm min-w-[900px]",
                      `${fluidBreakpoint}:min-w-0`
                    )}
                  >
                    {/* CAPTION */}
                    {caption && (
                      <caption className="text-xs sm:text-sm text-gray-500 py-2">
                        {caption}
                      </caption>
                    )}

                    {/* HEADER */}
                    <thead className="bg-primary text-white">
                      <tr>
                        {columns.map((col) => (
                          <th
                            key={String(col.key)}
                            className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold whitespace-nowrap"
                          >
                            {col.header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* BODY */}
                    <tbody>
                      {paginatedData.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => rowFn?.(row)}
                        >
                          {columns.map((col) => (
                            <td
                              key={String(col.key)}
                              className="px-2 sm:px-4 py-2 whitespace-nowrap"
                            >
                              {renderCell(row[col.key])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent className="flex justify-end gap-2">
            {/* Prev */}
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrev}
                className={cn("cursor-pointer", page === 1 && "opacity-50")}
              />
            </PaginationItem>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "cursor-pointer",
                    page === i + 1
                      ? "bg-gray-700 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                className={cn(
                  "cursor-pointer",
                  page === totalPages && "opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}













// "use client";

// import * as React from "react";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationPrevious,
//   PaginationNext,
// } from "@/components/ui/pagination";
// import { cn } from "@/lib/utils";
// import { useTableStore } from "@/store/useTableStore";
// import { Loader } from "@/components/atoms/loader";

// /* -------------------------------------------------
//    1. Column definition – key must exist on the row
//    ------------------------------------------------- */
// export interface Column<T> {
//   key: keyof T; // ← no string, only real keys
//   header: string;
// }

// /* -------------------------------------------------
//    2. Props – generic over the row type
//    ------------------------------------------------- */
// export interface DataTableProps<T extends object> {
//   columns: Column<T>[];
//   data: T[];
//   rowsPerPage?: number;
//   caption?: string;
//   className?: string;
//   rowFn?: (row: T) => void;
//   /** Minimum width (px) at which the table will stop shrinking and start scrolling. */
//   breakMinWidth?: number;
//   /** Breakpoint at which table becomes fluid (Tailwind breakpoint names) */
//   fluidBreakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
// }

// /* -------------------------------------------------
//    3. Component – fully typed
//    ------------------------------------------------- */
// const renderCell = (value: unknown): React.ReactNode => {
//   if (React.isValidElement(value)) {
//     return value;
//   }
//   if (value === null || value === undefined) {
//     return "";
//   }
//   if (
//     typeof value === "string" ||
//     typeof value === "number" ||
//     typeof value === "boolean"
//   ) {
//     return String(value);
//   }
//   // Fallback: JSON stringify objects/arrays
//   return JSON.stringify(value);
// };
// export function DataTable<T extends object>({
//   columns,
//   data,
//   rowsPerPage = 5,
//   caption,
//   className,
//   rowFn,
//   breakMinWidth = 900,
//   fluidBreakpoint = "lg",
// }: DataTableProps<T>) {
//   const [page, setPage] = React.useState(1);
//   const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
//   const start = (page - 1) * rowsPerPage;
//   const paginatedData = data.slice(start, start + rowsPerPage);

//   const handleNext = () => page < totalPages && setPage((p) => p + 1);
//   const handlePrev = () => page > 1 && setPage((p) => p - 1);

//   const { loading } = useTableStore();

//   // Responsive min-width: e.g. "min-w-[900px] lg:min-w-0"

//   // const minWidthClass = `min-w-[${breakMinWidth}px] ${fluidBreakpoint}:min-w-0`;
//   const minWidthClass = `min-w-full ${fluidBreakpoint}:min-w-0`;


//   return (
//     <div className={cn("w-full", className)}>
//       {loading ? (
//         <div className="flex flex-col items-center py-10">
//           <div className="w-[40px] mb-2">
//             <Loader />
//           </div>
//           <p className="text-gray-500">Generating matches...</p>
//         </div>
//       ) :
//       data.length === 0 ? 
//       (
//          <div className="flex flex-col items-center py-10">
//           {/* <div className="w-[40px] mb-2">
//             <Loader />
//           </div> */}
//           <p className="text-gray-500">No data available</p>
//         </div>
//       )
//       :
//       (
//         <div className="w-full">
//           <div className="border rounded-lg w-full bg-white">

//             <div className="w-full overflow-hidden">
//               <div className="overflow-x-auto w-full">
//                 <div className="inline-block min-w-full align-middle">
//                   <table
//                     className={cn(
//                       "w-full border-collapse text-xs sm:text-sm min-w-[900px]",
//                       `${fluidBreakpoint}:min-w-0`
//                     )}
//                   >
//                     {caption && (
//                       <caption className="text-xs sm:text-sm text-gray-500 py-2">
//                         {caption}
//                       </caption>
//                     )}

//                     <thead className="bg-primary text-white">
//                       <tr>
//                         {columns.map((col) => (
//                           <th
//                             key={String(col.key)}
//                             className="px-2 sm:px-4 py-2 sm:py-3 text-left font-semibold whitespace-nowrap"
//                           >
//                             {col.header}
//                           </th>
//                         ))}
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan={columns.length}
//                         className="text-center py-8 text-gray-500"
//                       >
//                         No data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>

                
//               </table>
//             </div>

//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Pagination className="mt-4">
//           <PaginationContent className="flex justify-end gap-2">
//             <PaginationItem>
//               <PaginationPrevious
//                 onClick={handlePrev}
//                 className={cn("cursor-pointer", page === 1 && "opacity-50")}
//               />
//             </PaginationItem>

//             {Array.from({ length: totalPages }, (_, i) => (
//               <PaginationItem key={i}>
//                 <PaginationLink
//                   isActive={page === i + 1}
//                   onClick={() => setPage(i + 1)}
//                   className={cn(
//                     "cursor-pointer",
//                     page === i + 1
//                       ? "bg-gray-700 text-white"
//                       : "text-gray-500 hover:bg-gray-100"
//                   )}
//                 >
//                   {i + 1}
//                 </PaginationLink>
//               </PaginationItem>
//             ))}

//             <PaginationItem>
//               <PaginationNext
//                 onClick={handleNext}
//                 className={cn(
//                   "cursor-pointer",
//                   page === totalPages && "opacity-50"
//                 )}
//               />
//             </PaginationItem>
//           </PaginationContent>
//         </Pagination>
//       )}
//     </div>
//   );
// }














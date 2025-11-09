// components/atoms/DataTable.tsx
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
   1. Column definition – key must exist on the row
   ------------------------------------------------- */
export interface Column<T> {
  key: keyof T; // ← no string, only real keys
  header: string;
}

/* -------------------------------------------------
   2. Props – generic over the row type
   ------------------------------------------------- */
export interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  rowsPerPage?: number;
  caption?: string;
  className?: string;
  rowFn?: (row: T) => void;
  /** Minimum width (px) at which the table will stop shrinking and start scrolling. */
  breakMinWidth?: number;
  /** Breakpoint at which table becomes fluid (Tailwind breakpoint names) */
  fluidBreakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
}

/* -------------------------------------------------
   3. Component – fully typed
   ------------------------------------------------- */
const renderCell = (value: unknown): React.ReactNode => {
  if (React.isValidElement(value)) {
    return value;
  }
  if (value === null || value === undefined) {
    return "";
  }
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }
  // Fallback: JSON stringify objects/arrays
  return JSON.stringify(value);
};
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

  // Responsive min-width: e.g. "min-w-[900px] lg:min-w-0"
  const minWidthClass = `min-w-[${breakMinWidth}px] ${fluidBreakpoint}:min-w-0`;

  return (
    <div className={cn("w-full", className)}>
      {loading ? (
        <div className="flex flex-col items-center py-10">
          <div className="w-[40px] mb-2">
            <Loader />
          </div>
          <p className="text-gray-500">Generating matches...</p>
        </div>
      ) : (
        <div className="w-full">
          <div className="border rounded-lg w-full bg-white">
            <div className="overflow-x-auto w-full">
              <table
                className={cn("w-full border-collapse text-sm", minWidthClass)}
              >
                {caption && (
                  <caption className="text-sm text-gray-500 py-2">
                    {caption}
                  </caption>
                )}

                <thead className="bg-primary text-white">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={String(col.key)}
                        className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, i) => (
                      <tr
                        key={i}
                        onClick={() => rowFn?.(row)}
                        className="border-b hover:bg-secondary transition-colors duration-200 cursor-pointer"
                      >
                        {columns.map((col) => (
                          <td
                            key={String(col.key)}
                            className="px-4 py-3 whitespace-nowrap"
                          >
                            {renderCell(row[col.key])}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="text-center py-8 text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent className="flex justify-end gap-2">
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrev}
                className={cn("cursor-pointer", page === 1 && "opacity-50")}
              />
            </PaginationItem>

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

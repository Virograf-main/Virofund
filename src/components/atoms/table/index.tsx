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

export interface Column<T> {
  key: keyof T;
  header: string;
}

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

const renderCell = (value: unknown): React.ReactNode => {
  if (React.isValidElement(value)) return value;
  if (value === null || value === undefined) return "";
  if (["string", "number", "boolean"].includes(typeof value)) {
    return String(value);
  }
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

  const { loading } = useTableStore();

  const handleNext = () => page < totalPages && setPage(p => p + 1);
  const handlePrev = () => page > 1 && setPage(p => p - 1);

  return (
    <div className={cn("w-full", className)}>
      {loading ? (
        <div className="flex flex-col items-center py-10">
          <div className="w-[40px] mb-2">
            <Loader />
          </div>
          <p className="text-muted-foreground">Generating matches...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center py-10">
          <p className="text-muted-foreground">No data available</p>
        </div>
      ) : (
        <div className="w-full">
          <div className="border border-border rounded-lg w-full bg-card">
            <div className="w-full overflow-hidden">
              <div className="overflow-x-auto w-full">
                <div className="inline-block min-w-full align-middle">
                  <table
                    className={cn(
                      "w-full border-collapse text-xs sm:text-sm min-w-[900px]",
                      `${fluidBreakpoint}:min-w-0`
                    )}
                  >
                    {caption && (
                      <caption className="text-xs sm:text-sm text-muted-foreground py-2">
                        {caption}
                      </caption>
                    )}

                    {/* HEADER */}
                    <thead className="bg-primary text-primary-foreground">
                      <tr>
                        {columns.map(col => (
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
                          className="border-b border-border hover:bg-muted/50 cursor-pointer"
                          onClick={() => rowFn?.(row)}
                        >
                          {columns.map(col => (
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
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted"
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






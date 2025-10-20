"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
type DataTableProps<T extends Record<string, any>> = {
  columns: { key: string; header: string }[];
  data: T[];
  rowsPerPage?: number;
  caption?: string;
  className?: string;
};
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowsPerPage = 5,
  caption,
  className,
}: DataTableProps<T>) {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const start = (page - 1) * rowsPerPage;
  const paginatedData = data.slice(start, start + rowsPerPage);
  const handleNext = () => page < totalPages && setPage(page + 1);
  const handlePrev = () => page > 1 && setPage(page - 1);
  return (
    <>
      {" "}
      <Table>
        {" "}
        {caption && (
          <TableCaption className="text-gray-400 bg-white">
            {" "}
            {caption}{" "}
          </TableCaption>
        )}{" "}
        <TableHeader className="bg-primary hover:bg-primary">
          {" "}
          <TableRow className="text-white">
            {" "}
            {columns.map((col) => (
              <TableHead
                key={String(col.key)}
                className="px-4 py-3 whitespace-nowrap"
              >
                {" "}
                {col.header}{" "}
              </TableHead>
            ))}{" "}
          </TableRow>{" "}
        </TableHeader>{" "}
        <TableBody className="bg-white">
          {" "}
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-secondary transition-colors duration-300 cursor-default"
              >
                {" "}
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    className="px-4 py-3 whitespace-nowrap"
                  >
                    {" "}
                    {React.isValidElement(row[col.key])
                      ? row[col.key]
                      : String(row[col.key] ?? "")}{" "}
                  </TableCell>
                ))}{" "}
              </TableRow>
            ))
          ) : (
            <TableRow>
              {" "}
              <TableCell colSpan={columns.length} className="text-center py-6">
                {" "}
                No data available{" "}
              </TableCell>{" "}
            </TableRow>
          )}{" "}
        </TableBody>{" "}
      </Table>{" "}
      {/* Pagination */}{" "}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          {" "}
          <PaginationContent className="flex justify-end gap-2">
            {" "}
            <PaginationItem>
              {" "}
              <PaginationPrevious
                onClick={handlePrev}
                className="cursor-pointer"
              />{" "}
            </PaginationItem>{" "}
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                {" "}
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "cursor-pointer",
                    page === i + 1 ? "bg-gray-700 text-white" : "text-gray-400"
                  )}
                >
                  {" "}
                  {i + 1}{" "}
                </PaginationLink>{" "}
              </PaginationItem>
            ))}{" "}
            <PaginationItem>
              {" "}
              <PaginationNext
                onClick={handleNext}
                className="cursor-pointer"
              />{" "}
            </PaginationItem>{" "}
          </PaginationContent>{" "}
        </Pagination>
      )}{" "}
    </>
  );
}

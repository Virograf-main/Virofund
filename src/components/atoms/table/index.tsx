"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataPagination } from "../DataPagination";
import { Loader } from "@/components/atoms/loader";

export type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
  isLoading?: boolean;
  rowsPerPage?: number;
  onRowClick?: (row: T) => void;
};

export function DataTable<T>({
  columns,
  data,
  actions,
  isLoading,
  rowsPerPage = 5,
  onRowClick,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const colSpan = columns.length + (actions ? 1 : 0);
  const total = data.length;
  const paginatedData = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#F5F5F5] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#F5F5F5] border-none">
            <TableRow className="border-none">
              {columns.map((col, i) => (
                <TableHead className="border-none font-semibold" key={i}>
                  {col.header}
                </TableHead>
              ))}
              {actions && <TableHead />}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, i) => (
                <TableRow key={i} className="border-none">
                  {Array.from({ length: colSpan }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center">
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">—</span>
                    </div>
                    <p className="text-sm text-gray-400">No results found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <TableRow
                  key={rowIdx}
                  className={`border-none whitespace-nowrap ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, colIdx) => {
                    const value = row[col.accessor];
                    return (
                      <TableCell key={colIdx} className="max-w-[200px]">
                        <div className="truncate">
                          {col.render
                            ? col.render(value, row)
                            : (value as React.ReactNode)}
                        </div>
                      </TableCell>
                    );
                  })}
                  {actions && (
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()} // prevent row click firing when clicking action
                    >
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DataPagination
        page={page}
        total={total}
        pageSize={rowsPerPage}
        onPageChange={setPage}
      />
    </div>
  );
}

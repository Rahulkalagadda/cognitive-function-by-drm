"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState
} from "@tanstack/react-table";
import { Patient } from "@/types/patient.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import StatusBadge from "../shared/StatusBadge";
import Avatar from "../shared/Avatar";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface PatientTableProps {
  data: Patient[];
}

export default function PatientTable({ data }: PatientTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "name",
      header: "Patient",
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        const medicalId = row.original.medicalId;
        return (
          <div className="flex items-center gap-3">
            <Avatar name={name} className="h-9 w-9 shrink-0" />
            <div>
              <p className="text-xs font-extrabold text-on-surface leading-snug">{name}</p>
              <p className="text-[10px] text-on-surface-variant/80 font-medium">ID: {medicalId}</p>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: "age",
      header: "Age / Gender",
      cell: ({ row }) => {
        const age = row.getValue("age") as number;
        const gender = row.original.gender;
        return (
          <span className="text-xs text-on-surface-variant font-semibold">
            {age} yrs / {gender}
          </span>
        );
      }
    },
    {
      accessorKey: "phone",
      header: "Contact Details",
      cell: ({ row }) => {
        const phone = row.getValue("phone") as string;
        const email = row.original.email;
        return (
          <div>
            <p className="text-xs text-on-surface font-semibold">{phone}</p>
            <p className="text-[10px] text-on-surface-variant/80 font-medium">{email}</p>
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <StatusBadge status={status as any} />;
      }
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={`/patients/${patient.id}`}
              className="text-[10px] font-extrabold text-brand-primary border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
            >
              Open Files
            </Link>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="space-y-4">
      {/* Search Filter Header */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 border border-border-default rounded-2xl shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-on-surface-variant/60" />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search patients by name, email, ID..."
            className="w-full pl-10 pr-4 py-2 border border-border-default rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none text-xs bg-surface-page"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-border-default rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-surface-page border-b border-border-default">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  return (
                    <TableHead
                      key={header.id}
                      className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant py-3.5"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            isSortable ? "cursor-pointer select-none" : ""
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {isSortable && {
                            asc: <ChevronUp className="h-3.5 w-3.5" />,
                            desc: <ChevronDown className="h-3.5 w-3.5" />
                          }[header.column.getIsSorted() as string]}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="divide-y divide-border-default">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-surface-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-xs font-bold text-on-surface-variant/50">
                  No patient files matching search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-surface-page border-t border-border-default text-xs font-bold text-on-surface-variant">
          <div className="flex items-center gap-1">
            <span>Page</span>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </strong>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3.5 py-2 border border-border-default rounded-lg bg-white disabled:opacity-45 text-[11px] hover:bg-surface-muted transition-all cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3.5 py-2 border border-border-default rounded-lg bg-white disabled:opacity-45 text-[11px] hover:bg-surface-muted transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

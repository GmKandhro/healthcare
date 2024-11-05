"use client";

import {
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { decryptKey } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Column definition for the table
  data: TData[]; // Data for the table
}

export function DataTable<TData, TValue>({
  columns,
  data = [], // Default data to an empty array
}: DataTableProps<TData, TValue>) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Access the encrypted key from local storage
  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    if (accessKey !== process.env.NEXT_PUBLIC_ADMIN_PASSKEY!.toString()) {
      window.location.href = "/";
    }
  }, [encryptedKey]);

  // Initialize the table using react-table hook
  const table = useReactTable({
    data, // Table data
    columns, // Table columns
    getCoreRowModel: getCoreRowModel(), // Core row model for handling table rows
    getPaginationRowModel: getPaginationRowModel(), // Pagination handling
  });

  return (
    <div className="data-table  text-white p-4">
      <Table className="shad-table">
        {/* Table header section */}
        <TableHeader className="bg-gray-800 w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="shad-table-row-header">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        {/* Table body section */}
        <TableBody>
          {table?.getRowModel()?.rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <>
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="shad-table-row bg-gray-900 hover:bg-gray-700"
                  onClick={() =>
                    setExpandedRow(expandedRow === row.id ? null : row.id)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-white">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                  <TableCell>
                    <ChevronDownIcon className="w-6 h-6 text-white cursor-pointer" />
                  </TableCell>
                </TableRow>
                {expandedRow === row.id && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1}>
                      <div className="dropdown-details bg-gray-800 p-4 text-white rounded-lg">
                       
                        <p>
                          <strong>Name:</strong> {row.original.patient.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {row.original.patient.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> <p className="inline">+</p>{row.original.patient.phone}
                        </p>
                        <p>
                          <strong>pastMedicalHistory:</strong> {row.original.patient.pastMedicalHistory}
                        </p>
                        <p>
                          <strong>Birth Date:</strong>{" "}
                          {new Date(row.original.patient.birthDate).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Allergies:</strong> {row.original.patient.allergies}
                        </p>
                        <p>
                          <strong>Current Medication:</strong>{" "}
                          {row.original.patient.currentMedication}
                        </p>
                        <p>
                          <strong>Emergency Contact Name:</strong>{" "}
                          {row.original.patient.emergencyContactName}
                        </p>
                        <p>
                          <strong>Emergency Contact Number:</strong>{" "}
                          {row.original.patient.emergencyContactNumber}
                        </p>
                        <p>
                          <strong>Family Medical History:</strong>{" "}
                          {row.original.patient.familyMedicalHistory}
                        </p>
                        <p>
                          <strong>Gender:</strong> {row.original.patient.gender}
                        </p>
                        <p>
                          <strong>Occupation:</strong> {row.original.patient.occupation}
                        </p>
                        
                        <p>
                          <strong>Primary Physician:</strong>{" "}
                          {row.original.patient.primaryPhysician}
                        </p>
                        <p>
                          <strong>Address:</strong> {row.original.patient.address}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-white">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="table-actions mt-4 flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="bg-gray-700 text-white border-gray-500 hover:bg-gray-600"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="bg-gray-700 text-white border-gray-500 hover:bg-gray-600"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

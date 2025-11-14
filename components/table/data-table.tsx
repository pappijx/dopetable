"use client";
"use no memo";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export interface DataTableProps<TData> {
  // Data
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  error?: string | null;

  // Customization
  height?: string;
  getRowId?: (row: TData) => string;
}

export function DataTable<TData>({
  data,
  columns,
  isLoading = false,
  error = null,
  height = "600px",
  getRowId,
}: DataTableProps<TData>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
  });

  // Setup virtualizer
  const { rows } = table.getRowModel();
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 10,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center rounded-md border border-destructive bg-destructive/10 p-8">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div
          ref={parentRef}
          style={{ height }}
          className="overflow-auto relative"
          role="region"
          aria-label="Data table with virtualization"
        >
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {virtualRows.length > 0 ? (
                <>
                  {/* Spacer for virtualization */}
                  {virtualRows[0].start > 0 && (
                    <tr>
                      <td
                        style={{ height: `${virtualRows[0].start}px` }}
                        colSpan={columns.length}
                      />
                    </tr>
                  )}
                  {virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                      <TableRow
                        key={row.id}
                        data-index={virtualRow.index}
                        className="h-[50px]"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                  {/* Spacer for virtualization */}
                  {virtualRows.length > 0 &&
                    virtualRows[virtualRows.length - 1].end < totalSize && (
                      <tr>
                        <td
                          style={{
                            height: `${totalSize - virtualRows[virtualRows.length - 1].end}px`,
                          }}
                          colSpan={columns.length}
                        />
                      </tr>
                    )}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {virtualRows.length > 0 ? virtualRows[0].index + 1 : 0} to{" "}
          {virtualRows.length > 0
            ? Math.min(
                virtualRows[virtualRows.length - 1].index + 1,
                rows.length,
              )
            : 0}{" "}
          of {rows.length} rows
          {rows.length < data.length && (
            <span className="ml-1">(filtered from {data.length} total)</span>
          )}
        </div>
      </div>
    </div>
  );
}

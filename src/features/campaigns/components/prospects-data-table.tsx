'use client';

import { useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTableViewOptions } from '@/components/ui/table/data-table-view-options';
import { Users } from 'lucide-react';
import { TargetSegment } from '@/types/targeting';
import {
  createProspectsColumns,
  type Prospect
} from './prospects-table-columns';
import { flexRender } from '@tanstack/react-table';

interface ProspectsDataTableProps {
  prospects: Prospect[];
  targetSegments: TargetSegment[];
}

export function ProspectsDataTable({
  prospects,
  targetSegments
}: ProspectsDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleAccessEmail = (prospect: Prospect, e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement credit system and email reveal
    // TODO: Implement email access functionality
  };

  const columns = createProspectsColumns({
    targetSegments,
    onProspectClick: () => {}, // No action - profile viewing removed
    onAccessEmail: handleAccessEmail
  });

  const table = useReactTable({
    data: prospects,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    initialState: {
      pagination: {
        pageSize: 10
      },
      columnPinning: {
        left: ['name']
      },
      columnVisibility: {
        // Show all columns by default, let users toggle as needed
        name: true,
        title: true,
        company: true,
        industry: true,
        location: true,
        email: true,
        linkedin: true,
        filters: true
      }
    }
  });

  if (!prospects || prospects.length === 0) {
    return (
      <div className='rounded-lg border p-8 text-center'>
        <Users className='text-muted-foreground mx-auto mb-4 h-8 w-8' />
        <p className='text-muted-foreground'>No prospects found</p>
      </div>
    );
  }

  return (
    <div className='w-full space-y-6'>
      {/* Clean Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Prospects Found</h3>
          <p className='text-muted-foreground text-sm'>
            {table.getFilteredRowModel().rows.length} results
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Responsive Table View */}
      <div className='-mx-4 w-full sm:-mx-6 md:mx-0'>
        <div className='bg-background relative overflow-hidden rounded-lg border shadow-sm'>
          {/* Mobile scroll hint */}
          <div className='from-background via-background/80 pointer-events-none absolute top-1/2 right-0 z-10 h-full w-12 -translate-y-1/2 bg-gradient-to-l to-transparent md:hidden' />
          <div className='scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent -webkit-overflow-scrolling-touch overflow-x-auto overflow-y-visible px-4 sm:px-6 md:px-0'>
            <table className='w-full min-w-[800px]'>
              <thead className='bg-muted/50'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className='text-foreground h-12 px-3 text-left text-xs font-semibold sm:h-14 sm:px-6 sm:text-sm'
                        style={{
                          width: header.getSize(),
                          minWidth: header.column.columnDef.minSize
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`group border-border/50 hover:bg-muted/25 border-b transition-all duration-200 last:border-b-0 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'} `}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className='text-foreground px-3 py-3 text-xs sm:px-6 sm:py-4 sm:text-sm'
                          style={{
                            width: cell.column.getSize(),
                            minWidth: cell.column.columnDef.minSize
                          }}
                        >
                          <div className='flex items-center'>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={table.getAllColumns().length}
                      className='px-6 py-16 text-center'
                    >
                      <div className='flex flex-col items-center gap-2'>
                        <Users className='text-muted-foreground h-8 w-8' />
                        <p className='text-muted-foreground text-sm'>
                          No prospects found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile scroll indicator */}
      <div className='text-muted-foreground py-2 text-center text-xs md:hidden'>
        <span className='inline-flex items-center gap-1'>
          ← Swipe table to see more →
        </span>
      </div>

      {/* Enhanced Pagination */}
      <div className='border-border/50 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row'>
        <div className='text-muted-foreground flex items-center gap-4 text-sm'>
          <span>
            Showing{' '}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{' '}
            to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </span>
        </div>

        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2'>
            <label className='text-foreground text-sm font-medium'>
              Rows per page:
            </label>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className='border-input bg-background ring-offset-background focus:ring-ring h-9 w-16 rounded-md border px-2 text-sm focus:ring-2 focus:outline-none'
            >
              {[10, 20, 30, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className='h-9 w-9 p-0'
            >
              ⟨⟨
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className='h-9 px-3'
            >
              Previous
            </Button>

            <div className='mx-2 flex items-center gap-1'>
              <span className='text-sm font-medium'>
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className='h-9 px-3'
            >
              Next
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className='h-9 w-9 p-0'
            >
              ⟩⟩
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

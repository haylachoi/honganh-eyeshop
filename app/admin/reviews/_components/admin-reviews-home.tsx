"use client";

import { ReviewWithFullInfoType } from "@/features/reviews/review.type";
import React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionButton } from "./action-button";
import { PAGE_SIZE, SORTING_OPTIONS } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useFetchReviews } from "../_hooks/use-fetch-reviews";
import { ColumnHeaderButton } from "@/components/shared/table/column-header-button";
import { dateFormatter } from "@/lib/utils";

export const columns: ColumnDef<ReviewWithFullInfoType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="cursor-pointer"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="cursor-pointer"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.user.name,
    id: "user.name",
    header: () => {
      return (
        <ColumnHeaderButton onSort="user.name">
          Người dùng
          <ArrowUpDown />
        </ColumnHeaderButton>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.original.user.name}</div>
    ),
  },
  {
    accessorFn: (row) => row.product?.name,
    id: "product.name",
    header: () => {
      return (
        <ColumnHeaderButton onSort="product.name">
          Sản phẩm
          <ArrowUpDown />
        </ColumnHeaderButton>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.original.product?.name}</div>
    ),
  },
  {
    accessorKey: "rating",
    header: () => {
      return (
        <ColumnHeaderButton onSort="rating">
          Rating <ArrowUpDown />
        </ColumnHeaderButton>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("rating")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => {
      return (
        <ColumnHeaderButton onSort="createdAt">
          Ngày tạo <ArrowUpDown />
        </ColumnHeaderButton>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {dateFormatter.format(new Date(row.original.createdAt))}
      </div>
    ),
  },
  {
    accessorKey: "isDeleted",
    header: () => {
      return (
        <ColumnHeaderButton onSort="isDeleted">
          Đã ẩn <ArrowUpDown />
        </ColumnHeaderButton>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">
        {row.getValue("isDeleted") ? "Đã ẩn" : "Đang hiện"}
      </div>
    ),
  },
  {
    accessorKey: "comment",
    header: "Bình luận",
    cell: ({ row }) => <div className="">{row.getValue("comment")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionButton review={row.original} />,
  },
];

export const AdminReviewsHome = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const size = parseInt(
    searchParams.get("size") || PAGE_SIZE.REVIEWS.SM.toString(),
    10,
  );

  const sortBy = searchParams.get(SORTING_OPTIONS.SORT_BY) || "createdAt";
  const orderBy =
    searchParams.get(SORTING_OPTIONS.ORDER_BY) || SORTING_OPTIONS.DESC;
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data, isPending } = useFetchReviews({
    page,
    size,
    sortBy,
    orderBy,
  });

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const total = data?.total || 0;
  const totalPages = Math.ceil(total / size);
  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const table = useReactTable({
    data: data?.items || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* <Input */}
        {/*   placeholder="Lọc tên..." */}
        {/*   value={ */}
        {/*     (table.getColumn("product.name")?.getFilterValue() as string) ?? "" */}
        {/*   } */}
        {/*   onChange={(event) => */}
        {/*     table.getColumn("product.name")?.setFilterValue(event.target.value) */}
        {/*   } */}
        {/*   className="max-w-sm" */}
        {/* /> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {isPending ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1 || isPending}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages || isPending}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

"use client";

import React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderType } from "@/features/orders/order.types";
import { Input } from "@/components/ui/input";
import { currencyFormatter, dateFormatter } from "@/lib/utils";
import { ActionButton } from "./action-button";
import { TooltipWrapper } from "@/components/shared/tooltip";
import { ORDER_STATUS_DISPLAY_MAPS } from "@/features/orders/order.constants";
import { Checkbox } from "@/components/ui/checkbox";
import { HeaderButton } from "./header-action-button";
import { useRouter, useSearchParams } from "next/navigation";

export const columns: ColumnDef<OrderType>[] = [
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
    id: "orderId",
    accessorKey: "orderId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mã ĐH
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <TooltipWrapper render={row.original.orderId}>
        {/* to do: create copy order Id */}
        <div className="lowercase max-w-30 overflow-hidden whitespace-nowrap text-ellipsis">
          {row.original.orderId}
        </div>
      </TooltipWrapper>
    ),
  },
  {
    id: "customer.email",
    accessorKey: "customer.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <TooltipWrapper render={row.original.customer.email}>
        <div className="lowercase max-w-30 overflow-hidden whitespace-nowrap text-ellipsis">
          {row.original.customer.email}
        </div>
      </TooltipWrapper>
    ),
  },
  {
    id: "customer.name",
    accessorKey: "customer.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên khách hàng
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <TooltipWrapper render={row.original.customer.name}>
        <div className="lowercase max-w-30 overflow-hidden whitespace-nowrap text-ellipsis">
          {row.original.customer.name}
        </div>
      </TooltipWrapper>
    ),
  },
  {
    id: "discount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Giảm giá
          <ArrowUpDown />
        </Button>
      );
    },
    accessorKey: "discount",
    cell: ({ row }) => (
      <div className="">{currencyFormatter.format(row.original.discount)}</div>
    ),
  },
  {
    id: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Thành tiền
          <ArrowUpDown />
        </Button>
      );
    },
    accessorKey: "total",
    cell: ({ row }) => (
      <div className="">{currencyFormatter.format(row.original.total)}</div>
    ),
  },
  {
    id: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ngày tạo
          <ArrowUpDown />
        </Button>
      );
    },
    accessorKey: "createdAt",
    cell: ({ row }) => (
      <div className="">
        {dateFormatter.format(new Date(row.original.createdAt))}
      </div>
    ),
  },
  {
    id: "completedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Thời điểm
          <ArrowUpDown />
        </Button>
      );
    },
    accessorKey: "completedAt",
    cell: ({ row }) => (
      <div className="">
        {row.original.completedAt
          ? dateFormatter.format(new Date(row.original.completedAt))
          : ""}
      </div>
    ),
  },
  // {
  //   id: "paymentStatus",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Thanh toán
  //         <ArrowUpDown />
  //       </Button>
  //     );
  //   },
  //   accessorKey: "total",
  //   cell: ({ row }) => <div className="">{row.original.paymentStatus}</div>,
  // },
  {
    id: "orderStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TT Đơn hàng
          <ArrowUpDown />
        </Button>
      );
    },
    accessorKey: "total",
    cell: ({ row }) => {
      if (row.original.cancelReason) {
        return (
          <TooltipWrapper render={row.original.cancelReason}>
            <div>{ORDER_STATUS_DISPLAY_MAPS[row.original.orderStatus]}</div>
          </TooltipWrapper>
        );
      }
      return <div>{ORDER_STATUS_DISPLAY_MAPS[row.original.orderStatus]}</div>;
    },
  },
  {
    id: "actions",
    header: ({ table }) => <HeaderButton table={table} />,
    cell: ({ row }) => <ActionButton order={row.original} />,
  },
];

const OrdersView = ({ orders }: { orders: OrderType[] }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = parseInt(searchParams.get("page") ?? "1");
  const size = parseInt(searchParams.get("size") ?? "10");

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const table = useReactTable({
    data: orders,
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
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: size,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Lọc tên..."
          value={
            (table.getColumn("customer.name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("customer.name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
            {table.getRowModel().rows?.length ? (
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
                  No results.
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
            // onClick={() => table.previousPage()}
            onClick={() => goToPage(page - 1)}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            // onClick={() => table.nextPage()}
            onClick={() => goToPage(page + 1)}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrdersView;

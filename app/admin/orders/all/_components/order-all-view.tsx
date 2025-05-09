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
import { TooltipWrapper } from "@/components/shared/tooltip";
import { ORDER_STATUS_DISPLAY_MAPS } from "@/features/orders/order.constants";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ColumnHeaderButton } from "./column-header-button";
import { PAGE_SIZE, SORTING_OPTIONS } from "@/constants";
import { HeaderButton } from "./header-action-button";
import { ActionButton } from "./action-button";

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
    header: () => {
      return (
        <ColumnHeaderButton onSort="orderId">
          Mã ĐH
          <ArrowUpDown />
        </ColumnHeaderButton>
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
    header: () => {
      return (
        <ColumnHeaderButton onSort="customer.email">
          Email
          <ArrowUpDown />
        </ColumnHeaderButton>
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
    header: () => {
      return (
        <ColumnHeaderButton onSort="customer.name">
          Tên khách hàng
          <ArrowUpDown />
        </ColumnHeaderButton>
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
    header: () => {
      return (
        <ColumnHeaderButton onSort="discount">
          Giảm giá
          <ArrowUpDown />
        </ColumnHeaderButton>
      );
    },
    accessorKey: "discount",
    cell: ({ row }) => (
      <div className="">{currencyFormatter.format(row.original.discount)}</div>
    ),
  },
  {
    id: "total",
    header: () => {
      return (
        <ColumnHeaderButton onSort="total">
          Thành tiền
          <ArrowUpDown />
        </ColumnHeaderButton>
      );
    },
    accessorKey: "total",
    cell: ({ row }) => (
      <div className="">{currencyFormatter.format(row.original.total)}</div>
    ),
  },
  {
    id: "createdAt",
    header: () => {
      return (
        <ColumnHeaderButton onSort="createdAt">
          Ngày tạo
          <ArrowUpDown />
        </ColumnHeaderButton>
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
    header: () => {
      return (
        <ColumnHeaderButton onSort="completedAt">
          Thời điểm
          <ArrowUpDown />
        </ColumnHeaderButton>
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
  {
    id: "orderStatus",
    header: () => {
      return (
        <ColumnHeaderButton onSort="orderStatus">
          TT Đơn hàng
          <ArrowUpDown />
        </ColumnHeaderButton>
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

const size = PAGE_SIZE.ORDER.ALL.MD;

const OrdersAllView = () => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const sortBy = searchParams.get(SORTING_OPTIONS.SORT_BY) || "createdAt";
  const orderBy =
    searchParams.get(SORTING_OPTIONS.ORDER_BY) || SORTING_OPTIONS.DESC;

  const { data, isPending } = useQuery({
    queryKey: [
      "orders_all",
      {
        page,
        sortBy,
        orderBy,
      },
    ],
    queryFn: async () => {
      const res = await fetch(
        `/api/orders?page=${page}&${SORTING_OPTIONS.SORT_BY}=${sortBy}&${SORTING_OPTIONS.ORDER_BY}=${orderBy}`,
      );
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch orders");
      }
      return json.data as { total: number; items: OrderType[] };
    },
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();

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

export default OrdersAllView;

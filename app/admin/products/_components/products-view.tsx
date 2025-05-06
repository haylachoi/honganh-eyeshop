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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductType } from "../../../../features/products/product.types";
import { HeaderButton } from "./header-action-button";
import { ActionButton } from "./action-button";
import { TooltipWrapper } from "@/components/shared/tooltip";
import Link from "next/link";
import { currencyFormatter, getLink } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<ProductType>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tên
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <TooltipWrapper render={row.getValue("name")}>
        <Link
          href={getLink.product.home({
            categorySlug: row.original.category.slug,
            productSlug: row.original.slug,
          })}
          className="lowercase text-link max-w-60 truncate inline-block"
        >
          {row.getValue("name")}
        </Link>
      </TooltipWrapper>
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <TooltipWrapper render={row.getValue("slug")}>
        <div className="lowercase max-w-40 truncate inline-block">
          {row.getValue("slug")}
        </div>
      </TooltipWrapper>
    ),
  },
  {
    accessorKey: "category",
    header: "Loại",
    cell: ({ row }) => <div className="">{row.original.category.name}</div>,
  },
  {
    accessorKey: "brand",
    header: "Thương hiệu",
    cell: ({ row }) => <div className="">{row.getValue("brand")}</div>,
  },
  {
    accessorKey: "avgRating",
    header: "Đánh giá",
    cell: ({ row }) => (
      <div className="">{row.original.avgRating.toFixed(1)}</div>
    ),
  },
  // todo: format variants
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.original.variants;

      const visibleVariants = variants.slice(0, 2);
      const hiddenCount = variants.length - visibleVariants.length;

      const formatVariant = (variant: (typeof variants)[0]) => {
        const attrText = variant.attributes
          .map((attr) => `${attr.name}: ${attr.value}`)
          .join(" | ");
        return `${currencyFormatter.format(variant.originPrice)} → ${currencyFormatter.format(
          variant.price,
        )} (${attrText})`;
      };

      return (
        <TooltipWrapper
          render={
            <ul className="text-sm space-y-1 max-w-sm">
              {variants.map((variant, idx) => (
                <li key={idx} className="break-words leading-snug">
                  {formatVariant(variant)}
                </li>
              ))}
            </ul>
          }
        >
          <ul className="text-sm space-y-1 max-w-[250px] truncate">
            {visibleVariants.map((variant, idx) => (
              <li key={idx} className="truncate">
                {formatVariant(variant)}
              </li>
            ))}
            {hiddenCount > 0 && (
              <li className="text-xs text-muted-foreground italic">
                +{hiddenCount} biến thể khác
              </li>
            )}
          </ul>
        </TooltipWrapper>
      );
    },
  },

  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tags as { name: string }[];
      const previewTags = tags.slice(0, 3);

      return (
        <TooltipWrapper
          render={
            <ul>
              {tags.map((tag) => (
                <li key={tag.name}>{tag.name}</li>
              ))}
            </ul>
          }
        >
          <div className="flex flex-wrap gap-1 max-w-60 truncate">
            {previewTags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs truncate max-w-30"
              >
                {tag.name}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-sm">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        </TooltipWrapper>
      );
    },
  },
  {
    accessorKey: "isAvailable",
    header: "Trạng thái",
    cell: ({ row }) => (
      <div>{row.getValue("isAvailable") ? "Đang bán" : "Chưa bán"}</div>
    ),
  },
  {
    accessorKey: "isPublished",
    header: "Công khai",
    cell: ({ row }) => (
      <div>{row.getValue("isPublished") ? "Công khai" : "Ẩn"}</div>
    ),
  },
  {
    id: "actions",
    header: ({ table }) => <HeaderButton table={table} />,
    // enableHiding: false,
    cell: ({ row }) => <ActionButton product={row.original} />,
  },
];

const ProductsView = ({ products }: { products: ProductType[] }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: products,
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
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Lọc tên..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
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
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductsView;

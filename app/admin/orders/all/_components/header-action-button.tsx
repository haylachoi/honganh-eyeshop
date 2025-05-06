"use client";

import React from "react";

import { Table } from "@tanstack/react-table";

import { ThreeDotsMenuForHeader } from "@/components/shared/three-dots-menu/index";
import { TOAST_MESSAGES } from "@/constants";
import { OrderType } from "@/features/orders/order.types";
import {
  rejectOrderAction,
  completeOrder,
  confirmOrderAction,
} from "@/features/orders/order.actions";
import { ItemButton } from "./item-button";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const HeaderButton = ({ table }: { table: Table<OrderType> }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const orderBy = searchParams.get("orderBy") || "DESC";

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [
        "orders_all",
        {
          page,
          sortBy,
          orderBy,
        },
      ],
    });
  };

  const selectedOrders = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);
  const selectedIds = selectedOrders.map((order) => order.id);

  return (
    <ThreeDotsMenuForHeader
      canOpen={!selectedOrders.length}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <ItemButton
        id={selectedIds}
        label="Xác nhận"
        onClose={onClose}
        action={confirmOrderAction}
        onsuccess={onSuccess}
        successMessage={TOAST_MESSAGES.UPDATE.SUCCESS}
      />
      <ItemButton
        id={selectedIds}
        label="Hoàn tất"
        onClose={onClose}
        action={completeOrder}
        onsuccess={onSuccess}
        successMessage={TOAST_MESSAGES.UPDATE.SUCCESS}
      />
      <ItemButton
        id={selectedIds}
        label="Từ chối"
        onClose={onClose}
        action={rejectOrderAction}
        onsuccess={onSuccess}
        successMessage={TOAST_MESSAGES.UPDATE.SUCCESS}
        withReason
      />
    </ThreeDotsMenuForHeader>
  );
};

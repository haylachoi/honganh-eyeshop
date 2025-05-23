"use client";

import React from "react";

import { Table } from "@tanstack/react-table";

import { ThreeDotsMenuForHeader } from "@/components/shared/three-dots-menu/index";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { OrderType } from "@/features/orders/order.types";
import {
  rejectOrderAction,
  completeOrderAction,
  confirmOrderAction,
} from "@/features/orders/order.actions";
import { ItemButton } from "./item-button";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_CONFIG } from "@/cache/cache.constant";

export const HeaderButton = ({ table }: { table: Table<OrderType> }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: CACHE_CONFIG.ORDER.ALL.KEY_PARTS,
      exact: false,
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
        action={completeOrderAction}
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

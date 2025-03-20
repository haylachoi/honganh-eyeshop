import React from "react";

import { Table } from "@tanstack/react-table";

import { ThreeDotsMenuForHeader } from "@/components/shared/three-dots-menu/index";
import { ProductType } from "../../../../features/products/product.types";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import { deleteProductAction } from "../../../../features/products/product.actions";
import { onActionError } from "@/lib/actions/action.helper";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { useAction } from "next-safe-action/hooks";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";

export const HeaderButton = ({ table }: { table: Table<ProductType> }) => {
  const { execute, isPending } = useAction(deleteProductAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DELETE.SUCCESS);
    },
    onError: onActionError,
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  const { showDialog } = useGlobalAlertDialog();

  return (
    <ThreeDotsMenuForHeader canOpen={!selectedIds.length}>
      <ThreeDotsMenuButtonItem
        action={() => showDialog({ onConfirm: () => execute(selectedIds) })}
        isPending={isPending}
      >
        Xóa
      </ThreeDotsMenuButtonItem>
    </ThreeDotsMenuForHeader>
  );
};

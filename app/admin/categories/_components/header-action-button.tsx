import React from "react";

import { Table } from "@tanstack/react-table";

import { ThreeDotsMenuForHeader } from "@/components/shared/three-dots-menu/index";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import { onActionError } from "@/lib/actions/action.helper";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { useAction } from "next-safe-action/hooks";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { CategoryType } from "@/features/categories/category.types";
import { deleteCategoryAction } from "@/features/categories/category.actions";

export const HeaderButton = ({ table }: { table: Table<CategoryType> }) => {
  const { execute, isPending } = useAction(deleteCategoryAction, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.DELETE.SUCCESS);
    },
    onError: onActionError,
  });

  const { showDialog } = useGlobalAlertDialog();

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

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

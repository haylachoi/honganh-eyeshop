import React from "react";

import { Table } from "@tanstack/react-table";

import { ThreeDotsMenuForHeader } from "@/components/shared/three-dots-menu/index";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { onActionError } from "@/lib/actions/action.helper";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { useAction } from "next-safe-action/hooks";
import { BlogType } from "@/features/blogs/blog.types";
import { deleteBlogAction } from "@/features/blogs/blog.actions";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";

export const HeaderButton = ({ table }: { table: Table<BlogType> }) => {
  const { execute, isPending } = useAction(deleteBlogAction, {
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

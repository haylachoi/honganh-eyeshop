import React from "react";

import { Table } from "@tanstack/react-table";

import { ThreeDotsMenuForHeader } from "@/components/shared/three-dots-menu/index";
import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { onActionError } from "@/lib/actions/action.helper";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { useAction } from "next-safe-action/hooks";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { SafeAdminUserInfo } from "@/features/users/user.types";
import { lockUserAction } from "@/features/users/user.actions";

export const HeaderButton = ({
  table,
}: {
  table: Table<SafeAdminUserInfo>;
}) => {
  const { execute, isPending } = useAction(lockUserAction, {
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
        action={() =>
          showDialog({
            description:
              "Khoá tài khoản này? Tài khoản bị khóa sẽ không thể đăng nhập",
            onConfirm: () => execute({ ids: selectedIds }),
          })
        }
        isPending={isPending}
      >
        Khóa
      </ThreeDotsMenuButtonItem>
    </ThreeDotsMenuForHeader>
  );
};

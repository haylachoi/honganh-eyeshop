import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import { useAction } from "next-safe-action/hooks";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu/index";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { onActionError } from "@/lib/actions/action.helper";
import { SafeAdminUserInfo } from "@/features/users/user.types";
import {
  deleteUserAction,
  lockUserAction,
  unlockUserAction,
} from "@/features/users/user.actions";

export const ActionButton = ({ user }: { user: SafeAdminUserInfo }) => {
  return (
    <ThreeDotsMenu>
      {user.isLocked ? (
        <MenuButton
          label="Mở khóa"
          description="Mở khóa tài khoản này?"
          successMessage={TOAST_MESSAGES.USER.UNLOCK.SUCCESS}
          ids={[user.id]}
          action={unlockUserAction}
        />
      ) : (
        <MenuButton
          label="Khóa"
          description="Khóa tài khoản này?"
          successMessage={TOAST_MESSAGES.USER.LOCK.SUCCESS}
          ids={[user.id]}
          action={lockUserAction}
        />
      )}

      <MenuButton
        label="Xoá"
        description="Xoá tài khoản này?"
        successMessage={TOAST_MESSAGES.DELETE.SUCCESS}
        ids={[user.id]}
        action={deleteUserAction}
      />
    </ThreeDotsMenu>
  );
};

const MenuButton = ({
  action,
  successMessage,
  label,
  description,
  ids,
}: {
  label: string;
  description: string;
  successMessage: string;
  ids: string | string[];
  action: Parameters<typeof useAction>[0];
}) => {
  const { execute, isPending } = useAction(action, {
    onSuccess: () => {
      toast.success(successMessage);
    },
    onError: onActionError,
  });

  const { showDialog } = useGlobalAlertDialog();

  return (
    <ThreeDotsMenuButtonItem
      action={() =>
        showDialog({
          description,
          onConfirm: () =>
            execute({
              ids,
            }),
        })
      }
      isPending={isPending}
    >
      {label}
    </ThreeDotsMenuButtonItem>
  );
};

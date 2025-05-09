import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants/messages.constants";
import { useAction } from "next-safe-action/hooks";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu";
import { ThreeDotsMenuButtonItem } from "@/components/shared/three-dots-menu/three-dots-menu-button-item";
import { useGlobalAlertDialog } from "@/components/shared/alert-dialog-provider";
import { onActionError } from "@/lib/actions/action.helper";
import { SafeAdminUserInfo } from "@/features/users/user.types";
import {
  changeUserRoleAction,
  deleteUserAction,
  lockUserAction,
  unlockUserAction,
} from "@/features/users/user.actions";
import {
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_ROLES } from "@/features/authorization/authorization.constants";

export const ActionButton = ({ user }: { user: SafeAdminUserInfo }) => {
  const { showDialog } = useGlobalAlertDialog();

  const lock = useAction(lockUserAction, {
    onSuccess: () => toast.success(TOAST_MESSAGES.USER.LOCK.SUCCESS),
    onError: onActionError,
  });

  const unlock = useAction(unlockUserAction, {
    onSuccess: () => toast.success(TOAST_MESSAGES.USER.UNLOCK.SUCCESS),
    onError: onActionError,
  });

  const remove = useAction(deleteUserAction, {
    onSuccess: () => toast.success(TOAST_MESSAGES.DELETE.SUCCESS),
    onError: onActionError,
  });

  const role = useAction(changeUserRoleAction, {
    onSuccess: () => toast.success("Đã thay đổi role thành công"),
    onError: onActionError,
  });

  const handleConfirm = (description: string, execute: () => void) =>
    showDialog({ description, onConfirm: execute });

  return (
    <ThreeDotsMenu>
      {user.isLocked ? (
        <ThreeDotsMenuButtonItem
          action={() =>
            handleConfirm("Mở khóa tài khoản này?", () =>
              unlock.execute({ ids: [user.id] }),
            )
          }
          isPending={unlock.isPending}
        >
          Mở khóa
        </ThreeDotsMenuButtonItem>
      ) : (
        <ThreeDotsMenuButtonItem
          action={() =>
            handleConfirm("Khóa tài khoản này?", () =>
              lock.execute({ ids: [user.id] }),
            )
          }
          isPending={lock.isPending || user.role === "admin"}
        >
          Khóa
        </ThreeDotsMenuButtonItem>
      )}

      <ThreeDotsMenuButtonItem
        action={() =>
          handleConfirm("Xoá tài khoản này?", () =>
            remove.execute({ ids: [user.id] }),
          )
        }
        isPending={remove.isPending || user.role === "admin"}
      >
        Xoá
      </ThreeDotsMenuButtonItem>

      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Chọn role</DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup
              value={user.role}
              onValueChange={(value) => {
                if (role.isPending) return;
                role.execute({ id: user.id, role: value } as Parameters<
                  typeof role.execute
                >[0]);
              }}
            >
              {ADMIN_ROLES.map((r) => (
                <DropdownMenuRadioItem
                  key={r}
                  value={r}
                  disabled={
                    role.isPending ||
                    user.role === r ||
                    r === "admin" ||
                    user.role === "admin"
                  }
                >
                  {r}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </ThreeDotsMenu>
  );
};

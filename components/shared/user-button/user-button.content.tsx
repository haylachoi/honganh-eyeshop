"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_ENDPOINTS, ENDPOINTS } from "@/constants";
import { logoutAction } from "@/features/auth/auth.action";

import { SafeUserInfo } from "@/features/auth/auth.type";
import { canAccess } from "@/features/auth/auth.utils";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";

const UserButtonContent = ({ user }: { user: SafeUserInfo }) => {
  const { execute: logout } = useAction(logoutAction, {
    onSuccess: (result) => {
      if (result.data) {
        window.location.reload();
      }
    },
    onError: onActionError,
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer focus-visible:outline-none underline">
        {user.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {canAccess({
          role: user.role as "admin" | "user",
          resource: "admin",
        }) && (
          <>
            <DropdownMenuItem asChild>
              <Link href={ADMIN_ENDPOINTS.OVERVIEW}>Admin</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link href={ENDPOINTS.PROFILE}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={ENDPOINTS.ORDER}>Đơn hàng</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button className="size-full" onClick={() => logout()}>
            Đăng xuất
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButtonContent;

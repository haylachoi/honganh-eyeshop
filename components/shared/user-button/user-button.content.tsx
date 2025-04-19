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
import { usePathname } from "next/navigation";

const UserButtonContent = ({ user }: { user: SafeUserInfo }) => {
  const { execute: logout } = useAction(logoutAction, {
    onSuccess: (result) => {
      if (result.data) {
        window.location.reload();
      }
    },
    onError: onActionError,
  });
  const pathname = usePathname();
  const isAdminPage = pathname.includes(ADMIN_ENDPOINTS.HOME);
  const initials = getInitials(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer focus-visible:outline-none">
        <div className="flex items-center justify-center gap-2">
          <div className="size-6 rounded-full bg-background text-primary border border-foreground flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <span>{user.name}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {canAccess({
          role: user.role as "admin" | "user",
          resource: "admin",
        }) && (
          <>
            <DropdownMenuItem asChild className="cursor-pointer">
              {isAdminPage ? (
                <Link href={ENDPOINTS.HOME}>Trang chủ</Link>
              ) : (
                <Link href={ADMIN_ENDPOINTS.OVERVIEW}>Trang Admin</Link>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href={ENDPOINTS.PROFILE}>Profile</Link>
        </DropdownMenuItem>
        {!isAdminPage && (
          <DropdownMenuItem asChild>
            <Link href={ENDPOINTS.ORDER}>Đơn hàng</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className="cursor-pointer">
          <button className="size-full" onClick={() => logout()}>
            Đăng xuất
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButtonContent;

function getInitials(name: string) {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

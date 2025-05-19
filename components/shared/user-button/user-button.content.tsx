"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_ENDPOINTS, ENDPOINTS } from "@/constants/endpoints.constants";
import { logoutAction } from "@/features/auth/auth.action";

import { SafeUserInfoFromSession } from "@/features/users/user.types";
import { canAccess } from "@/features/auth/auth.utils";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const UserButtonContent = ({ user }: { user: SafeUserInfoFromSession }) => {
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
            {user.avatar ? (
              <Image src={user.avatar} alt="avatar" width={20} height={20} />
            ) : (
              initials
            )}
          </div>
          <span className="max-md:hidden truncate max-w-24">{user.name}</span>
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
          <Link href={ENDPOINTS.PROFILE.USER_INFO}>Profile</Link>
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

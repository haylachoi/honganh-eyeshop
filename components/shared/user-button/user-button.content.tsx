"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_ENDPOINTS, ENDPOINTS } from "@/constants";

import { SafeUserInfo } from "@/features/auth/auth.type";
import { canAccess } from "@/features/auth/auth.utils";
import Link from "next/link";

const UserButtonContent = ({ user }: { user: SafeUserInfo }) => {
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
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButtonContent;

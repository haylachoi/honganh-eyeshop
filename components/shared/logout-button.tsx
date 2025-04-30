"use client";

import { logoutAction } from "@/features/auth/auth.action";
import { onActionError } from "@/lib/actions/action.helper";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";

export const LogoutButton = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const { execute: logout, isPending } = useAction(logoutAction, {
    onSuccess: (result) => {
      if (result.data) {
        window.location.reload();
      }
    },
    onError: onActionError,
  });

  return (
    <button
      className={cn("cursor-pointer", className)}
      onClick={() => logout()}
      disabled={isPending}
    >
      {children ?? "Đăng xuất"}
    </button>
  );
};

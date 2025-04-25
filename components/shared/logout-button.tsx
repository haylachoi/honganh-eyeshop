"use client";

import { logoutAction } from "@/features/auth/auth.action";
import { onActionError } from "@/lib/actions/action.helper";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import AnimateLoadingIcon from "../custom-ui/animate-loading-icon";

export const LogoutButton = ({
  title,
  className,
}: {
  title?: string;
  className?: string;
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
      {title ?? "Đăng xuất"}
      {isPending && <AnimateLoadingIcon />}
    </button>
  );
};

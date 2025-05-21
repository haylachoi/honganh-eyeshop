"use client";

import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { BACKUUP_TYPE } from "@/features/backup/backup.constants";
import { cleanupInvalidCartItems } from "@/features/cart/cart.actions";
import { createFilterAction } from "@/features/filter/filter.actions";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import React from "react";

export const OthersContent = () => {
  const commonButtonClass =
    "px-4 py-2 border rounded-md cursor-pointer transition-colors duration-200 hover:bg-foreground hover:text-background border-foreground";

  const downloadButtons = [
    {
      label: "Download Backup Images",
      url: `/api/backup?file=${BACKUUP_TYPE.STATIC}`,
    },
    {
      label: "Download Backup Database",
      url: `/api/backup?file=${BACKUUP_TYPE.DB}`,
    },
    {
      label: "Download All Backup",
      url: `/api/backup?file=${BACKUUP_TYPE.FULL}`,
    },
  ];

  return (
    <div className="max-w-sm mx-auto mt-6 space-y-4">
      <h2 className="text-lg font-semibold">Khác</h2>

      <div className="flex flex-col gap-3">
        <CreateFilterButton className={commonButtonClass} />

        {downloadButtons.map((btn) => (
          <button
            key={btn.label}
            className={commonButtonClass}
            onClick={() => (window.location.href = btn.url)}
          >
            {btn.label}
          </button>
        ))}

        <CleanupInvalidCartItemsButton className={commonButtonClass} />
      </div>
    </div>
  );
};

const CleanupInvalidCartItemsButton = ({
  className,
}: {
  className: string;
}) => {
  const { execute, isPending } = useAction(cleanupInvalidCartItems, {
    onSuccess: () => {
      toast.success("Đã xóa các sản phẩm không hợp lệ trong giỏ hàng");
    },
    onError: onActionError,
  });

  return (
    <button
      className={`${className} flex items-center justify-center gap-2`}
      onClick={() => execute()}
      disabled={isPending}
    >
      {isPending && <AnimateLoadingIcon />}
      Cleanup Invalid Cart Items
    </button>
  );
};

const CreateFilterButton = ({ className }: { className: string }) => {
  const { execute, isPending } = useAction(createFilterAction, {
    onSuccess: (result) => {
      console.log(result);
      toast.success("Tạo bộ lọc thành công!");
    },
    onError: onActionError,
  });

  return (
    <button
      className={`${className} flex items-center justify-center gap-2`}
      onClick={() => execute()}
      disabled={isPending}
    >
      {isPending && <AnimateLoadingIcon />}
      Create Filter
    </button>
  );
};

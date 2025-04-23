"use client";

import AnimateLoadingIcon from "@/components/custom-ui/animate-loading-icon";
import { BACKUUP_TYPE } from "@/features/backup/backup.constants";
import { cleanupInvalidCartItems } from "@/features/cart/cart.actions";
import { createFilterAction } from "@/features/filter/filter.actions";
import {
  deleteFakeProducts,
  generateFakeProducts,
} from "@/features/products/product.actions";
import { onActionError } from "@/lib/actions/action.helper";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { toast } from "sonner";

export const OthersContent = () => {
  const { execute: executeCreateFilter } = useAction(createFilterAction, {
    onSuccess: (result) => {
      console.log(result);
    },
    onError: onActionError,
  });

  const { execute: executeGenerateFakeProducts } =
    useAction(generateFakeProducts);
  const { execute: executeDeleteFakeProducts } = useAction(deleteFakeProducts);

  return (
    <div>
      <button
        className="px-2 py-1 cursor-pointer border border-foreground"
        onClick={() => executeCreateFilter()}
      >
        Create Filter
      </button>
      <button
        className="px-2 py-1 cursor-pointer border border-foreground"
        onClick={() => executeGenerateFakeProducts()}
      >
        generate fake products
      </button>
      <button
        className="px-2 py-1 cursor-pointer border border-foreground"
        onClick={() => executeDeleteFakeProducts()}
      >
        delete fake products
      </button>

      <button
        onClick={() => {
          window.location.href = `/api/backup?file=${BACKUUP_TYPE.STATIC}`;
        }}
        className="px-2 py-1 cursor-pointer border border-foreground"
      >
        Download Backup images
      </button>
      <button
        onClick={() => {
          window.location.href = `/api/backup?file=${BACKUUP_TYPE.DB}`;
        }}
        className="px-2 py-1 cursor-pointer border border-foreground"
      >
        Download Backup database
      </button>
      <button
        onClick={() => {
          window.location.href = `/api/backup?file=${BACKUUP_TYPE.FULL}`;
        }}
        className="px-2 py-1 cursor-pointer border border-foreground"
      >
        Download all backup
      </button>
      <CleanupInvalidCartItemsButton />
    </div>
  );
};

export const CleanupInvalidCartItemsButton = () => {
  const { execute, isPending } = useAction(cleanupInvalidCartItems, {
    onSuccess: () => {
      toast.success("Đã xóa các sản phẩm không hợp lệ trong giỏ hàng");
    },
    onError: onActionError,
  });

  return (
    <button
      className="px-2 py-1 cursor-pointer border border-foreground"
      onClick={() => execute()}
      disabled={isPending}
    >
      {isPending && <AnimateLoadingIcon />}
      Cleanup Invalid Cart Items
    </button>
  );
};

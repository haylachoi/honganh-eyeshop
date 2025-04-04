import { toast } from "sonner";
import { TOAST_MESSAGES } from "@/constants";
import { useAction } from "next-safe-action/hooks";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu/index";
import { onActionError } from "@/lib/actions/action.helper";
import { setOrderCompletedAt } from "@/features/orders/order.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { OrderType } from "@/features/orders/order.types";

export const ActionButton = ({ order }: { order: OrderType }) => {
  const { execute, isPending } = useAction(setOrderCompletedAt, {
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.UPDATE.SUCCESS);
    },
    onError: onActionError,
  });

  const [paidAt, setPaidAt] = React.useState("");

  return (
    <ThreeDotsMenu>
      <div className="flex items-center justify-between">
        <Input
          type="date"
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
        />
        <Button
          onClick={() => {
            execute({ completedAt: new Date(paidAt), id: order.id });
          }}
          disabled={isPending}
        >
          Đơn hàng hoàn tất
        </Button>
      </div>
    </ThreeDotsMenu>
  );
};

import { TOAST_MESSAGES } from "@/constants";
import { ThreeDotsMenu } from "@/components/shared/three-dots-menu/index";
import {
  confirmOrderAction,
  rejectOrderAction,
  completeOrderAction,
} from "@/features/orders/order.actions";
import React from "react";
import { OrderType } from "@/features/orders/order.types";
import { ItemButton } from "./item-button";

const getDialogInfo = (
  order: OrderType,
  type: "completed" | "confirmed" | "rejected",
) => {
  const title = "Thông báo";

  const statusMap: Partial<Record<OrderType["orderStatus"], string>> = {
    completed: "Đơn hàng đã được hoàn tất. Bạn có muốn tiếp tục?",
    rejected: "Đơn hàng đã bị từ chối. Bạn có muốn tiếp tục?",
    confirmed: "Đơn hàng đã được xác nhận. Bạn có muốn tiếp tục?",
  };

  const relevantStatuses: Record<typeof type, OrderType["orderStatus"][]> = {
    completed: ["completed", "rejected"],
    rejected: ["confirmed", "completed"],
    confirmed: ["confirmed", "completed", "rejected"],
  };

  if (relevantStatuses[type].includes(order.orderStatus)) {
    const description = statusMap[order.orderStatus];
    if (description) {
      return { title, description };
    }
  }

  return undefined;
};

export const ActionButton = ({ order }: { order: OrderType }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  return (
    <ThreeDotsMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-col gap-4 p-2">
        <ItemButton
          id={order.id}
          label="Hoàn tất"
          action={completeOrderAction}
          successMessage={TOAST_MESSAGES.UPDATE.SUCCESS}
          onClose={onClose}
          defaultDate={order.completedAt}
          dialogInfo={getDialogInfo(order, "completed")}
        />
        <ItemButton
          id={order.id}
          label="Xác nhận"
          action={confirmOrderAction}
          successMessage={TOAST_MESSAGES.UPDATE.SUCCESS}
          onClose={onClose}
          dialogInfo={getDialogInfo(order, "confirmed")}
        />
        <ItemButton
          id={order.id}
          label="Từ chối"
          action={rejectOrderAction}
          successMessage={TOAST_MESSAGES.UPDATE.SUCCESS}
          onClose={onClose}
          dialogInfo={getDialogInfo(order, "rejected")}
          reason={order.cancelReason}
          withReason
        />
      </div>
    </ThreeDotsMenu>
  );
};

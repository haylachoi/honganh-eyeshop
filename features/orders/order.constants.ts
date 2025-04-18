import { OrderStatus, PaymentStatus } from "./order.types";

export const ORDER_STATUS = [
  "pending",
  "confirmed",
  "rejected",
  "completed",
  "canceled",
  "returned",
] as const;

type OrderStatusKey = Uppercase<OrderStatus>;

// Build mapped object với type-safe cực mạnh
export const ORDER_STATUS_MAPS: Record<OrderStatusKey, OrderStatus> =
  ORDER_STATUS.reduce(
    (acc, status) => {
      acc[status.toUpperCase() as OrderStatusKey] = status;
      return acc;
    },
    {} as Record<OrderStatusKey, OrderStatus>,
  );

export const ORDER_STATUS_DISPLAY_MAPS = {
  [ORDER_STATUS_MAPS.PENDING]: "Chờ xác nhận",
  [ORDER_STATUS_MAPS.CONFIRMED]: "Đã xác nhận",
  [ORDER_STATUS_MAPS.REJECTED]: "Đã từ chối",
  [ORDER_STATUS_MAPS.COMPLETED]: "Đã hoàn tất",
  [ORDER_STATUS_MAPS.CANCELED]: "Đã hủy",
  [ORDER_STATUS_MAPS.RETURNED]: "Đã trả lại",
};

export const PAYMENT_STATUS = ["pending", "paid", "failed", "refund"] as const;

type PaymentStatusKey = Uppercase<(typeof PAYMENT_STATUS)[number]>;

export const PAYMENT_STATUS_MAPS: Record<PaymentStatusKey, PaymentStatus> =
  PAYMENT_STATUS.reduce(
    (acc, status) => {
      acc[status.toUpperCase() as PaymentStatusKey] = status;
      return acc;
    },
    {} as Record<PaymentStatusKey, PaymentStatus>,
  );

export const PAYMENT_STATUS_DISPLAY_MAPS = {
  [PAYMENT_STATUS_MAPS.PENDING]: "Chờ thanh toán",
  [PAYMENT_STATUS_MAPS.PAID]: "Đã thanh toán",
  [PAYMENT_STATUS_MAPS.FAILED]: "Thanh toán thất bại",
  [PAYMENT_STATUS_MAPS.REFUND]: "Đã hoàn lại",
};

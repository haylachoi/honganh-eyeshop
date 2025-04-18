import { z } from "zod";
import {
  orderCouponSchema,
  orderDbInputSchema,
  orderInputSchema,
  orderTypeSchema,
} from "./order.validator";
import { ORDER_STATUS, PAYMENT_STATUS } from "./order.constants";

export type OrderInputType = z.infer<typeof orderInputSchema>;
export type OrderDbInputType = z.infer<typeof orderDbInputSchema>;

export type OrderCouponType = z.infer<typeof orderCouponSchema>;

export type OrderType = z.infer<typeof orderTypeSchema>;

export type OrderStatus = (typeof ORDER_STATUS)[number];
export type PaymentStatus = (typeof PAYMENT_STATUS)[number];

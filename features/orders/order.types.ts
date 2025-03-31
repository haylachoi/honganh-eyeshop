import { z } from "zod";
import {
  orderCouponSchema,
  orderDbInputSchema,
  orderInputSchema,
  orderTypeSchema,
} from "./order.validator";

export type OrderInputType = z.infer<typeof orderInputSchema>;
export type OrderDbInputType = z.infer<typeof orderDbInputSchema>;

export type OrderCouponType = z.infer<typeof orderCouponSchema>;

export type OrderType = z.infer<typeof orderTypeSchema>;

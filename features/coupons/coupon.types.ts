import { z } from "zod";
import {
  couponInputSchema,
  couponTypeSchema,
  couponUpdateSchema,
} from "./coupon.validator";

export type CouponInputType = z.infer<typeof couponInputSchema>;

export type CouponUpdateType = z.infer<typeof couponUpdateSchema>;

export type CouponType = z.infer<typeof couponTypeSchema>;

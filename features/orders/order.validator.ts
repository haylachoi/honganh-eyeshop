import { MoneySchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";
import { dbCouponInputSchema } from "../coupons/coupon.validator";
import {
  checkoutItemSchema,
  paymentMethodSchema,
} from "../checkouts/checkout.validator";

export const ORDER_STATUS = [
  "pending",
  "confirmed",
  "completed",
  "canceled",
  "returned",
] as const;

// general
export const orderIdSchema = z.string().uuid();
const moneySchema = MoneySchema;
const paymentStatusSchema = z.enum(["pending", "paid", "failed", "refund"]);
const trackingNumberSchema = z.string();
const orderStatusSchema = z.enum(ORDER_STATUS);
const cancelReasonSchema = z.string();

// base
const customerSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không đúng định dạng"),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
});

const shippingAddressSchema = z.object({
  address: z.string().min(1, "Địa chỉ không được để trống"),
  ward: z.string().min(1, "Phường/xã không được để trống"),
  district: z.string().min(1, "Quận/huyện không được để trống"),
  city: z.string().min(1, "Thành phố/tỉnh không được để trống"),
});

// input

export const orderCouponSchema = dbCouponInputSchema.pick({
  code: true,
  value: true,
  maxDiscount: true,
  discountType: true,
  expiryDate: true,
});

// main
const baseOrderSchema = z.object({
  customer: customerSchema,
  shippingAddress: shippingAddressSchema,
  items: z.array(checkoutItemSchema),
  paymentMethod: paymentMethodSchema,
});

export const orderInputSchema = baseOrderSchema.extend({
  couponCode: z.string().min(1, "Mã không được để trống").optional(),
});

export const orderDbInputSchema = baseOrderSchema.extend({
  orderId: orderIdSchema,
  userId: MongoIdSchema.optional(),
  coupon: orderCouponSchema.optional(),
  discount: moneySchema,
  subTotal: moneySchema,
  total: moneySchema,
  paymentStatus: paymentStatusSchema,
  shippingFee: moneySchema,
  trackingNumber: trackingNumberSchema.optional(),
  orderStatus: orderStatusSchema,
  cancelReason: cancelReasonSchema.optional(),
});

export const orderTypeSchema = orderDbInputSchema
  .extend({
    _id: MongoIdSchema,
    completedAt: z.date().optional(),
    createdAt: z.date(),
  })
  .transform(({ _id, userId, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    userId: userId?.toString(),
  }));

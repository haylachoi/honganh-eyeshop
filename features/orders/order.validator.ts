import { IdSchema, MoneySchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";
import { couponInputSchema } from "../coupons/coupon.validator";

// general
const moneySchema = MoneySchema;
const paymentMethodSchema = z.enum(["cod", "online"]);
const paymentStatusSchema = z.enum(["pending", "paid", "failed"]);
const trackingNumberSchema = z.string().optional();
const orderStatusSchema = z.enum([
  "pending", // Đơn hàng mới tạo, chờ xác nhận
  "confirmed", // Đã xác nhận
  "processing", // Đang xử lý (đóng gói, chuẩn bị giao)
  "shipped", // Đã gửi đi
  "delivered", // Đã giao thành công
  "canceled", // Đã hủy
  "returned", // Khách trả hàng
]);
const cancelReasonSchema = z.string().optional();

// base
const baseUserSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  email: z.string().email("Email không đúng định dạng"),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
});

const baseProductSchema = z.object({
  variant: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    }),
  ),
  price: z.number(),
  quantity: z.number(),
});

const baseShippingAddressSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  phone: z.string().min(1, "Số điện thoại không được để trống"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  city: z.string().min(1, "Thành phố không được để trống"),
});

const baseCouponCodeSchema = z
  .string()
  .min(1, "Mã không được để trống")
  .optional();

// input
const inputUserSchema = baseUserSchema.extend({
  id: IdSchema,
});

const inputProductSchema = baseProductSchema.extend({
  id: IdSchema,
});

// db
const dbUserSchema = baseUserSchema
  .extend({
    _id: MongoIdSchema,
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

const dbProductSchema = baseProductSchema
  .extend({
    _id: MongoIdSchema,
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

const dbCouponSchema = couponInputSchema
  .pick({ code: true, value: true })
  .extend({
    _id: MongoIdSchema,
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

// main
const baseOrderSchema = z.object({
  user: inputUserSchema,
  shippingAddress: baseShippingAddressSchema,
  products: z.array(inputProductSchema),
  paymentMethod: paymentMethodSchema,
});

export const orderInputSchema = baseOrderSchema.extend({
  couponCode: baseCouponCodeSchema,
});

export const orderTypeSchema = baseOrderSchema
  .extend({
    _id: MongoIdSchema,
    user: dbUserSchema,
    products: z.array(dbProductSchema),
    coupon: dbCouponSchema,
    discount: moneySchema,
    total: moneySchema,
    paymentMethod: paymentMethodSchema,
    paymentStatus: paymentStatusSchema,
    shippingFee: moneySchema,
    trackingNumber: trackingNumberSchema,
    orderStatus: orderStatusSchema,
    cancelReason: cancelReasonSchema,
  })
  .transform(({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }));

import { IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";

// base
const CodeSchema = z.string().min(1, "Mã không được để trống");
const ValueSchema = z.coerce.number().min(0, "Giảm giá không được để trống");
const DescriptionSchema = z.string().min(1, "Mô tả không được để trống");
const stringDateSchema = z.string();
const dateSchema = z.date();
const TypeSchema = z.enum(["fixed", "percent"]);
const MinOrderValueSchema = z.coerce
  .number()
  .min(1, "Giá trị tối thiểu không được để trống");
const MaxDiscountSchema = z.coerce
  .number()
  .min(0, "Giảm giá tối đa không được để trống");
const UsageLimitSchema = z.coerce
  .number()
  .min(1, "Số lượng sử dụng tối đa không được để trống");
const UsedCountSchema = z.coerce
  .number()
  .min(0, "Số lượng đã sử dụng không được để trống");

export const COUPON_STATUS = ["active", "inactive"] as const;
// export const COUPON_STATUS = ["active", "inactive", "expired"] as const;
const statusSchema = z.enum(COUPON_STATUS);

// main

export const baseCouponSchema = z.object({
  code: CodeSchema,
  value: ValueSchema,
  description: DescriptionSchema,
  discountType: TypeSchema,
  minOrderValue: MinOrderValueSchema,
  maxDiscount: MaxDiscountSchema,
  usageLimit: UsageLimitSchema,
  usedCount: UsedCountSchema,
  startDate: stringDateSchema,
  expiryDate: stringDateSchema,
  status: statusSchema,
});

export const couponInputWithoutTransform = baseCouponSchema.refine(
  (data) => new Date(data.expiryDate) > new Date(data.startDate),
  {
    message: "Ngày hết hạn phải lớn hơn ngày bắt đầu",
    path: ["expiryDate"],
  },
);

export const couponInputSchema = couponInputWithoutTransform.transform(
  ({ startDate, expiryDate, ...rest }) => {
    return {
      ...rest,
      startDate: new Date(startDate),
      expiryDate: new Date(expiryDate),
    };
  },
);

export const dbCouponInputSchema = baseCouponSchema.extend({
  startDate: dateSchema,
  expiryDate: dateSchema,
});

export const couponUpdateSchemaWithoutTransform = baseCouponSchema
  .extend({
    id: IdSchema,
  })
  .refine((data) => new Date(data.expiryDate) > new Date(data.startDate), {
    message: "Ngày hết hạn phải lớn hơn ngày bắt đầu",
    path: ["expiryDate"],
  });

export const couponUpdateSchema = couponUpdateSchemaWithoutTransform.transform(
  ({ startDate, expiryDate, ...rest }) => {
    return {
      ...rest,
      startDate: new Date(startDate),
      expiryDate: new Date(expiryDate),
    };
  },
);

export const couponTypeWithoutTransformSchema = baseCouponSchema.extend({
  _id: MongoIdSchema,
  startDate: dateSchema,
  expiryDate: dateSchema,
});

export const couponTypeSchema = couponTypeWithoutTransformSchema.transform(
  ({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }),
);

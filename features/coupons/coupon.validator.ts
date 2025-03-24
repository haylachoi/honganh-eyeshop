import { IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";

// base
const baseCodeSchema = z.string().min(1, "Mã không được để trống");
const baseValueSchema = z.number().min(0, "Giảm giá không được để trống");
const baseDescriptionSchema = z.string().min(1, "Mô tả không được để trống");
const baseDateSchema = z.date().min(new Date(), "Hết hạn");
const baseTypeSchema = z.enum(["fixed", "percent"]);
const baseMinOrderValueSchema = z
  .number()
  .min(1, "Giá trị tối thiểu không được để trống");
const baseMaxDiscountSchema = z
  .number()
  .min(1, "Giảm giá tối đa không được để trống");
const baseUsageLimitSchema = z
  .number()
  .min(1, "Số lượng sử dụng tối đa không được để trống");
const baseUsedCountSchema = z
  .number()
  .min(0, "Số lượng đã sử dụng không được để trống");

const statusSchema = z.enum(["active", "inactive", "expired"]);

export const couponInputSchema = z.object({
  code: baseCodeSchema,
  value: baseValueSchema,
  description: baseDescriptionSchema,
  type: baseTypeSchema,
  minOrderValue: baseMinOrderValueSchema,
  maxDiscount: baseMaxDiscountSchema,
  usageLimit: baseUsageLimitSchema,
  usedCount: baseUsedCountSchema,
  startDate: baseDateSchema,
  expiryDate: baseDateSchema,
  status: statusSchema,
});

export const couponUpdateSchema = couponInputSchema.extend({
  id: IdSchema,
});

export const couponTypeWithoutTransformSchema = couponInputSchema.extend({
  _id: MongoIdSchema,
});

export const couponTypeSchema = couponTypeWithoutTransformSchema.transform(
  ({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }),
);

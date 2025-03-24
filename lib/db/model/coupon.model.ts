import { couponTypeSchema } from "@/features/coupons/coupon.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof couponTypeSchema>;

export interface CouponModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<CouponModel>(
  {
    code: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    maxDiscount: {
      type: Number,
      default: 10_000_000,
    },
    usageLimit: {
      type: Number,
      required: true,
    },
    usedCount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

couponSchema.index({ code: 1 }, { unique: true });

const Coupon =
  (models.Coupon as Model<CouponModel>) ||
  model<CouponModel>("Coupon", couponSchema);

export default Coupon;

import { PAYMENT_METHOD_LIST } from "@/features/checkouts/checkout.constants";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
} from "@/features/orders/order.constants";
import { orderTypeSchema } from "@/features/orders/order.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof orderTypeSchema>;

export interface OrderModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderModel>(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      address: { type: String },
      ward: { type: String },
      district: { type: String },
      city: { type: String },
    },
    items: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          variantId: {
            type: String,
            required: true,
          },
          productName: {
            type: String,
            required: true,
          },
          productUrl: {
            type: String,
            required: true,
          },
          attributes: [
            {
              _id: false,
              name: {
                type: String,
                required: true,
              },
              value: {
                type: String,
                required: true,
              },
            },
          ],
          price: {
            type: Number,
            required: true,
          },
          imageUrl: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    coupon: {
      type: {
        code: { type: String, required: true },
        value: { type: Number, required: true },
        maxDiscount: { type: Number, required: true },
        expiryDate: { type: Date, required: true },
        discountType: {
          type: String,
          enum: ["fixed", "percent"],
          required: true,
        },
      },
      required: false,
    },
    discount: {
      type: Number,
      default: 0,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: PAYMENT_METHOD_LIST,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: PAYMENT_STATUS,
    },
    completedAt: {
      type: Date,
      required: false,
      validate: {
        validator: function (value) {
          return value.toDateString() >= this.createdAt.toDateString();
        },
        message: "paymentDate phải lớn hơn createdAt!",
      },
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    trackingNumber: {
      type: String,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ORDER_STATUS,
    },
    cancelReason: {
      type: String,
    },
  },
  { timestamps: true },
);

orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ userId: 1, "items.productId": 1, completedAt: 1 });

const Order =
  (models.Order as Model<OrderModel>) ||
  model<OrderModel>("Order", orderSchema);

export default Order;

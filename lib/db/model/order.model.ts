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
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    products: [
      {
        _id: false,
        variant: [
          {
            name: { type: String, required: true },
            value: { type: String, required: true },
          },
        ],
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    coupon: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
        required: true,
      },
      code: { type: String, required: true },
      value: { type: Number, required: true },
    },
    discount: {
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
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    trackingNumber: {
      type: String,
      default: null,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    cancelReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const Order =
  (models.Order as Model<OrderModel>) ||
  model<OrderModel>("Order", orderSchema);

export default Order;

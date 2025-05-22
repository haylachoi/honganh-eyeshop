import { PAYMENT_METHOD_LIST } from "@/features/checkouts/checkout.constants";
import { checkoutTypeSchema } from "@/features/checkouts/checkout.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof checkoutTypeSchema>;

interface CheckoutModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const checkoutSchema = new Schema<CheckoutModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customer: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    shippingAddress: {
      address: { type: String },
      ward: { type: String },
      district: { type: String },
      city: { type: String },
    },
    // todo: use enum
    paymentMethod: {
      type: String,
      required: true,
      enum: PAYMENT_METHOD_LIST,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
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
    isOrderd: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: String,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 giờ từ lúc tạo
    },
  },
  {
    timestamps: true,
  },
);

checkoutSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 10 });

const Checkout =
  (models.Checkout as Model<CheckoutModel>) ||
  model<CheckoutModel>("Checkout", checkoutSchema);

export default Checkout;

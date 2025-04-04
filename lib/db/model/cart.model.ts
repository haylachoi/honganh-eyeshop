import { cartTypeSchema } from "@/features/cart/cart.validator";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof cartTypeSchema>;

interface CartModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<CartModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

cartSchema.index(
  { userId: 1, "items.productId": 1, "items.variantId": 1 },
  { unique: true },
);

const Cart =
  (models.Cart as Model<CartModel>) || model<CartModel>("Cart", cartSchema);

export default Cart;

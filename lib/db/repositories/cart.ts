import { CartInputType } from "@/features/cart/cart.types";
import Cart from "../model/cart.model";
import {
  cartItemTypeSchema,
  cartTypeSchema,
} from "@/features/cart/cart.validator";
import { AppError } from "@/types";
import { ERROR_MESSAGES } from "@/constants";
import { connectToDatabase } from "..";

const getCartByUserId = async (userId: string) => {
  await connectToDatabase();
  const result = await Cart.findOne({ userId }).lean();
  if (!result) return;
  const cart = cartTypeSchema.parse(result);
  return cart;
};

const getCartItem = async (input: {
  userId: string;
  productId: string;
  variantId: string;
}) => {
  await connectToDatabase();
  const result = await Cart.findOne(
    {
      userId: input.userId,
      "items.productId": input.productId,
      "items.variantId": input.variantId,
    },
    {
      "items.$": 1,
    },
  ).lean();

  if (!result) {
    return;
  }

  return cartItemTypeSchema.parse(result.items[0]);
};

const addNewItemToCart = async ({ userId, item }: CartInputType) => {
  await connectToDatabase();
  const updatedCart = await Cart.findOneAndUpdate(
    { userId },
    { $push: { items: item } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  if (!updatedCart) {
    throw new AppError({
      message: ERROR_MESSAGES.NOT_FOUND.USER.SINGLE,
    });
  }

  return cartTypeSchema.parse(updatedCart);
};

const updateItemQuantity = async ({ userId, item }: CartInputType) => {
  await connectToDatabase();
  const result = await Cart.findOneAndUpdate(
    {
      userId,
      "items.productId": item.productId,
      "items.variantId": item.variantId,
    },
    { $inc: { "items.$.quantity": item.quantity } }, // Tăng số lượng
    { new: true },
  );

  // return cartTypeSchema.parse(result);
};

const addItemToCart = async ({ userId, item }: CartInputType) => {
  // let updatedCart = await updateItemQuantity({ userId, item });
  //
  // if (!updatedCart) {
  //   updatedCart = await addNewItemToCart({ userId, item });
  // }
  //
  // if (!updatedCart) {
  //   throw new AppError({
  //     message: ERROR_MESSAGES.NOT_FOUND.USER.SINGLE,
  //   });
  // }
  updateItemQuantity({ userId, item });
  // return cartTypeSchema.parse(updatedCart);
};

export const cartRepository = {
  getCartByUserId,
  getCartItem,
  addItemToCart,
  updateItemQuantity,
};

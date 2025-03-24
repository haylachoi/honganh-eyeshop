"use server";

import { customerActionClient } from "@/lib/actions";
import { cartItemInputSchema } from "./cart.validator";
import { cartRepository } from "@/lib/db/repositories/cart";
import productRepository from "@/lib/db/repositories/products";
import { AppError } from "@/types";
import { ERROR_MESSAGES } from "@/constants";

export const addItemToCart = customerActionClient
  .metadata({
    actionName: "addItemToCart",
  })
  .schema(cartItemInputSchema)
  .action(async ({ parsedInput, ctx }) => {
    const countInStock = await productRepository.getCountInStockOfVariant({
      productId: parsedInput.productId,
      variantId: parsedInput.variantId,
    });
    if (!countInStock) {
      throw new AppError({
        message: ERROR_MESSAGES.NOT_FOUND.PRODUCT.SINGLE,
      });
    }
    const existingCartItem = await cartRepository.getCartItem({
      userId: ctx.userId,
      productId: parsedInput.productId,
      variantId: parsedInput.variantId,
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + parsedInput.quantity;
      if (newQuantity > countInStock) {
        throw new AppError({
          message: ERROR_MESSAGES.NOT_FOUND.PRODUCT.NOT_ENOUGH_STOCK,
        });
      }
      await cartRepository.updateItemQuantity({
        userId: ctx.userId,
        item: {
          productId: parsedInput.productId,
          variantId: parsedInput.variantId,
          quantity: parsedInput.quantity,
        },
      });
    } else {
      await cartRepository.addItemToCart({
        userId: ctx.userId,
        item: parsedInput,
      });
    }
  });

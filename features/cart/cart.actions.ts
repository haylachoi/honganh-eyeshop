"use server";

import { customerActionClient } from "@/lib/actions";
import { cartItemInputSchema } from "./cart.validator";
import { cartRepository } from "@/lib/db/repositories/cart";
import productRepository from "@/lib/db/repositories/products";
import { CACHE, ERROR_MESSAGES } from "@/constants";
import { revalidateTag } from "next/cache";
import { NotFoundError, ValidationError } from "@/lib/error";
import { z } from "zod";
import { IdSchema } from "@/lib/validator";

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
    if (countInStock === undefined || countInStock === null) {
      throw new NotFoundError({
        resource: "product",
        message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
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
        throw new ValidationError({
          resource: "product",
          message: ERROR_MESSAGES.PRODUCT.NOT_ENOUGH_STOCK,
        });
      }
      const result = await cartRepository.updateItemQuantity({
        userId: ctx.userId,
        item: {
          productId: parsedInput.productId,
          variantId: parsedInput.variantId,
          quantity: parsedInput.quantity,
        },
        mode: "increase",
      });
      revalidateTag(CACHE.CART.USER.TAGS);
      return result;
    }

    const result = await cartRepository.addItemToCart({
      userId: ctx.userId,
      item: parsedInput,
    });

    revalidateTag(CACHE.CART.USER.TAGS);
    return result;
  });

export const updateItemQuantity = customerActionClient
  .metadata({
    actionName: "updateItemQuantity",
  })
  .schema(
    z.object({
      productId: IdSchema,
      variantId: z.string().uuid(),
      quantity: z.number().min(1),
      mode: z.enum(["increase", "replace"]),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const countInStock = await productRepository.getCountInStockOfVariant({
      productId: parsedInput.productId,
      variantId: parsedInput.variantId,
    });
    if (countInStock === undefined || countInStock === null) {
      throw new NotFoundError({
        resource: "product",
        message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
      });
    }
    const existingCartItem = await cartRepository.getCartItem({
      userId: ctx.userId,
      productId: parsedInput.productId,
      variantId: parsedInput.variantId,
    });
    if (!existingCartItem) {
      throw new NotFoundError({
        resource: "product",
        message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
      });
    }

    const newQuantity = existingCartItem.quantity + parsedInput.quantity;
    if (newQuantity > countInStock) {
      throw new ValidationError({
        resource: "product",
        message: ERROR_MESSAGES.PRODUCT.NOT_ENOUGH_STOCK,
      });
    }
    const result = await cartRepository.updateItemQuantity({
      userId: ctx.userId,
      item: {
        productId: parsedInput.productId,
        variantId: parsedInput.variantId,
        quantity: parsedInput.quantity,
      },
      mode: parsedInput.mode,
    });
    revalidateTag(CACHE.CART.USER.TAGS);
    return result;
  });

export const removeItemFromCart = customerActionClient
  .metadata({
    actionName: "removeItemFromCart",
  })
  .schema(
    z.object({
      productId: IdSchema,
      variantId: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    await cartRepository.removeCartItem({
      ...parsedInput,
      userId: ctx.userId,
    });

    revalidateTag(CACHE.CART.USER.TAGS);
  });

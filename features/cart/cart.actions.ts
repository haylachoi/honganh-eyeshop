"use server";

import { authCustomerActionClient, getAuthActionClient } from "@/lib/actions";
import { cartItemInputSchema } from "./cart.validator";
import { cartRepository } from "@/lib/db/repositories/cart";
import productRepository from "@/lib/db/repositories/products";
import { ERROR_MESSAGES } from "@/constants";
import { revalidateTag } from "next/cache";
import { NotFoundError, ValidationError } from "@/lib/error";
import { z } from "zod";
import { IdSchema } from "@/lib/validator";
import { UPDATE_CART_ITEM_MODES } from "./cart.constant";
import { CACHE_CONFIG } from "@/cache/cache.constant";

const cartCacheTag = CACHE_CONFIG.CART.USER.TAGS[0];

export const addItemToCart = authCustomerActionClient
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
        mode: "modify",
      });
      revalidateTag(cartCacheTag);
      return result;
    }

    const result = await cartRepository.addItemToCart({
      userId: ctx.userId,
      item: parsedInput,
    });

    revalidateTag(cartCacheTag);
    return result;
  });

export const updateItemQuantity = authCustomerActionClient
  .metadata({
    actionName: "updateItemQuantity",
  })
  .schema(
    z.object({
      productId: IdSchema,
      variantId: z.string().uuid(),
      quantity: z.number().min(1),
      mode: z.enum(UPDATE_CART_ITEM_MODES),
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

    const newQuantity =
      parsedInput.mode === "replace"
        ? parsedInput.quantity
        : existingCartItem.quantity + parsedInput.quantity;

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
        quantity: newQuantity,
      },
      mode: parsedInput.mode,
    });

    revalidateTag(cartCacheTag);
    return result;
  });

export const removeItemFromCart = authCustomerActionClient
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

    revalidateTag(cartCacheTag);
  });

export const cleanupInvalidCartItems = getAuthActionClient({
  resource: "cart",
  action: "delete",
  scope: "all",
})
  .metadata({
    actionName: "cleanupInvalidCartItems",
  })
  .action(async () => {
    await cartRepository.cleanupInvalidCartItems();
    revalidateTag(cartCacheTag);
  });

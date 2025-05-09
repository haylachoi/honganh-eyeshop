import next_cache from "@/cache";
import { ERROR_MESSAGES } from "@/constants/messages.constants";
import { cartRepository } from "@/lib/db/repositories/cart";
import { NotFoundError } from "@/lib/error";
import { authCustomerQueryClient, safeQuery } from "@/lib/query";
import { z } from "zod";

export const getCartByUserId = authCustomerQueryClient.query(
  async ({ ctx }) => {
    const result = await next_cache.cart.getByUserId(ctx.userId);

    if (!result) {
      throw new NotFoundError({
        resource: "user",
        message: ERROR_MESSAGES.USER.NOT_FOUND,
      });
    }

    return result;
  },
);

export const getCartWithProductDetailBySession = authCustomerQueryClient.query(
  async ({ ctx }) => {
    const result = await cartRepository.getCartWithProductDetails({
      userId: ctx.userId,
    });

    return result;
  },
);

export const getCartItemByIdAndVariantId = safeQuery
  .schema(
    z.array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number(),
      }),
    ),
  )
  .query(async ({ parsedInput }) => {
    const products =
      await cartRepository.getCartItemByProductIdAndVariantId(parsedInput);
    return products;
  });

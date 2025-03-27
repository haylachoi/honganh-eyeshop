import { ERROR_MESSAGES } from "@/constants";
import { cartRepository } from "@/lib/db/repositories/cart";
import { NotFoundError } from "@/lib/error";
import { customerQueryClient } from "@/lib/query";

export const getCartByUserId = customerQueryClient.query(async ({ ctx }) => {
  const result = await cartRepository.getCartByUserId(ctx.userId);

  if (!result) {
    throw new NotFoundError({
      resource: "user",
      message: ERROR_MESSAGES.USER.NOT_FOUND,
    });
  }

  return result;
});

export const getCartWithProductDetailBySession = customerQueryClient.query(
  async ({ ctx }) => {
    const result = await cartRepository.getCartWithProductDetails({
      userId: ctx.userId,
    });

    return result;
  },
);

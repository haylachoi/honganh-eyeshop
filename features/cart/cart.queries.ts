import { ERROR_MESSAGES } from "@/constants";
import { cartRepository } from "@/lib/db/repositories/cart";
import { customerQueryClient } from "@/lib/query";
import { AppError } from "@/types";

export const getCartByUserId = customerQueryClient.query(async ({ ctx }) => {
  const result = await cartRepository.getCartByUserId(ctx.userId);
  if (!result)
    throw new AppError({ message: ERROR_MESSAGES.NOT_FOUND.ID.SINGLE });
  return result;
});

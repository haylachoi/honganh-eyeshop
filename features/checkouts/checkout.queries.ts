import { ERROR_MESSAGES } from "@/constants";
import checkoutsRepository from "@/lib/db/repositories/checkouts";
import { AuthenticationError, NotFoundError } from "@/lib/error";
import { customerQueryClient } from "@/lib/query";
import { IdSchema } from "@/lib/validator";

export const getCheckoutById = customerQueryClient
  .schema(IdSchema)
  .query(async ({ parsedInput, ctx }) => {
    const result = await checkoutsRepository.getCheckoutById(parsedInput);
    if (!result) {
      throw new NotFoundError({
        resource: "checkout",
        message: ERROR_MESSAGES.CHECKOUT.NOT_FOUND,
      });
    }
    if (result.userId !== ctx.userId) {
      throw new AuthenticationError({
        resource: "checkout",
      });
    }
    return result;
  });

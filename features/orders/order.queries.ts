import ordersRepository from "@/lib/db/repositories/orders";
import { customerQueryClient, safeQuery } from "@/lib/query";
import { orderIdSchema } from "./order.validator";
import { AuthenticationError, NotFoundError } from "@/lib/error";
import { ERROR_MESSAGES } from "@/constants";

export const getAllOrders = safeQuery.query(async () => {
  return await ordersRepository.getAllOrders();
});

export const getOrderByUserID = customerQueryClient.query(async ({ ctx }) => {
  if (!ctx.userId) {
    throw new AuthenticationError({
      resource: "order",
      message: ERROR_MESSAGES.AUTH.UNAUTHENTICATED,
    });
  }
  const order = await ordersRepository.getOrdersByUserId(ctx.userId);

  if (!order) {
    throw new NotFoundError({
      resource: "order",
      message: ERROR_MESSAGES.ORDER.NOT_FOUND,
    });
  }
  return order;
});

export const getOrderByOrderId = customerQueryClient
  .schema(orderIdSchema)
  .query(async ({ parsedInput }) => {
    const order = await ordersRepository.getOrderByOrderId(parsedInput);

    if (!order) {
      throw new NotFoundError({
        resource: "order",
        message: ERROR_MESSAGES.ORDER.NOT_FOUND,
      });
    }
  });

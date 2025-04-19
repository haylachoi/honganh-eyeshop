import ordersRepository from "@/lib/db/repositories/orders";
import {
  authCustomerQueryClient,
  customerQueryClient,
  getAuthQueryClient,
} from "@/lib/query";
import { orderIdSchema } from "./order.validator";
import { NotFoundError } from "@/lib/error";
import { ERROR_MESSAGES } from "@/constants";
import next_cache from "@/cache";

const resource = "order";

// todo : not cache all order
export const getAllOrders = getAuthQueryClient({
  resource,
}).query(async () => {
  return await next_cache.orders.all();
});

export const getOrderByUserID = authCustomerQueryClient.query(
  async ({ ctx }) => {
    const order = await ordersRepository.getOrdersByUserId(ctx.userId);

    if (!order) {
      throw new NotFoundError({
        resource,
        message: ERROR_MESSAGES.ORDER.NOT_FOUND,
      });
    }
    return order;
  },
);

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

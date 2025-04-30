import ordersRepository from "@/lib/db/repositories/orders";
import {
  authCustomerQueryClient,
  customerQueryClient,
  getAuthQueryClient,
} from "@/lib/query";
import { orderIdSchema } from "./order.validator";
import { NotFoundError } from "@/lib/error";
import { ERROR_MESSAGES, PAGE_SIZE } from "@/constants";
import next_cache from "@/cache";
import { z } from "zod";

const resource = "order";

// todo : not cache all order
// todo: sort by desc
export const getAllOrders = getAuthQueryClient({
  resource,
}).query(async () => {
  return await next_cache.orders.all();
});

export const getOrderByUserId = authCustomerQueryClient
  .schema(
    z.object({
      page: z.number().optional().default(0),
      size: z.number().optional().default(PAGE_SIZE.ORDER.HISTORY.SM),
    }),
  )
  .query(async ({ ctx, parsedInput }) => {
    const order = await ordersRepository.getOrdersByUserId({
      userId: ctx.userId,
      offset: parsedInput.page * parsedInput.size,
      limit: parsedInput.size,
    });

    if (!order) {
      throw new NotFoundError({
        resource,
        message: ERROR_MESSAGES.ORDER.NOT_FOUND,
      });
    }
    return order;
  });

export const countOrdersByUserId = authCustomerQueryClient.query(
  async ({ ctx }) => {
    const count = await next_cache.orders.history.countByUserId({
      userId: ctx.userId,
    });
    return count;
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

    return order;
  });

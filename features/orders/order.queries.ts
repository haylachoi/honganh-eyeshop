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

export const getAllOrders = getAuthQueryClient({
  resource,
})
  .schema(
    z.object({
      page: z.number().optional().default(1),
      size: z.number().optional().default(PAGE_SIZE.ORDER.HISTORY.SM),
      sortBy: z.string().optional().default("createdAt"),
      orderBy: z
        .union([z.literal(1), z.literal(-1)])
        .optional()
        .default(-1),
    }),
  )
  .query(async ({ parsedInput }) => {
    const [orders, total] = await Promise.all([
      ordersRepository.getAllOrders({
        skip: (parsedInput.page - 1) * parsedInput.size,
        limit: parsedInput.size,
        sortBy: parsedInput.sortBy,
        orderBy: parsedInput.orderBy,
      }),
      next_cache.orders.countAll(),
    ]);

    return {
      total,
      items: orders,
    };
  });

export const getLast30DaysOrders = getAuthQueryClient({
  resource,
}).query(async () => {
  return await next_cache.orders.last30Days();
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

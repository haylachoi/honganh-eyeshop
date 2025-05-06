"use server";

import {
  authCustomerActionClient,
  customerActionClient,
  getAuthActionClient,
} from "@/lib/actions";
import { orderInputSchema } from "./order.validator";
import ordersRepository from "@/lib/db/repositories/orders";
import couponsRepository from "@/lib/db/repositories/coupons";
import { calculateDiscount, validateCoupon } from "../coupons/coupon.utils";
import { ERROR_MESSAGES, SHIPPING_FEE } from "@/constants";
import { revalidateTag } from "next/cache";
import { validateItems } from "../checkouts/checkout.utils";
import { NotFoundError, ValidationError } from "@/lib/error";
import { z } from "zod";
import { IdSchema } from "@/lib/validator";
import checkoutsRepository from "@/lib/db/repositories/checkouts";
import { createOrderImages, generateOrderId } from "./order.utils";
import { ORDER_STATUS_MAPS } from "./order.constants";
import { CACHE_CONFIG } from "@/cache/cache.constant";

const orderCacheTag = CACHE_CONFIG.ORDER.ALL.TAGS[0];

const resource = "order";

const modifyOrderActionClient = getAuthActionClient({
  resource,
  action: "modify",
});

export const createOrderAction = customerActionClient
  .metadata({
    actionName: "createOrderAction",
  })
  .schema(orderInputSchema)
  .action(async ({ parsedInput: { couponCode, ...parsedInput }, ctx }) => {
    const userId = ctx.userId;
    const checkout = await checkoutsRepository.getCheckoutById(
      parsedInput.checkoutid,
    );
    if (!checkout) {
      throw new NotFoundError({
        resource: "checkout",
        message: ERROR_MESSAGES.CHECKOUT.NOT_FOUND,
      });
    }

    const items = checkout.items;
    // validate items
    const checkedItems = await validateItems({ items });
    if (checkedItems.some((item) => !item.available)) {
      throw new ValidationError({
        resource: "product",
        message: ERROR_MESSAGES.ORDER.CREATE.ERROR.UNAVAILABLE,
        detail: checkedItems.filter((item) => !item.available),
      });
    }

    const subTotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    // validate coupon
    const coupon = couponCode
      ? await couponsRepository.getCouponByCode(couponCode)
      : null;
    const validCoupon = validateCoupon({ coupon, subTotal });

    if (coupon && !validCoupon.valid) {
      throw new ValidationError({
        resource: "coupon",
        message: validCoupon.message,
      });
    }

    const discount = validCoupon.valid
      ? calculateDiscount({ total: subTotal, coupon: validCoupon.couponInfo })
      : 0;

    const total = Math.max(subTotal - discount, 0);
    const orderId = generateOrderId();

    const newItems = await createOrderImages({
      items,
    });

    const result = await ordersRepository.createOrder({
      input: {
        ...parsedInput,
        orderId,
        userId,
        items: newItems,
        discount,
        subTotal,
        total,
        coupon: coupon
          ? {
              code: coupon.code,
              value: coupon.value,
              discountType: coupon.discountType,
              maxDiscount: coupon.maxDiscount,
              expiryDate: coupon.expiryDate,
            }
          : undefined,
        paymentStatus: "pending",
        shippingFee: SHIPPING_FEE,
        orderStatus: "pending",
      },
      checkoutId: parsedInput.checkoutid,
    });

    revalidateTag(orderCacheTag);
    return result;
  });

// todo: change name with suffix action and metadata name
export const completeOrder = modifyOrderActionClient
  .metadata({
    actionName: "setOrderPaidAt",
  })
  .schema(
    z.object({
      id: z.union([IdSchema, z.array(IdSchema)]),
      date: z.date(),
    }),
  )
  .action(async ({ parsedInput }) => {
    await ordersRepository.updateStatusOrder({
      ...parsedInput,
      status: ORDER_STATUS_MAPS.COMPLETED,
      reason: "",
    });
    revalidateTag(orderCacheTag);
  });

// todo: change schema to union
export const confirmOrderAction = modifyOrderActionClient
  .metadata({
    actionName: "confirmOrder",
  })
  .schema(
    z.object({
      id: IdSchema,
      date: z.date(),
    }),
  )
  .action(async ({ parsedInput }) => {
    await ordersRepository.updateStatusOrder({
      ...parsedInput,
      status: ORDER_STATUS_MAPS.CONFIRMED,
      reason: "",
    });
    revalidateTag(orderCacheTag);
  });

export const rejectOrderAction = modifyOrderActionClient
  .metadata({
    actionName: "rejectOrder",
  })
  .schema(
    z.object({
      id: z.union([IdSchema, z.array(IdSchema)]),
      date: z.date(),
      reason: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    await ordersRepository.updateStatusOrder({
      ...parsedInput,
      status: ORDER_STATUS_MAPS.REJECTED,
    });
    revalidateTag(orderCacheTag);
  });

export const trackOrderAction = customerActionClient
  .metadata({
    actionName: "trackOrder",
  })
  .schema(z.object({ orderId: z.string() }))
  .action(async ({ parsedInput: { orderId } }) => {
    const order = await ordersRepository.getOrderByOrderId(orderId);
    if (!order) {
      throw new NotFoundError({
        resource: "order",
        message: ERROR_MESSAGES.ORDER.NOT_FOUND,
      });
    }
  });

export const getOrderHistoryAction = authCustomerActionClient
  .metadata({
    actionName: "getOrderHistory",
  })
  .schema(
    z.object({
      page: z.number(),
      size: z.number(),
    }),
  )
  .action(async ({ ctx, parsedInput: { page, size } }) => {
    const orders = await ordersRepository.getOrdersByUserId({
      userId: ctx.userId,
      offset: page * size,
      limit: size,
    });
    return orders;
  });

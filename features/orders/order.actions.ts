"use server";

import { authActionClient, customerActionClient } from "@/lib/actions";
import { orderInputSchema } from "./order.validator";
import ordersRepository from "@/lib/db/repositories/orders";
import couponsRepository from "@/lib/db/repositories/coupons";
import { calculateDiscount, validateCoupon } from "../coupons/coupon.utils";
import { CACHE, ERROR_MESSAGES, SHIPPING_FEE } from "@/constants";
import { revalidateTag } from "next/cache";
import { validateItems } from "../checkouts/checkout.utils";
import { ValidationError } from "@/lib/error";
import { z } from "zod";
import { IdSchema } from "@/lib/validator";

export const createOrderAction = customerActionClient
  .metadata({
    actionName: "createOrderAction",
  })
  .schema(orderInputSchema)
  .action(async ({ parsedInput: { couponCode, ...parsedInput }, ctx }) => {
    const userId = ctx.userId;
    // validate items
    const checkedItems = await validateItems({ items: parsedInput.items });
    if (checkedItems.some((item) => !item.available)) {
      throw new ValidationError({
        resource: "product",
        message: ERROR_MESSAGES.ORDER.CREATE.ERROR.UNAVAILABLE,
        detail: checkedItems.filter((item) => !item.available),
      });
    }

    const subTotal = parsedInput.items.reduce(
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

    const result = await ordersRepository.createOrder({
      ...parsedInput,
      orderId: crypto.randomUUID(),
      userId,
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
    });

    revalidateTag(CACHE.ORDER.ALL.TAGS);
    return result;
  });

export const setOrderCompletedAt = authActionClient
  .metadata({
    actionName: "setOrderPaidAt",
  })
  .schema(
    z.object({
      id: IdSchema,
      completedAt: z.date(),
    }),
  )
  .action(async ({ parsedInput }) => {
    // todo: check order status
    await ordersRepository.setOrderCompletedAt(parsedInput);
    revalidateTag(CACHE.ORDER.ALL.TAGS);
  });

"use server";

import { customerActionClient } from "@/lib/actions";
import { orderInputSchema } from "./order.validator";
import ordersRepository from "@/lib/db/repositories/orders";
import couponsRepository from "@/lib/db/repositories/coupons";
import { calculateDiscount, validateCoupon } from "../coupons/coupon.utils";
import { SHIPPING_FEE } from "@/constants";

export const createOrderAction = customerActionClient
  .metadata({
    actionName: "createOrderAction",
  })
  .schema(orderInputSchema)
  .action(async ({ parsedInput: { couponCode, ...parsedInput }, ctx }) => {
    const userId = ctx.userId;

    const subTotal = parsedInput.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    const coupon = couponCode
      ? await couponsRepository.getCouponByCode(couponCode)
      : null;

    const validCoupon = validateCoupon({ coupon, subTotal });

    let discount = 0;
    if (validCoupon.valid) {
      discount = calculateDiscount({
        total: subTotal,
        coupon: validCoupon.couponInfo,
      });
    }
    const total = Math.max(subTotal - discount, 0);

    const result = await ordersRepository.createOrder({
      ...parsedInput,
      userId,
      discount,
      subTotal,
      total,
      coupon: coupon
        ? {
            code: coupon.code,
            value: coupon.value,
            type: coupon.type,
            maxDiscount: coupon.maxDiscount,
            expiryDate: coupon.expiryDate,
          }
        : undefined,
      paymentStatus: "pending",
      shippingFee: SHIPPING_FEE,
      orderStatus: "pending",
    });
    return result;
  });

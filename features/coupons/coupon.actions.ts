"use server";

import { authActionClient, customerActionClient } from "@/lib/actions";
import { couponInputSchema, couponUpdateSchema } from "./coupon.validator";
import couponsRepository from "@/lib/db/repositories/coupons";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { CACHE, ERROR_MESSAGES } from "@/constants";
import checkoutsRepository from "@/lib/db/repositories/checkouts";
import { AuthenticationError, NotFoundError } from "@/lib/error";
import { validateCoupon } from "./coupon.utils";

export const checkValidCouponCodeAction = customerActionClient
  .metadata({
    actionName: "checkValidCouponCodeAction",
  })
  .schema(
    z.object({
      code: z.string(),
      checkoutId: z.string(),
    }),
  )
  .action(async ({ parsedInput: { code, checkoutId }, ctx }) => {
    const checkout = await checkoutsRepository.getCheckoutById(checkoutId);
    if (!checkout) {
      throw new NotFoundError({
        resource: "checkout",
        message: ERROR_MESSAGES.CHECKOUT.NOT_FOUND,
      });
    }
    if (checkout.userId && checkout.userId !== ctx.userId) {
      throw new AuthenticationError({
        resource: "checkout",
      });
    }

    const coupon = await couponsRepository.getCouponByCode(code);
    const validCoupon = validateCoupon({ coupon, subTotal: checkout.total });

    return validCoupon;
  });

export const createCouponAction = authActionClient
  .metadata({
    actionName: "createCouponAction",
  })
  .schema(couponInputSchema)
  .action(async ({ parsedInput }) => {
    const result = await couponsRepository.createCoupon(parsedInput);

    revalidateTag(CACHE.COUPONS.ALL.TAGS);
    return result;
  });

export const updateCouponAction = authActionClient
  .metadata({
    actionName: "updateCouponAction",
  })
  .schema(couponUpdateSchema)
  .action(async ({ parsedInput }) => {
    const result = await couponsRepository.updateCoupon(parsedInput);

    revalidateTag(CACHE.COUPONS.ALL.TAGS);
    return result;
  });

export const deleteCouponActions = authActionClient
  .metadata({
    actionName: "deleteCouponActions",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput }) => {
    const result = await couponsRepository.deleteCoupon(parsedInput);
    revalidateTag(CACHE.COUPONS.ALL.TAGS);
    return result;
  });

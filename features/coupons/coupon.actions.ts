"use server";

import { customerActionClient, getAuthActionClient } from "@/lib/actions";
import { couponInputSchema, couponUpdateSchema } from "./coupon.validator";
import couponsRepository from "@/lib/db/repositories/coupons";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { ERROR_MESSAGES } from "@/constants";
import checkoutsRepository from "@/lib/db/repositories/checkouts";
import { AuthenticationError, NotFoundError } from "@/lib/error";
import { validateCoupon } from "./coupon.utils";
import { CACHE_CONFIG } from "@/cache/cache.constant";

const couponCacheTag = CACHE_CONFIG.COUPONS.ALL.TAGS[0];

const resource = "coupon";
const modifyCouponActionClient = getAuthActionClient({
  resource,
  action: "modify",
});

const deleteCouponActionClient = getAuthActionClient({
  resource,
  action: "delete",
});

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

export const createCouponAction = modifyCouponActionClient
  .metadata({
    actionName: "createCouponAction",
  })
  .schema(couponInputSchema)
  .action(async ({ parsedInput }) => {
    const result = await couponsRepository.createCoupon(parsedInput);

    revalidateTag(couponCacheTag);
    return result;
  });

export const updateCouponAction = modifyCouponActionClient
  .metadata({
    actionName: "updateCouponAction",
  })
  .schema(couponUpdateSchema)
  .action(async ({ parsedInput }) => {
    const result = await couponsRepository.updateCoupon(parsedInput);

    revalidateTag(couponCacheTag);
    return result;
  });

export const deleteCouponActions = deleteCouponActionClient
  .metadata({
    actionName: "deleteCouponActions",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput }) => {
    const result = await couponsRepository.deleteCoupon(parsedInput);
    revalidateTag(couponCacheTag);
    return result;
  });

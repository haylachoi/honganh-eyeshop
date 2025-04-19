import couponsRepository from "@/lib/db/repositories/coupons";
import { getAuthQueryClient } from "@/lib/query";
import { IdSchema } from "@/lib/validator";

const resource = "coupon";

const couponQueryClient = getAuthQueryClient({
  resource,
});

export const getAllCouponsQuery = couponQueryClient.query(async () => {
  const result = await couponsRepository.getAllCoupons();
  return result;
});

export const getCouponByIdQuery = couponQueryClient
  .schema(IdSchema)
  .query(async ({ parsedInput }) => {
    const result = await couponsRepository.getCouponById(parsedInput);
    return result;
  });

import couponsRepository from "@/lib/db/repositories/coupons";
import { authCustomerQueryClient } from "@/lib/query";
import { IdSchema } from "@/lib/validator";

export const getAllCouponsQuery = authCustomerQueryClient.query(async () => {
  const result = await couponsRepository.getAllCoupons();
  return result;
});

export const getCouponByIdQuery = authCustomerQueryClient
  .schema(IdSchema)
  .query(async ({ parsedInput }) => {
    const result = await couponsRepository.getCouponById(parsedInput);
    return result;
  });

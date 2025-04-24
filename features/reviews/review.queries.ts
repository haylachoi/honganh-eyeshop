import next_cache from "@/cache";
import reviewRepository from "@/lib/db/repositories/reviews";
import { safeQuery } from "@/lib/query";
import { IdSchema } from "@/lib/validator";

export const getAllReviewsWithFullInfo = safeQuery.query(async () => {
  const result = await next_cache.reviews.admin.getAllWithFullInfo();
  console.log(result);
  return result;
});

export const getReviewsWithUserNameByProductId = safeQuery
  .schema(IdSchema)
  .query(async ({ parsedInput }) => {
    const result = await reviewRepository.getReviewsWithUserNameByProductId({
      productId: parsedInput,
    });
    return result;
  });

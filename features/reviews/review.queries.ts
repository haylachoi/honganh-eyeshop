import reviewRepository from "@/lib/db/repositories/reviews";
import { safeQuery } from "@/lib/query";
import { IdSchema } from "@/lib/validator";

export const getReviewsWithUserNameByProductId = safeQuery
  .schema(IdSchema)
  .query(async ({ parsedInput }) => {
    const result = await reviewRepository.getReviewsWithUserNameByProductId({
      productId: parsedInput,
    });
    return result;
  });

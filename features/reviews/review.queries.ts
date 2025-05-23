import next_cache from "@/cache";
import reviewRepository from "@/lib/db/repositories/reviews";
import { safeQuery } from "@/lib/query";
import { IdSchema } from "@/lib/validator";
import { z } from "zod";

export const getAllReviewsWithFullInfo = safeQuery
  .schema(
    z.object({
      page: z.number().optional().default(1),
      size: z.number(),
      sortBy: z.string().optional().default("createdAt"),
      orderBy: z
        .union([z.literal(1), z.literal(-1)])
        .optional()
        .default(-1),
    }),
  )
  .query(async ({ parsedInput }) => {
    const [reviews, total] = await Promise.all([
      next_cache.reviews.admin.getAllWithFullInfo({
        skip: (parsedInput.page - 1) * parsedInput.size,
        limit: parsedInput.size,
        sortBy: parsedInput.sortBy,
        orderBy: parsedInput.orderBy,
      }),
      next_cache.reviews.admin.countReviews(),
    ]);

    return {
      total,
      items: reviews,
      size: parsedInput.size,
    };
  });

export const getReviewsWithUserNameByProductId = safeQuery
  .schema(IdSchema)
  .query(async ({ parsedInput }) => {
    const result = await reviewRepository.getReviewsWithUserNameByProductId({
      productId: parsedInput,
    });
    return result;
  });

"use server";

import { authCustomerActionClient, getAuthActionClient } from "@/lib/actions";
import { ReviewInputSchema } from "./review.validator";
import reviewRepository from "@/lib/db/repositories/reviews";
import { IdSchema } from "@/lib/validator";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { CACHE_CONFIG } from "@/cache/cache.constant";
import { ReviewType } from "./review.type";

const resource = "review";
const modifyReviewActionClient = getAuthActionClient({
  resource,
  action: "modify",
});

const createReviewActionClient = getAuthActionClient({
  resource,
  action: "create",
});

export const createReviewAction = createReviewActionClient
  .metadata({
    actionName: "createReview",
  })
  .schema(ReviewInputSchema)
  .action(
    async ({
      parsedInput,
      ctx: { userId },
    }): Promise<
      { success: true; data: ReviewType } | { success: false; message: string }
    > => {
      const canReview = await reviewRepository.canUserReview({
        productId: parsedInput.productId,
        userId: userId,
      });

      if (!canReview) {
        return {
          success: false,
          message:
            "Bạn không thể đánh giá sản phẩm này vì bạn chưa mua hàng hoặc đã mua hàng từ quá lâu",
        };
      }
      const result = await reviewRepository.createReview({
        ...parsedInput,
        userId,
      });

      // consider don't use revalidateTag
      revalidateTag(CACHE_CONFIG.REVIEWS.ALL.TAGS[0]);

      return {
        success: true,
        data: result,
      };
    },
  );

export const canUserReviewAction = authCustomerActionClient
  .metadata({
    actionName: "canUserReview",
  })
  .schema(
    z.object({
      productId: IdSchema,
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    return await reviewRepository.canUserReview({
      productId: parsedInput.productId,
      userId: ctx.userId,
    });
  });

export const hidenReviewAction = modifyReviewActionClient
  .metadata({
    actionName: "hideReview",
  })
  .schema(
    z.object({
      reviewId: IdSchema,
    }),
  )
  .action(async ({ parsedInput }) => {
    await reviewRepository.hideReview({
      reviewId: parsedInput.reviewId,
    });

    revalidateTag(CACHE_CONFIG.PRODUCTS.ALL.TAGS[0]);
    revalidateTag(CACHE_CONFIG.REVIEWS.ALL.TAGS[0]);
  });

export const restoreReviewAction = modifyReviewActionClient
  .metadata({
    actionName: "restoreReview",
  })
  .schema(
    z.object({
      reviewId: IdSchema,
    }),
  )
  .action(async ({ parsedInput }) => {
    await reviewRepository.restoreReview({
      reviewId: parsedInput.reviewId,
    });

    // consider don't use revalidateTag
    revalidateTag(CACHE_CONFIG.PRODUCTS.ALL.TAGS[0]);
    revalidateTag(CACHE_CONFIG.REVIEWS.ALL.TAGS[0]);
  });

export const deleteReviewAction = modifyReviewActionClient
  .metadata({
    actionName: "deleteReview",
  })
  .schema(
    z.object({
      reviewId: z.union([IdSchema, z.array(IdSchema)]),
    }),
  )
  .action(async ({ parsedInput }) => {
    await reviewRepository.deleteReview(parsedInput.reviewId);

    revalidateTag(CACHE_CONFIG.PRODUCTS.ALL.TAGS[0]);
    revalidateTag(CACHE_CONFIG.REVIEWS.ALL.TAGS[0]);
  });

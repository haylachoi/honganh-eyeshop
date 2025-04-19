"use server";

import { authCustomerActionClient, getAuthActionClient } from "@/lib/actions";
import { ReviewInputSchema } from "./review.validator";
import reviewRepository from "@/lib/db/repositories/reviews";
import { IdSchema } from "@/lib/validator";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { CACHE_CONFIG } from "@/cache/cache.constant";

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
  .action(async ({ parsedInput, ctx: { userId } }) => {
    // todo: check order of user
    await reviewRepository.createReview({
      ...parsedInput,
      userId,
    });
  });

// todo: use route api instead of action
export const getUserReviewStatusAction = authCustomerActionClient
  .metadata({
    actionName: "getUserReviewStatus",
  })
  .schema(
    z.object({
      productId: IdSchema,
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const review = await reviewRepository.getReviewByProductIdAndUserId({
      productId: parsedInput.productId,
      userId: ctx.userId,
    });

    const canReview = await reviewRepository.canUserReview({
      productId: parsedInput.productId,
      userId: ctx.userId,
    });

    return {
      review,
      canReview,
    };
  });

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

    revalidateTag(CACHE_CONFIG.PRODUCTS.ALL.TAGS);
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
    revalidateTag(CACHE_CONFIG.PRODUCTS.ALL.TAGS);
    revalidateTag(CACHE_CONFIG.REVIEWS.ALL.TAGS[0]);
  });

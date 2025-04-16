"use server";

import { authCustomerActionClient } from "@/lib/actions";
import { ReviewInputSchema } from "./review.validator";
import reviewRepository from "@/lib/db/repositories/reviews";
import { IdSchema } from "@/lib/validator";
import { z } from "zod";
import ordersRepository from "@/lib/db/repositories/orders";

export const createReviewAction = authCustomerActionClient
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

    const canReview = await ordersRepository.canUserReview({
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
    return await ordersRepository.canUserReview({
      productId: parsedInput.productId,
      userId: ctx.userId,
    });
  });

export const hidenReviewAction = authCustomerActionClient
  .metadata({
    actionName: "hideReview",
  })
  .schema(
    z.object({
      reviewId: IdSchema,
    }),
  )
  .action(async ({ parsedInput }) => {
    return await reviewRepository.hideReview({
      reviewId: parsedInput.reviewId,
    });

    // revalidate product
    //  revalidate Review
  });

export const restoreReviewAction = authCustomerActionClient
  .metadata({
    actionName: "restoreReview",
  })
  .schema(
    z.object({
      reviewId: IdSchema,
    }),
  )
  .action(async ({ parsedInput }) => {
    return await reviewRepository.restoreReview({
      reviewId: parsedInput.reviewId,
    });

    // revalidate product
    //  revalidate Review
  });

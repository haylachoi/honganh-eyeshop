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

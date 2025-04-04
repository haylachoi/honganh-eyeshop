import { IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";
import { userNameSchema } from "../auth/auth.validator";

const baseReviewSchema = z.object({
  productId: IdSchema,
  comment: z.string().min(1, "Comment is required").optional(),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

export const ReviewInputSchema = baseReviewSchema;

export const ReviewDbInputSchema = baseReviewSchema.extend({
  userId: IdSchema,
});

export const ReviewTypeSchema = baseReviewSchema
  .extend({
    _id: MongoIdSchema,
    userId: MongoIdSchema,
    productId: MongoIdSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
    name: userNameSchema.optional(),
  })
  .transform(({ _id, productId, userId, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    userId: userId.toString(),
    productId: productId.toString(),
  }));

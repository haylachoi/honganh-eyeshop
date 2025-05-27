import { idSchema, mongoIdSchema } from "@/lib/validator";
import { z } from "zod";
import { userNameSchema } from "../auth/auth.validator";

const baseReviewSchema = z.object({
  productId: idSchema,
  comment: z.string().optional(),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

export const reviewInputSchema = baseReviewSchema;

export const reviewDbInputSchema = baseReviewSchema.extend({
  userId: idSchema,
});

export const reviewTypeSchema = baseReviewSchema
  .extend({
    _id: mongoIdSchema,
    userId: mongoIdSchema,
    productId: mongoIdSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
    name: userNameSchema.optional(),
    isDeleted: z.boolean().optional(),
  })
  .transform(({ _id, productId, userId, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    userId: userId.toString(),
    productId: productId.toString(),
  }));

export const reviewWithFullInfoSchema = z
  .object({
    _id: mongoIdSchema,
    rating: z.number(),
    comment: z.string().optional(),
    isDeleted: z.boolean().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    productId: mongoIdSchema,
    product: z
      .object({
        _id: mongoIdSchema,
        slug: z.string(),
        name: z.string(),
        category: z.object({
          slug: z.string(),
        }),
      })
      .transform(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toString(),
      }))
      .optional(),
    user: z
      .object({
        _id: mongoIdSchema,
        name: z.string(),
      })
      .transform(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toString(),
      })),
  })
  .transform(({ _id, productId, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    productId: productId.toString(),
  }));

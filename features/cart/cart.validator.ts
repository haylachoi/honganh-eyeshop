import { z } from "zod";
import { IdSchema, MongoIdSchema } from "@/lib/validator";
import {
  productTypeWithoutTransformSchema,
  variantTypeSchema,
} from "../products/product.validator";

// general
const quantitySchema = z.coerce
  .number()
  .int()
  .min(1, "Quantity must be at least 1");

// base
const baseCartItemSchema = z.object({
  productId: IdSchema,
  variantId: z.string().uuid(),
  quantity: quantitySchema,
});

// main
export const cartItemInputSchema = baseCartItemSchema;

export const cartItemDisplaySchema = productTypeWithoutTransformSchema
  .pick({
    name: true,
    slug: true,
    category: true,
    brand: true,
    tags: true,
    // avgRating: true,
    // numReviews: true,
    // numSales: true,
  })
  .extend({
    variant: variantTypeSchema,
    productId: MongoIdSchema,
    quantity: quantitySchema.default(1),
  })
  .transform(({ productId, ...rest }) => ({
    ...rest,
    productId: productId.toString(),
  }));

export const cartItemTypeSchema = z
  .object({
    productId: MongoIdSchema,
    variantId: z.string().uuid(),
    quantity: z.coerce.number().int(),
    // .min(1, "Quantity must be at least 1"),
  })
  .transform(({ productId, ...rest }) => ({
    ...rest,
    productId: productId.toString(),
  }));

export const cartInputSchema = z.object({
  userId: IdSchema,
  item: cartItemInputSchema,
});

export const cartTypeWithoutTransformSchema = z.object({
  _id: MongoIdSchema,
  items: z.array(cartItemTypeSchema),
  userId: MongoIdSchema,
});

export const cartTypeSchema = cartTypeWithoutTransformSchema.transform(
  ({ _id, userId, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    userId: userId.toString(),
  }),
);

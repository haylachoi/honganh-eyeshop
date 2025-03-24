import { z } from "zod";
import { IdSchema, MoneySchema, MongoIdSchema } from "@/lib/validator";
import { variantAttributeSchema } from "../products/product.validator";

// general
const moneySchema = MoneySchema;
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

export const cartItemDisplaySchema = z.object({
  productId: IdSchema,
  variantId: z.string().uuid(),
  attributes: z.array(variantAttributeSchema),
  price: moneySchema,
  originPrice: moneySchema,
  quantity: quantitySchema,
  countInStock: z.coerce
    .number()
    .int()
    .min(1, "Countin stock must be at least 1"),
});

export const cartItemTypeSchema = z
  .object({
    productId: MongoIdSchema,
    variantId: z.string().uuid(),
    quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
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

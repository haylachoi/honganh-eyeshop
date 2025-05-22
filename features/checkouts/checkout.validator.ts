import {
  IdSchema,
  imageUrlSchema,
  MoneySchema,
  MongoIdSchema,
} from "@/lib/validator";
import { z } from "zod";
import { variantAttributeSchema } from "../products/product.validator";
import { PAYMENT_METHOD_LIST } from "./checkout.constants";

// general
const moneySchema = MoneySchema;
export const paymentMethodSchema = z.enum(PAYMENT_METHOD_LIST);

// base
const customerInfoSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

const baseItemSchema = z.object({
  productId: IdSchema,
  variantId: z.string().uuid(),
  productName: z.string(),
  productUrl: z.string(),
  imageUrl: imageUrlSchema,
  attributes: z.array(variantAttributeSchema),
  price: moneySchema,
  quantity: z.number(),
});

const shippingAddressSchema = z.object({
  address: z.string().optional(),
  ward: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
});

export const checkoutItemInputSchema = baseItemSchema;

export const checkoutItemSchema = baseItemSchema
  .extend({
    productId: MongoIdSchema,
    variantId: z.string().uuid(),
  })
  .transform(({ productId, ...rest }) => ({
    ...rest,
    productId: productId.toString(),
  }));

// main
const baseCheckoutSchema = z.object({
  customer: customerInfoSchema.optional(),
  shippingAddress: shippingAddressSchema.optional(),
  items: z.array(checkoutItemSchema),
  total: moneySchema,
  paymentMethod: paymentMethodSchema,
  shippingFee: moneySchema,
});

export const checkoutInputSchema = baseCheckoutSchema
  .omit({
    shippingFee: true,
    total: true,
  })
  .extend({
    items: z.array(checkoutItemInputSchema),
  });

export const checkoutDbInputSchema = baseCheckoutSchema.extend({
  userId: MongoIdSchema.optional(),
  isOrderd: z.boolean().default(false),
});

export const checkoutTypeSchema = checkoutDbInputSchema
  .extend({
    _id: MongoIdSchema,
    isOrderd: z.boolean().default(false),
    orderId: z.string().optional(),
  })
  .transform(({ _id, userId, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    userId: userId?.toString(),
  }));

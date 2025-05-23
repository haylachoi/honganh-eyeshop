import { z } from "zod";
import {
  checkoutDbInputSchema,
  checkoutInputSchema,
  checkoutItemSchema,
  checkoutTypeSchema,
} from "./checkout.validator";

export type CheckoutInputType = z.input<typeof checkoutInputSchema>;
export type CheckoutDbInputType = z.input<typeof checkoutDbInputSchema>;
export type CheckoutType = z.infer<typeof checkoutTypeSchema>;
export type CheckoutItemType = z.infer<typeof checkoutItemSchema>;

export type ValidatedItemInfo = {
  product: {
    productId: string;
    variantId: string;
    quantity: number;
  };
  available: boolean;
  message: string;
  availableStock?: number | undefined;
};

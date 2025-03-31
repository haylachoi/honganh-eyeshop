import { z } from "zod";
import {
  checkoutDbInputSchema,
  checkoutInputSchema,
  checkoutTypeSchema,
} from "./checkout.validator";

export type CheckoutInputType = z.input<typeof checkoutInputSchema>;
export type CheckoutDbInputType = z.input<typeof checkoutDbInputSchema>;
export type CheckoutType = z.infer<typeof checkoutTypeSchema>;

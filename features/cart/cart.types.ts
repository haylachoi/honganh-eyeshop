import { z } from "zod";
import {
  cartInputSchema,
  cartItemDisplaySchema,
  cartItemInputSchema,
  cartItemTypeSchema,
  cartTypeSchema,
} from "./cart.validator";

export type CartItemType = z.infer<typeof cartItemTypeSchema>;
export type CartItemInputType = z.infer<typeof cartItemInputSchema>;
export type CartInputType = z.infer<typeof cartInputSchema>;
export type CartType = z.infer<typeof cartTypeSchema>;
export type CartItemDisplayType = z.infer<typeof cartItemDisplaySchema>;

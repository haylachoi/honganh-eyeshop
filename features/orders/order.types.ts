import { z } from "zod";
import { orderInputSchema, orderTypeSchema } from "./order.validator";

export type OrderInputType = z.infer<typeof orderInputSchema>;

export type OrderType = z.infer<typeof orderTypeSchema>;

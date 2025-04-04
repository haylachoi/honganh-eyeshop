import { z } from "zod";
import {
  ReviewDbInputSchema,
  ReviewInputSchema,
  ReviewTypeSchema,
} from "./review.validator";

export type ReviewInputType = z.infer<typeof ReviewInputSchema>;
export type ReviewDbInputType = z.input<typeof ReviewDbInputSchema>;
export type ReviewType = z.infer<typeof ReviewTypeSchema>;

import { z } from "zod";
import {
  reviewDbInputSchema,
  reviewInputSchema,
  reviewTypeSchema,
  reviewWithFullInfoSchema,
} from "./review.validator";

export type ReviewInputType = z.infer<typeof reviewInputSchema>;
export type ReviewDbInputType = z.input<typeof reviewDbInputSchema>;
export type ReviewType = z.infer<typeof reviewTypeSchema>;

export type ReviewWithFullInfoType = z.infer<typeof reviewWithFullInfoSchema>;

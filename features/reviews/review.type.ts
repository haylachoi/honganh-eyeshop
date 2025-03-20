import { z } from "zod";
import { ReviewInputSchema } from "./review.validator";

export type ReviewInputType = z.infer<typeof ReviewInputSchema>;

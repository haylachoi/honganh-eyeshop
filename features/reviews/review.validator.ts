import { MongoIdSchema } from "@/lib/validator";
import { z } from "zod";

export const ReviewInputSchema = z.object({
  product: MongoIdSchema,
  title: z.string().min(1, "Title is required"),
  comment: z.string().min(1, "Comment is required"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

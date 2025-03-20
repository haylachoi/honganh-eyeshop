import { z } from "zod";
import {
  blogDbInputSchema,
  blogInputSchema,
  blogTypeSchema,
  blogUpdateSchema,
} from "./blog.validators";

export type BlogInputType = z.infer<typeof blogInputSchema>;
export type BlogDbInputType = z.infer<typeof blogDbInputSchema>;
export type BlogUpdateType = z.infer<typeof blogUpdateSchema>;
export type BlogType = z.infer<typeof blogTypeSchema>;

import { z } from "zod";
import {
  blogDbInputSchema,
  blogInputSchema,
  blogTypeSchema,
  blogUpdateSchema,
  imageSourceSchema,
  searchBlogResultSchema,
} from "./blog.validators";

export type BlogInputType = z.infer<typeof blogInputSchema>;
export type BlogDbInputType = z.infer<typeof blogDbInputSchema>;
export type BlogUpdateType = z.infer<typeof blogUpdateSchema>;
export type BlogType = z.infer<typeof blogTypeSchema>;
export type SearchBlogResultType = z.infer<typeof searchBlogResultSchema>;

export type ImageSourceType = z.infer<typeof imageSourceSchema>;

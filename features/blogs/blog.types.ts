import { z } from "zod";
import {
  blogDbInputSchema,
  blogInputSchema,
  blogTypeSchema,
  blogUpdateSchema,
  imageSourceSchema,
} from "./blog.validators";

export type BlogInputType = z.infer<typeof blogInputSchema>;
export type BlogDbInputType = z.infer<typeof blogDbInputSchema>;
export type BlogUpdateType = z.infer<typeof blogUpdateSchema>;
export type BlogType = z.infer<typeof blogTypeSchema>;

export type ImageSourceType = z.infer<typeof imageSourceSchema>;

export type TOCEntry = {
  id: string;
  text: string;
  level: number;
};

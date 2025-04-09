import { z } from "zod";
import {
  filterGroupSchema,
  filterInputSchema,
  filterTypeSchema,
  searchBlogResultSchema,
  searchProductResultSchema,
} from "./filter.validator";

export type FilterType = z.infer<typeof filterTypeSchema>;

export type FilterGroupType = z.infer<typeof filterGroupSchema>;
export type FilterInputType = z.infer<typeof filterInputSchema>;

export type searchProductResultType = z.output<
  typeof searchProductResultSchema
>;

export type SearchBlogResultType = z.infer<typeof searchBlogResultSchema>;

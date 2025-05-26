import { z } from "zod";
import {
  filterGroupSchema,
  filterInputSchema,
  filterTypeSchema,
  globalSearchResultSchema,
  searchBlogResultTranformSchema,
  searchProductResultTransformSchema,
} from "./filter.validator";

export type FilterType = z.infer<typeof filterTypeSchema>;

export type FilterGroupType = z.infer<typeof filterGroupSchema>;
export type FilterInputType = z.infer<typeof filterInputSchema>;

export type searchProductResultType = z.output<
  typeof searchProductResultTransformSchema
>;

export type SearchBlogResultType = z.infer<
  typeof searchBlogResultTranformSchema
>;

export type GlobalSearchResult = z.infer<typeof globalSearchResultSchema>;

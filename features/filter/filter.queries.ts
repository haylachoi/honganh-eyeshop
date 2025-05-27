import { customerQueryClient, safeQuery } from "@/lib/query";
import { idSchema } from "@/lib/validator";
import { categorySlugSchema } from "../categories/category.validator";
import { FILTER_KEYWORDS, SORTING_KEYWORDS } from "@/constants";
import {
  createProductQueryFilter,
  createSearchQuery,
  createSortingQuery,
} from "./filter.queries-builder";
import { getQueryOption } from "@/lib/utils";
import productRepository from "@/lib/db/repositories/products";
import { searchInputSchema } from "./filter.validator";
import next_cache from "@/cache";
import { searchProducts } from "./filter.services";

export const getFilterByCategoryId = customerQueryClient
  .schema(idSchema)
  .query(async ({ parsedInput }) => {
    const result = await next_cache.filters.getByCategoryId(parsedInput);
    return result;
  });

export const getFilterByCategorySlug = customerQueryClient
  .schema(categorySlugSchema)
  .query(async ({ parsedInput }) => {
    const result = await next_cache.filters.getByCategorySlug(parsedInput);
    return result;
  });

export const getGlobalFilters = customerQueryClient.query(async () => {
  const result = await next_cache.filters.getGlobal();
  return result;
});

export const searchProductByQuery = safeQuery
  .schema(searchInputSchema)
  .query(async ({ parsedInput: { page, size, params } }) => {
    const {
      [SORTING_KEYWORDS.sort_by]: sortBy,
      [SORTING_KEYWORDS.order_by]: orderBy,
      [FILTER_KEYWORDS.search]: search,
      ...restInput
    } = params;

    return searchProducts({
      search,
      filter: restInput,
      sortBy,
      orderBy,
      page,
      size,
    });
  });

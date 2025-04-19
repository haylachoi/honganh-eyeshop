import { customerQueryClient, safeQuery } from "@/lib/query";
import { IdSchema } from "@/lib/validator";
import { categorySlugSchema } from "../categories/category.validator";
import { SORTING_OPTIONS } from "@/constants";
import { createProductQueryFilter } from "./filter.queries-builder";
import { getQueryOption } from "@/lib/utils";
import productRepository from "@/lib/db/repositories/products";
import { searchInputSchema } from "./filter.validator";
import next_cache from "@/cache";

export const getFilterByCategoryId = customerQueryClient
  .schema(IdSchema)
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

export const getAllFilters = customerQueryClient.query(async () => {
  const result = await next_cache.filters.getAll();
  return result;
});

export const searchProductByQuery = safeQuery
  .schema(searchInputSchema)
  .query(async ({ parsedInput: { page, size, params } }) => {
    const {
      [SORTING_OPTIONS.SORT_BY]: sortBy,
      [SORTING_OPTIONS.ORDER_BY]: orderBy,
      ...restInput
    } = params;

    const query = createProductQueryFilter({
      input: restInput,
      includePrivateProduct: false,
    });
    const sortOptions = getQueryOption({ sortBy, orderBy });

    const result = await productRepository.searchProductByQuery({
      query,
      sortOptions,
      limit: size,
      skip: page * size,
    });

    return {
      ...result,
      page,
    };
  });

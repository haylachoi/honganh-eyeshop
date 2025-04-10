"use server";

import { CACHE, SORTING_OPTIONS } from "@/constants";
import { authActionClient } from "@/lib/actions";
import filtersRepository from "@/lib/db/repositories/filters";
import { revalidateTag } from "next/cache";
import { actionClient } from "@/lib/actions";
import blogsRepository from "@/lib/db/repositories/blogs";
import productRepository from "@/lib/db/repositories/products";
import { z } from "zod";
import { getQueryOption } from "@/lib/utils";
import { createProductQueryFilter } from "./filter.queries-builder";
import { searchInputSchema } from "./filter.validator";

export const createFilterAction = authActionClient
  .metadata({
    actionName: "createFilter",
  })
  .action(async () => {
    const result = await filtersRepository.createFilter();
    revalidateTag(CACHE.FILTER.ALL.TAGS);
    return result;
  });

export const searchAction = actionClient
  .metadata({
    actionName: "search",
  })
  .schema(z.string())
  .action(async ({ parsedInput: keyword }) => {
    const [textSearchProductResults, regexSearchProductResults] =
      await Promise.all([
        productRepository.searchProductAndSimpleReturnByQuery({
          query: { $text: { $search: keyword } },
        }),
        productRepository.searchProductAndSimpleReturnByQuery({
          query: {
            nameNoAccent: { $regex: keyword, $options: "i" },
          },
        }),
      ]);

    const mergedProductResults = [
      ...new Map(
        [
          ...textSearchProductResults.result,
          ...regexSearchProductResults.result,
        ].map((item) => [item.id, item]),
      ).values(),
    ];

    const [textSearchBlogResults, regexSearchBlogResults] = await Promise.all([
      blogsRepository.searchBlogAndSimpleReturnByQuery({
        query: { $text: { $search: keyword } },
      }),
      blogsRepository.searchBlogAndSimpleReturnByQuery({
        query: {
          titleNoAccent: { $regex: keyword, $options: "i" },
        },
      }),
    ]);

    const mergedBlogResults = [
      ...new Map(
        [...textSearchBlogResults.result, ...regexSearchBlogResults.result].map(
          (item) => [item.id, item],
        ),
      ).values(),
    ];

    return {
      products: {
        result: mergedProductResults,
        total: Math.max(
          textSearchProductResults.total,
          regexSearchProductResults.total,
        ),
      },
      blogs: {
        result: mergedBlogResults,
        total: Math.max(
          textSearchBlogResults.total,
          regexSearchBlogResults.total,
        ),
      },
    };
  });

export const searchProductByQuery = actionClient
  .metadata({
    actionName: "searchProductByQuery",
  })
  .schema(searchInputSchema)
  .action(async ({ parsedInput: { page, size, params } }) => {
    const {
      [SORTING_OPTIONS.SORT_BY]: sortBy,
      [SORTING_OPTIONS.ORDER_BY]: orderBy,
      ...restInput
    } = params;

    const query = createProductQueryFilter({
      input: restInput,
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

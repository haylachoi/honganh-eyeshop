"use server";

import { actionClient } from "@/lib/actions";
import blogsRepository from "@/lib/db/repositories/blogs";
import productRepository from "@/lib/db/repositories/products";
import { FilterQuery } from "mongoose";
import { z } from "zod";
import { ProductType } from "../products/product.types";
import { getQueryOption, normalizeSearchParams } from "@/lib/utils";
import { SORTING_OPTIONS } from "@/constants";

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
  .schema(z.record(z.string()))
  .action(async ({ parsedInput }) => {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const andConditions: FilterQuery<ProductType>[] = [];
    const {
      category: categoryFilter,
      price: priceFilter,
      search: searchFilter,
      [SORTING_OPTIONS.SORT_BY]: sortBy,
      [SORTING_OPTIONS.ORDER_BY]: orderBy,
      ...attrFilters
    } = parsedInput;

    for (const [name, values] of Object.entries(
      normalizeSearchParams(attrFilters),
    )) {
      andConditions.push({
        attributes: {
          $elemMatch: {
            name,
            valueSlug: { $in: values },
          },
        },
      });
    }

    if (categoryFilter) {
      andConditions.push({ "category.slug": categoryFilter });
    }

    if (searchFilter) {
      console.log(searchFilter);
      andConditions.push({
        nameNoAccent: { $regex: searchFilter, $options: "i" },
      });
    }

    if (priceFilter?.[0]) {
      const [min, rawMax] = priceFilter.split("-").map(Number);
      const max = rawMax === 0 ? 10_000_000 : rawMax;

      andConditions.push({
        $and: [{ maxPrice: { $gte: min } }, { minPrice: { $lte: max } }],
      });
    }

    const query: FilterQuery<ProductType> = andConditions.length
      ? { $and: andConditions }
      : {};

    const sortOptions = getQueryOption({ sortBy, orderBy });

    return productRepository.searchProductByQuery({ query, sortOptions });
  });

// export const searchAction = actionClient
//   .metadata({
//     actionName: "search",
//   })
//   .schema(z.string())
//   .action(async ({ parsedInput: keyword }) => {
//     const [textSearchResults, regexSearchResults] = await Promise.all([
//       productRepository.searchProductByQuery({
//         query: { $text: { $search: keyword } },
//       }),
//       productRepository.searchProductByQuery({
//         query: {
//           nameNoAccent: { $regex: keyword, $options: "i" },
//         },
//       }),
//     ]);
//
//     const mergedResults = [
//       ...new Map(
//         [...textSearchResults, ...regexSearchResults].map((item) => [
//           item.id,
//           item,
//         ]),
//       ).values(),
//     ];
//
//     return mergedResults;
//   });

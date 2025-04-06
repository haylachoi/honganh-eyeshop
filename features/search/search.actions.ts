"use server";

import { actionClient } from "@/lib/actions";
import blogsRepository from "@/lib/db/repositories/blogs";
import productRepository from "@/lib/db/repositories/products";
import { z } from "zod";

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

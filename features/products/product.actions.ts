"use server";

import { actionClient, authActionClient } from "@/lib/actions";
import { ProductInputSchema, productUpdateSchema } from "./product.validator";
import productRepository from "@/lib/db/repositories/products";
import { CACHE } from "@/constants";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { getCategoryInfoById } from "../categories/category.utils";
import {
  transformCreateInputVariantToDbVariant,
  transformUpdateInputVariantToDbVariant,
} from "./product.utils";
import { removeDiacritics } from "@/lib/utils";

export const createProductAction = authActionClient
  .metadata({
    actionName: "createProduct",
  })
  .schema(ProductInputSchema)
  .action(async ({ parsedInput }) => {
    const newVariants = await transformCreateInputVariantToDbVariant({
      variants: parsedInput.variants,
      identity: parsedInput.slug,
    });

    const newCategory = await getCategoryInfoById(parsedInput.category);

    const newTags = parsedInput.tags.map((tag) => ({
      _id: tag.id,
      name: tag.name,
    }));

    const input = {
      ...parsedInput,
      nameNoAccent: removeDiacritics(parsedInput.name),
      category: newCategory,
      variants: newVariants,
      tags: newTags,
    };

    await productRepository.createProduct(input);
    // todo: delete image if error

    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
  });

// todo: update only changed value
export const updateProductAction = authActionClient
  .metadata({
    actionName: "updateProduct",
  })
  .schema(productUpdateSchema)
  .action(async ({ parsedInput }) => {
    const newVariants = await transformUpdateInputVariantToDbVariant({
      variants: parsedInput.variants,
      identity: parsedInput.slug,
    });

    const newCategory = await getCategoryInfoById(parsedInput.category);

    const newTags = parsedInput.tags.map((tag) => ({
      _id: tag.id,
      name: tag.name,
    }));

    const input = {
      ...parsedInput,
      nameNoAccent: removeDiacritics(parsedInput.name),
      category: newCategory,
      variants: newVariants,
      tags: newTags,
    };

    await productRepository.updateProduct(input);
    //todo: delete images
    // todo: delete variant in cart if change. Should move to repository

    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
  });

export const updateRatingAction = authActionClient
  .metadata({
    actionName: "updateRating",
  })
  .schema(z.object({ productId: z.string(), rating: z.number() }))
  .action(async ({ parsedInput }) => {
    await productRepository.updateRating(parsedInput);
    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
  });

export const deleteProductAction = authActionClient
  .metadata({
    actionName: "deleteProduct",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput }) => {
    await productRepository.deleteProduct(parsedInput);
    //todo: delete images

    // delete item from cart

    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
  });

export const searchProductsAction = actionClient
  .metadata({
    actionName: "searchProducts",
  })
  .schema(z.string())
  .action(async ({ parsedInput: keyword }) => {
    const [textSearchResults, regexSearchResults] = await Promise.all([
      productRepository.searchProductByQuery({
        query: { $text: { $search: keyword } },
      }),
      productRepository.searchProductByQuery({
        query: {
          nameNoAccent: { $regex: keyword, $options: "i" },
        },
      }),
    ]);

    const mergedResults = [
      ...new Map(
        [...textSearchResults, ...regexSearchResults].map((item) => [
          item.id,
          item,
        ]),
      ).values(),
    ];

    return mergedResults;
  });

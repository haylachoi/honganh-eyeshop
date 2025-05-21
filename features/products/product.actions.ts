"use server";

import { getAuthActionClient } from "@/lib/actions";
import { ProductInputSchema, productUpdateSchema } from "./product.validator";
import productRepository from "@/lib/db/repositories/products";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { getCategoryInfoById } from "../categories/category.utils";
import {
  highestDiscount,
  transformCreateInputVariantToDbVariant,
  transformUpdateInputVariantToDbVariant,
} from "./product.utils";
import { removeDiacritics } from "@/lib/utils";
import { CACHE_CONFIG } from "@/cache/cache.constant";
import { deleteFile } from "@/lib/server-utils";
import { NotFoundError } from "@/lib/error";
import { ERROR_MESSAGES } from "@/constants/messages.constants";

const resource = "product";
const createProductActionClient = getAuthActionClient({
  resource,
  action: "create",
});

const modifyProductActionClient = getAuthActionClient({
  resource,
  action: "modify",
});

const deleteProductActionClient = getAuthActionClient({
  resource,
  action: "delete",
});

export const createProductAction = createProductActionClient
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

    let minPrice = Infinity;
    let maxPrice = -Infinity;

    parsedInput.variants.forEach((variant) => {
      if (variant.price < minPrice) {
        minPrice = variant.price;
      }
      if (variant.price > maxPrice) {
        maxPrice = variant.price;
      }
    });

    const input = {
      ...parsedInput,
      nameNoAccent: removeDiacritics(parsedInput.name),
      category: newCategory,
      variants: newVariants,
      highestDiscount: highestDiscount({ variants: newVariants }),
      minPrice,
      maxPrice,
      tags: newTags,
    };

    try {
      await productRepository.createProduct(input);
      revalidateTag(CACHE_CONFIG.PRODUCTS.ALL.TAGS[0]);
    } catch (error) {
      deleteFile(newVariants.flatMap((variant) => variant.images));
      throw error;
    }
  });

export const updateProductAction = modifyProductActionClient
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

    let minPrice = Infinity;
    let maxPrice = -Infinity;

    parsedInput.variants.forEach((variant) => {
      if (variant.price < minPrice) {
        minPrice = variant.price;
      }
      if (variant.price > maxPrice) {
        maxPrice = variant.price;
      }
    });

    const input = {
      ...parsedInput,
      nameNoAccent: removeDiacritics(parsedInput.name),
      category: newCategory,
      variants: newVariants,
      highestDiscount: highestDiscount({ variants: newVariants }),
      minPrice,
      maxPrice,
      tags: newTags,
    };

    await productRepository.updateProduct(input);
    const deletedImages = parsedInput.variants.flatMap(
      (variant) => variant.deletedImages,
    );
    if (deletedImages.length > 0) {
      await deleteFile(deletedImages);
    }

    revalidateTag(CACHE_CONFIG.PRODUCTS.ALL.TAGS[0]);
    revalidateTag(CACHE_CONFIG.TAGS.ALL.TAGS[0]);
  });

export const updateRatingAction = modifyProductActionClient
  .metadata({
    actionName: "updateRating",
  })
  .schema(z.object({ productId: z.string(), rating: z.number() }))
  .action(async ({ parsedInput }) => {
    await productRepository.updateRating(parsedInput);
    revalidateTag(CACHE_CONFIG.PRODUCTS.ALL.TAGS[0]);
  });

export const deleteProductAction = deleteProductActionClient
  .metadata({
    actionName: "deleteProduct",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput }) => {
    const ids = Array.isArray(parsedInput) ? parsedInput : [parsedInput];
    const products = await productRepository.getProductByIds({ ids });
    if (products.length !== ids.length) {
      throw new NotFoundError({
        resource: "product",
        message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
      });
    }
    await productRepository.deleteProduct(parsedInput);

    await deleteFile(
      products.flatMap((product) =>
        product.variants.flatMap((variant) => variant.images),
      ),
    );

    // delete item from cart

    revalidateTag(CACHE_CONFIG.PRODUCTS.ALL.TAGS[0]);
  });

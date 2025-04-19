"use server";

import {
  CategoryInputSchema,
  CategoryUpdateSchema,
} from "./category.validator";
import { revalidateTag } from "next/cache";
import categoriesRepository from "@/lib/db/repositories/categories";
import { getAuthActionClient } from "@/lib/actions";
import { z } from "zod";
import { CACHE_CONFIG } from "@/cache/cache.constant";

const categoriesCacheTag = CACHE_CONFIG.CATEGORIES.ALL.TAGS[0];
const productCacheTag = CACHE_CONFIG.PRODUCTS.ALL.TAGS[0];

const resource = "category";
const createCategoryActionClient = getAuthActionClient({
  resource,
  action: "create",
});

const modifyCategoryActionClient = getAuthActionClient({
  resource,
  action: "modify",
});

const deleteCategoryActionClient = getAuthActionClient({
  resource,
  action: "delete",
});

export const createCategoryAction = createCategoryActionClient
  .metadata({
    actionName: "createCategoryAction",
  })
  .schema(CategoryInputSchema)
  .action(async ({ parsedInput }) => {
    await categoriesRepository.createCategory(parsedInput);
    revalidateTag(categoriesCacheTag);
  });

export const updateCategoryAction = modifyCategoryActionClient
  .metadata({
    actionName: "updateCategoryAction",
  })
  .schema(CategoryUpdateSchema)
  .action(async ({ parsedInput }) => {
    await categoriesRepository.updateCategory(parsedInput);
    revalidateTag(categoriesCacheTag);
    revalidateTag(productCacheTag);
    return parsedInput.id;
  });

export const deleteCategoryAction = deleteCategoryActionClient
  .metadata({
    actionName: "deleteCategoryAction",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput }) => {
    await categoriesRepository.deleteCategory(parsedInput);
    revalidateTag(categoriesCacheTag);
    revalidateTag(productCacheTag);

    return parsedInput;
  });

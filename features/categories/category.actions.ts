"use server";

import {
  CategoryInputSchema,
  CategoryUpdateSchema,
} from "./category.validator";
import { revalidateTag } from "next/cache";
import { CACHE } from "@/constants";
import categoriesRepository from "@/lib/db/repositories/categories";
import { authActionClient } from "@/lib/actions";
import { z } from "zod";

// export const getCategoryByIdAction = actionClient
//   .metadata({
//     actionName: "getCategoryById",
//   })
//   .schema(z.string())
//   .action(async ({ parsedInput }) => {
//     const category = await categoriesRepository.getCategoryById(parsedInput);
//     return category;
//   });
//
// export const getCategoryBySlugAction = authActionClient
//   .metadata({
//     actionName: "getCategoryBySlug",
//   })
//   .schema(z.string())
//   .action(async ({ parsedInput }) => {
//     const category = await categoriesRepository.getCategoryBySlug(parsedInput);
//     console.log(category);
//     return category;
//   });
//
// export const getAllCategoriesAction = actionClient
//   .metadata({
//     actionName: "getAllCategoriesAction",
//   })
//   .action(async () => {
//     const categories = await categoriesRepository.getAllCategories();
//     return categories;
//   });

export const createCategoryAction = authActionClient
  .metadata({
    actionName: "createCategoryAction",
  })
  .schema(CategoryInputSchema)
  .action(async ({ parsedInput }) => {
    await categoriesRepository.createCategory(parsedInput);
    revalidateTag(CACHE.CATEGORIES.ALL.TAGS);
  });

export const updateCategoryAction = authActionClient
  .metadata({
    actionName: "updateCategoryAction",
  })
  .schema(CategoryUpdateSchema)
  .action(async ({ parsedInput }) => {
    await categoriesRepository.updateCategory(parsedInput);
    revalidateTag(CACHE.CATEGORIES.ALL.TAGS);
    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
    return parsedInput.id;
  });

export const deleteCategoryAction = authActionClient
  .metadata({
    actionName: "deleteCategoryAction",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput }) => {
    await categoriesRepository.deleteCategory(parsedInput);
    revalidateTag(CACHE.CATEGORIES.ALL.TAGS);
    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);

    return parsedInput;
  });

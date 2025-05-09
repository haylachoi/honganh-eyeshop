import productRepository from "@/lib/db/repositories/products";
import { safeQuery } from "@/lib/query";
import { z } from "zod";
import { categorySlugSchema } from "./category.validator";
import next_cache from "@/cache";
import { NotFoundError } from "@/lib/error";
import { ERROR_MESSAGES } from "@/constants/messages.constants";

export const getCategoryById = safeQuery
  .schema(z.string().min(3))
  .query(async ({ parsedInput: id }) => {
    const categories = await next_cache.categories.getAll();
    const category = categories.find((category) => category.id === id);

    if (!category) {
      throw new NotFoundError({
        resource: "category",
        message: ERROR_MESSAGES.CATEGORY.NOT_FOUND,
      });
    }

    return category;
  });

export const getCategoryBySlug = safeQuery
  .schema(z.string().min(3))
  .query(async ({ parsedInput: slug }) => {
    const categories = await next_cache.categories.getAll();
    const category = categories.find((category) => category.slug === slug);

    if (!category) {
      throw new NotFoundError({
        resource: "category",
        message: ERROR_MESSAGES.CATEGORY.NOT_FOUND,
      });
    }

    return category;
  });

export const getAllCategories = safeQuery.query(async () => {
  const categories = await next_cache.categories.getAll();
  return categories;
});

export const getProductsByCategorySlug = safeQuery
  .schema(categorySlugSchema)
  .query(async ({ parsedInput: categorySlug }) => {
    const products = await productRepository.getProductByQuery({
      "category.slug": categorySlug,
    });
    return products;
  });

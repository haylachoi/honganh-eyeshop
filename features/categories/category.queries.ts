import categoriesRepository from "@/lib/db/repositories/categories";
import productRepository from "@/lib/db/repositories/products";
import { safeQuery } from "@/lib/query";
import { z } from "zod";
import { categorySlugSchema } from "./category.validator";
import next_cache from "@/cache";

export const getCategoryById = safeQuery
  .schema(z.string().min(3))
  .query(async ({ parsedInput: id }) => {
    const category = await categoriesRepository.getCategoryById(id);
    return category;
  });

export const getCategoryBySlug = safeQuery
  .schema(z.string().min(3))
  .query(async ({ parsedInput: slug }) => {
    const category = await categoriesRepository.getCategoryBySlug(slug);
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

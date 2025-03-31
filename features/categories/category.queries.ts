import categoriesRepository from "@/lib/db/repositories/categories";
import productRepository from "@/lib/db/repositories/products";
import { safeQuery } from "@/lib/query";
import { IdSchema } from "@/lib/validator";
import { z } from "zod";
import { categorySlugSchema } from "./category.validator";

export const getCategoryById = safeQuery
  .schema(z.string().min(3))
  .query(async ({ parsedInput: id }) => {
    const category = await categoriesRepository.getCategoryById(id);
    return category;
  });

export const getAllCategories = safeQuery.query(async () => {
  const categories = await categoriesRepository.getAllCategories();
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

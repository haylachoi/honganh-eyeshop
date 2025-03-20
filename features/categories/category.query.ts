import categoriesRepository from "@/lib/db/repositories/categories";
import { safeQuery } from "@/lib/query";
import { z } from "zod";

export const getCategoryById = safeQuery
  .schema(z.string().min(3))
  .query(async ({ inputParams: id }) => {
    const category = await categoriesRepository.getCategoryById(id);
    return category;
  });

export const getAllCategories = safeQuery.query(async () => {
  const categories = await categoriesRepository.getAllCategories();
  return categories;
});

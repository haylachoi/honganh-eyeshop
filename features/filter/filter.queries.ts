import filtersRepository from "@/lib/db/repositories/filters";
import { customerQueryClient } from "@/lib/query";
import { IdSchema } from "@/lib/validator";
import { categorySlugSchema } from "../categories/category.validator";

export const getFilterByCategoryId = customerQueryClient
  .schema(IdSchema)
  .query(async ({ parsedInput }) => {
    const result = await filtersRepository.getFilterByCategoryId(parsedInput);
    return result;
  });

export const getFilterByCategorySlug = customerQueryClient
  .schema(categorySlugSchema)
  .query(async ({ parsedInput }) => {
    const result = await filtersRepository.getFilterByCategorySlug(parsedInput);
    return result;
  });

export const getAllFilters = customerQueryClient.query(async () => {
  const result = await filtersRepository.getAllFilters();
  return result;
});

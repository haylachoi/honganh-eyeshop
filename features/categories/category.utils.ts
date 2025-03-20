import { ERROR_MESSAGES } from "@/constants";
import categoriesRepository from "@/lib/db/repositories/categories";
import { AppError } from "@/types";

export const getCategoryInfoById = async (id: string) => {
  const category = await categoriesRepository.getCategoryById(id);
  if (!category) {
    throw new AppError({
      message: ERROR_MESSAGES.NOT_FOUND.ID.SINGLE,
    });
  }
  return {
    _id: category.id,
    name: category.name,
    slug: category.slug,
  };
};

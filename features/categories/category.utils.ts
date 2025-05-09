import { ERROR_MESSAGES } from "@/constants/messages.constants";
import categoriesRepository from "@/lib/db/repositories/categories";
import { NotFoundError } from "@/lib/error";

export const getCategoryInfoById = async (id: string) => {
  const category = await categoriesRepository.getCategoryById(id);
  if (!category) {
    throw new NotFoundError({
      resource: "category",
      message: ERROR_MESSAGES.CATEGORY.NOT_FOUND,
    });
  }
  return {
    _id: category.id,
    name: category.name,
    slug: category.slug,
  };
};

import blogsRepository from "@/lib/db/repositories/blogs";

import {
  createProductQueryFilter,
  createSearchQuery,
  createSortingQuery,
} from "./filter.queries-builder";
import productRepository from "@/lib/db/repositories/products";
import { removeDiacritics } from "@/lib/utils";

// first page is 1
export const searchProducts = async ({
  page,
  size,
  sortBy,
  orderBy,
  search,
  filter,
}: {
  page: number;
  size: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
  filter?: Record<string, string>;
}) => {
  const searchQuery = createSearchQuery({ search });

  const filterQuery = createProductQueryFilter({
    input: filter,
    includePrivateProduct: false,
  });

  const sortOptions = createSortingQuery({ sortBy, orderBy });

  const result = await productRepository.searchProductByQuery({
    search: searchQuery,
    filter: filterQuery,
    sortOptions,
    limit: size,
    skip: (page - 1) * size,
  });

  return {
    items: result.products,
    total: result.total,
    page,
    size,
  };
};

export const searchBlogs = async ({
  search,
  size,
  page,
}: {
  search?: string;
  page: number;
  size: number;
}) => {
  const result = await blogsRepository.searchBlogAndSimpleReturnByQuery({
    search: search
      ? {
          titleNoAccent: { $regex: removeDiacritics(search), $options: "i" },
          isPublished: true,
        }
      : {},
    skip: (page - 1) * size,
    limit: size,
  });

  return {
    items: result.result,
    total: result.total,
    page: page,
    size,
  };
};

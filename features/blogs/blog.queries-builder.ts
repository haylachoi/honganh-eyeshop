import { FilterQuery } from "mongoose";
import { BlogType } from "./blog.types";
import {
  BLOG_FILTER_NAMES,
  BLOG_SORT_BY_VALUES,
  BLOG_SORTING_OPTIONS,
} from "./blog.contants";
import { SORTING_KEYWORDS } from "@/constants";
import { isValidEnumValue } from "@/lib/utils";

export const createBlogQueryFilter = ({
  input,
}: {
  input?: Record<string, string>;
}): FilterQuery<BlogType> => {
  if (!input) return {};
  const conditions: FilterQuery<BlogType>[] = [];
  const {
    [BLOG_FILTER_NAMES.TAGS]: tagsFilter,
    [BLOG_FILTER_NAMES.ISPUBLISHED]: isPublishedFilter,
  } = input;

  if (isPublishedFilter) {
    conditions.push({
      isPublished: true,
    });
  }

  if (tagsFilter) {
    conditions.push({
      tags: { $in: tagsFilter.split(",") },
    });
  }

  const query: FilterQuery<BlogType> = conditions.length
    ? { $and: conditions }
    : {};

  return query;
};

export const createBlogSortingOptions = ({
  sortBy,
  orderBy,
}: {
  sortBy?: string;
  orderBy?: string;
}): Record<string, 1 | -1> | undefined => {
  if (
    !sortBy ||
    !orderBy ||
    !isValidEnumValue(sortBy, BLOG_SORT_BY_VALUES) ||
    !isValidEnumValue(orderBy, [SORTING_KEYWORDS.asc, SORTING_KEYWORDS.desc])
  ) {
    return { [BLOG_SORTING_OPTIONS.SORT_BY.UPDATEDAT]: -1 };
  }

  return {
    [sortBy]: orderBy === SORTING_KEYWORDS.asc ? 1 : -1,
  };
};

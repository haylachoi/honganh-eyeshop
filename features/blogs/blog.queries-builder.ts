import { FilterQuery } from "mongoose";
import { BlogType } from "./blog.types";
import {
  BLOG_FILTER_NAMES,
  BLOG_ORDER_BY_VALUES,
  BLOG_SORTING_OPTIONS,
} from "./blog.contants";
import { SORT_BY_OPTIONS, SORT_BY_VALUES } from "@/constants";
import { isValidEnumValue } from "@/lib/utils";

export const createBlogQueryFilter = ({
  input,
}: {
  input?: Record<string, string>;
}): FilterQuery<BlogType> => {
  if (!input) return {};
  const conditions: FilterQuery<BlogType>[] = [
    {
      isPublished: true,
    },
  ];

  const { [BLOG_FILTER_NAMES.TAGS]: tagsFilter } = input;

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
    !isValidEnumValue(orderBy, BLOG_ORDER_BY_VALUES) ||
    !isValidEnumValue(sortBy, SORT_BY_VALUES)
  ) {
    return { [BLOG_SORTING_OPTIONS.ORDER_BY.UPDATEDAT]: -1 };
  }

  return {
    [orderBy]: sortBy === SORT_BY_OPTIONS.ASC ? 1 : -1,
  };
};

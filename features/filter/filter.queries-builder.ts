import { FilterQuery } from "mongoose";
import { ProductType } from "../products/product.types";
import { normalizeSearchParams, removeDiacritics } from "@/lib/utils";
import {
  DEFAULT_SORTING,
  FILTER_KEYWORDS,
  SORTING_KEYWORDS,
} from "@/constants";

export const createSearchQuery = ({ search }: { search?: string }) => {
  if (!search) return {};

  return {
    nameNoAccent: { $regex: removeDiacritics(search), $options: "i" },
  };
};

export const createProductQueryFilter = ({
  input,
  includePrivateProduct,
}: {
  input?: Record<string, string>;
  includePrivateProduct: boolean;
}) => {
  const conditions: FilterQuery<ProductType>[] = [];

  if (!includePrivateProduct) {
    conditions.push({
      isPublished: true,
    });
  }

  if (!input) return conditions[0];

  const {
    [FILTER_KEYWORDS.category]: categoryFilter,
    [FILTER_KEYWORDS.price]: priceFilters,
    [FILTER_KEYWORDS.search]: searchFilter,
    [FILTER_KEYWORDS.tag]: tagFilter,
    [FILTER_KEYWORDS.sale]: saleFilter,
    ...attrFilters
  } = input;

  for (const [name, values] of Object.entries(
    normalizeSearchParams(attrFilters),
  )) {
    conditions.push({
      attributes: {
        $elemMatch: {
          name,
          valueSlug: { $in: values },
        },
      },
    });
  }

  if (categoryFilter) {
    conditions.push({
      "category.slug": {
        $in: categoryFilter.split(","),
      },
    });
  }

  if (searchFilter) {
    conditions.push({
      nameNoAccent: { $regex: searchFilter, $options: "i" },
    });
  }

  if (tagFilter) {
    conditions.push({
      "tags.name": { $in: tagFilter.split(",") },
    });
  }

  if (saleFilter) {
    conditions.push({
      highestDiscount: { $gt: 0 },
    });
  }

  if (priceFilters) {
    const localFilter: FilterQuery<ProductType>[] = [];
    priceFilters.split(",").forEach((pfilter) => {
      const [min, rawMax] = pfilter.split("-").map(Number);
      const max = rawMax === 0 ? 10_000_000 : rawMax;
      localFilter.push({
        variants: {
          $elemMatch: {
            ...(isNaN(min) ? {} : { price: { $gte: min } }),
            ...(isNaN(max)
              ? {}
              : {
                  price: { ...(!isNaN(min) ? { $gte: min } : {}), $lte: max },
                }),
          },
        },
      });
    });

    conditions.push({
      $or: localFilter,
    });
  }

  const query: FilterQuery<ProductType> = conditions.length
    ? { $and: conditions }
    : {};

  return query;
};

export const createSortingQuery = ({
  sortBy,
  orderBy,
}: {
  sortBy?: string;
  orderBy?: string;
}): Record<string, 1 | -1> | undefined => {
  if (
    !sortBy ||
    !orderBy ||
    ![SORTING_KEYWORDS.name, SORTING_KEYWORDS.price].includes(sortBy) ||
    ![SORTING_KEYWORDS.asc, SORTING_KEYWORDS.desc].includes(orderBy)
  ) {
    return {
      [DEFAULT_SORTING.products[SORTING_KEYWORDS.sort_by]]:
        DEFAULT_SORTING.products[SORTING_KEYWORDS.order_by] ===
        SORTING_KEYWORDS.asc
          ? 1
          : -1,
    };
  }

  return {
    [sortBy]: orderBy === SORTING_KEYWORDS.asc ? 1 : -1,
  };
};

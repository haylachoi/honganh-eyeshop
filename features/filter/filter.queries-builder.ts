import { FilterQuery } from "mongoose";
import { ProductType } from "../products/product.types";
import { normalizeSearchParams } from "@/lib/utils";
import { FILTER_NAME } from "./filter.constants";

export const createProductQueryFilter = ({
  input,
  includePrivateProduct,
}: {
  input: Record<string, string>;
  includePrivateProduct: boolean;
}) => {
  const conditions: FilterQuery<ProductType>[] = [];

  if (!includePrivateProduct) {
    conditions.push({
      isPublished: true,
    });
  }

  const {
    [FILTER_NAME.CATEGORY]: categoryFilter,
    [FILTER_NAME.PRICE]: priceFilters,
    [FILTER_NAME.SEARCH]: searchFilter,
    [FILTER_NAME.TAG]: tagFilter,
    [FILTER_NAME.SALE]: saleFilter,
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

  console.log(JSON.stringify(query, null, 2));
  return query;
};

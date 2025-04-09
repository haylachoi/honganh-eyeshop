import { FilterQuery } from "mongoose";
import { ProductType } from "../products/product.types";
import { FILTER_NAME } from "@/constants";
import { normalizeSearchParams } from "./filter.utils";

export const createProductQueryFilter = ({
  input,
}: {
  input: Record<string, string>;
}) => {
  const andConditions: FilterQuery<ProductType>[] = [];
  const {
    [FILTER_NAME.CATEGORY]: categoryFilter,
    [FILTER_NAME.PRICE]: priceFilter,
    [FILTER_NAME.SEARCH]: searchFilter,
    ...attrFilters
  } = input;

  for (const [name, values] of Object.entries(
    normalizeSearchParams(attrFilters),
  )) {
    andConditions.push({
      attributes: {
        $elemMatch: {
          name,
          valueSlug: { $in: values },
        },
      },
    });
  }

  if (categoryFilter) {
    andConditions.push({ "category.slug": categoryFilter });
  }

  if (searchFilter) {
    console.log(searchFilter);
    andConditions.push({
      nameNoAccent: { $regex: searchFilter, $options: "i" },
    });
  }

  if (priceFilter?.[0]) {
    const [min, rawMax] = priceFilter.split("-").map(Number);
    const max = rawMax === 0 ? 10_000_000 : rawMax;

    andConditions.push({
      $and: [{ maxPrice: { $gte: min } }, { minPrice: { $lte: max } }],
    });
  }

  const query: FilterQuery<ProductType> = andConditions.length
    ? { $and: andConditions }
    : {};

  return query;
};

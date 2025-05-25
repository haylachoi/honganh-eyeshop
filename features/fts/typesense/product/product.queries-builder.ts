import { KEYWORDS } from "@/constants";

const buildTypesenseAttFilter = (attrFilters: Record<string, string>): string =>
  Object.entries(attrFilters)
    .map(([key, valueStr]) =>
      valueStr
        .split(",")
        .map((v) => `(attributes.name:${key} && attributes.value:${v.trim()})`)
        .join(" || "),
    )
    .map((group) => `(${group})`)
    .join(" && ");

const buildInFilter = (field: string, raw?: string): string | undefined => {
  if (!raw) return;
  const values = raw
    .split(",")
    .map((v) => v.trim())
    .join(",");
  return `(${field}:=[${values}])`;
};

const buildTypesenseTagsFilter = (tagFilter?: string) => {
  return buildInFilter("tags.name", tagFilter);
};

const buildTypesenseCategoryFilter = (categoryFilter?: string) => {
  return buildInFilter("category.slug", categoryFilter);
};

const buildTypesensePriceFilter = (range?: string): string | undefined => {
  if (!range) return;
  const [min, max] = range.split("-");
  return `(prices:[${min}..${max}])`;
};

const buildTypesenseSaleFilter = (sale?: string): string | undefined =>
  sale === "1" ? `(highestDiscount:>0)` : undefined;

export const buildTypesenseQuery = ({
  filter,
}: {
  filter?: Record<string, string>;
}) => {
  if (!filter) return;

  const {
    [KEYWORDS.filter.category]: category,
    [KEYWORDS.filter.price]: price,
    [KEYWORDS.filter.tag]: tag,
    [KEYWORDS.filter.sale]: sale,
    ...attrs
  } = filter;

  const filters = [
    buildTypesenseAttFilter(attrs),
    buildTypesenseTagsFilter(tag),
    buildTypesenseCategoryFilter(category),
    buildTypesensePriceFilter(price),
    buildTypesenseSaleFilter(sale),
  ].filter(Boolean);

  return filters.join(" && ");
};

export const buildTypesenseSorting = ({
  sortBy,
  orderBy,
}: {
  sortBy: string | undefined;
  orderBy: string | undefined;
}): string | undefined => {
  if (!sortBy || !orderBy) return;
  return `${sortBy}:${orderBy === KEYWORDS.sorting.asc ? "asc" : "desc"}`;
};

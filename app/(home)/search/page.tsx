import FilterView from "@/components/shared/filter";
import ProductsView from "@/components/shared/view/products-view";
import { getAllCategories } from "@/features/categories/category.queries";
import { getAllFilters } from "@/features/filter/filter.queries";
import { currencyFormatter } from "@/lib/utils";
import { Suspense } from "react";

const SearchPage = async () => {
  // todo: css for mobile screen
  return (
    <div className="container lg:grid grid-cols-[300px_1fr] gap-4">
      <Suspense fallback={<div>Loading...</div>}>
        <FilterProvider />
      </Suspense>
      <ProductsView />
    </div>
  );
};

export default SearchPage;

const FilterProvider = async () => {
  const attrFilterResult = await getAllFilters();
  const categoryFilterResult = await getAllCategories();
  if (!attrFilterResult.success || !categoryFilterResult.success) {
    return <div>Error</div>;
  }
  const filter = attrFilterResult.data;
  filter.push({
    name: "category",
    values: categoryFilterResult.data.map((c) => ({
      value: c.name,
      valueSlug: c.slug,
    })),
  });

  filter.push({
    name: "price",
    values: [
      {
        value: `< ${currencyFormatter.format(100_000)}`,
        valueSlug: "0-100000",
      },
      {
        value: `${currencyFormatter.format(100_000)} - ${currencyFormatter.format(500_000)}`,
        valueSlug: "100000-500000",
      },
      {
        value: `> ${currencyFormatter.format(500_000)}`,
        valueSlug: "500000-0",
      },
    ],
  });
  return <FilterView attributes={filter} />;
};

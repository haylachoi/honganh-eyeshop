import FilterView from "@/components/shared/filter";
import ProductsView from "@/components/shared/view/products-view";
import { FILTER_NAME } from "@/constants";
import { getAllCategories } from "@/features/categories/category.queries";
import { getAllFilters } from "@/features/filter/filter.queries";
import { getPriceFilterOptions } from "@/features/filter/filter.utils";

export async function generateStaticParams() {
  return [];
}
export const dynamic = "force-static";

export const revalidate = 3600;

const SearchPage = async () => {
  // todo: css for mobile screen
  return (
    <div className="container lg:grid grid-cols-[300px_1fr] gap-4 items-start">
      <FilterProvider />
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
    name: FILTER_NAME.CATEGORY,
    values: categoryFilterResult.data.map((c) => ({
      value: c.name,
      valueSlug: c.slug,
    })),
  });

  filter.push(getPriceFilterOptions());
  return <FilterView attributes={filter} />;
};

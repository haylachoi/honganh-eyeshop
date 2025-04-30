import FilterView from "@/components/shared/filter";
import ProductsView from "@/components/shared/view/products-view";
import { FILTER_NAME } from "@/constants";
import { getAllCategories } from "@/features/categories/category.queries";
import { getAllFilters } from "@/features/filter/filter.queries";
import { FilterGroupType } from "@/features/filter/filter.types";
import { getPriceFilterOptions } from "@/features/filter/filter.utils";
import { getAllTags } from "@/features/tags/tag.queries";

export async function generateStaticParams() {
  return [];
}
export const dynamic = "force-static";

export const revalidate = 3600;

const SearchPage = async () => {
  return (
    <div className="container lg:grid grid-cols-[300px_1fr] gap-4 items-start">
      <FilterProvider />
      <ProductsView />
    </div>
  );
};

export default SearchPage;

const FilterProvider = async () => {
  const [attrRes, categoryRes, tagRes] = await Promise.all([
    getAllFilters(),
    getAllCategories(),
    getAllTags(),
  ]);

  if (!attrRes.success || !categoryRes.success || !tagRes.success) {
    return <div>Error</div>;
  }

  const categoryFilter: FilterGroupType = {
    name: FILTER_NAME.CATEGORY,
    displayName: "Danh mục",
    values: categoryRes.data.map((c) => ({
      value: c.name,
      valueSlug: c.slug,
    })),
  };

  const tagFilter: FilterGroupType = {
    name: FILTER_NAME.TAG,
    displayName: FILTER_NAME.TAG,
    values: tagRes.data.map((t) => ({
      value: t.name,
      valueSlug: t.name,
    })),
  };

  console.log(categoryFilter);

  const attributes = [
    ...attrRes.data,
    categoryFilter,
    tagFilter,
    getPriceFilterOptions(),
  ];

  return <FilterView attributes={attributes} />;
};

import FilterView from "@/components/shared/filter";
import ProductsView from "@/components/shared/view/products-view";
import { FILTER_NAME } from "@/constants";
import { getAllCategories } from "@/features/categories/category.queries";
import { getAllFilters } from "@/features/filter/filter.queries";
import { getPriceFilterOptions } from "@/features/filter/filter.utils";
import { getAllTags } from "@/features/tags/tag.queries";

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
  const [attrRes, categoryRes, tagRes] = await Promise.all([
    getAllFilters(),
    getAllCategories(),
    getAllTags(),
  ]);

  if (!attrRes.success || !categoryRes.success || !tagRes.success) {
    return <div>Error</div>;
  }

  const categoryFilter = {
    name: FILTER_NAME.CATEGORY,
    values: categoryRes.data.map((c) => ({
      value: c.name,
      valueSlug: c.slug,
    })),
  };

  const tagFilter = {
    name: FILTER_NAME.TAG,
    values: tagRes.data.map((t) => ({
      value: t.name,
      valueSlug: t.name,
    })),
  };

  const attributes = [
    ...attrRes.data,
    categoryFilter,
    tagFilter,
    getPriceFilterOptions(),
  ];

  return <FilterView attributes={attributes} />;
};

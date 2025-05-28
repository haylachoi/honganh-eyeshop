import FilterView from "@/components/shared/filter";
import ProductsView from "@/components/shared/view/products-views";
import { FILTER_KEYWORDS, PAGE_SIZE } from "@/constants";
import { getAllCategories } from "@/features/categories/category.queries";
import {
  getGlobalFilters,
  searchProductByQuery,
} from "@/features/filter/filter.queries";
import { FilterGroupType } from "@/features/filter/filter.types";
import {
  getPriceFilterOptions,
  getSaleFilterOptions,
} from "@/features/filter/filter.utils";
import { getAllTags } from "@/features/tags/tag.queries";
import { DEFAULT_SERVER_ERROR_MESSAGE } from "@/lib/error";

export async function generateStaticParams() {
  return [];
}
export const dynamic = "force-static";

export const revalidate = 3600;

const SearchPage = async () => {
  return (
    <div className="container lg:grid grid-cols-[300px_1fr] gap-4 items-start">
      <FilterProvider />
      <ProductProvider />
    </div>
  );
};

export default SearchPage;

const ProductProvider = async () => {
  const size = PAGE_SIZE.DEFAULT;
  const result = await searchProductByQuery({
    params: {},
    size,
    page: 1,
  });
  const products = result.success ? result.data.items : [];
  const total = result.success ? result.data.total : 0;

  return (
    <ProductsView
      defaultProductsInfoWhenNoParams={{
        page: 1,
        items: products,
        size,
        total,
      }}
    />
  );
};

const FilterProvider = async () => {
  const [attrRes, categoryRes, tagRes] = await Promise.all([
    getGlobalFilters(),
    getAllCategories(),
    getAllTags(),
  ]);

  if (!attrRes.success || !categoryRes.success || !tagRes.success) {
    throw new Error(DEFAULT_SERVER_ERROR_MESSAGE);
  }

  const categoryFilter: FilterGroupType = {
    name: FILTER_KEYWORDS.category,
    displayName: "Danh mục",
    values: categoryRes.data.map((c) => ({
      value: c.name,
      valueSlug: c.slug,
    })),
  };

  const tagFilter: FilterGroupType = {
    name: FILTER_KEYWORDS.tag,
    displayName: FILTER_KEYWORDS.tag,
    values: tagRes.data.map((t) => ({
      value: t.name,
      valueSlug: t.name,
    })),
  };

  const attributes = [
    getSaleFilterOptions(),
    ...attrRes.data,
    categoryFilter,
    tagFilter,
    getPriceFilterOptions(),
  ];

  return <FilterView attributes={attributes} />;
};

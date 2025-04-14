import FilterView from "@/components/shared/filter";
import ProductsView from "@/components/shared/view/products-view";
import {
  getFilterByCategorySlug,
  searchProductByQuery,
} from "@/features/filter/filter.queries";
import { getPriceFilterOptions } from "@/features/filter/filter.utils";

export async function generateStaticParams() {
  return [];
}
export const dynamic = "force-static";
export const revalidate = 3600;

type Params = { categorySlug: string };

const CategoryPage = async (props: { params: Promise<Params> }) => {
  const { categorySlug } = await props.params;

  // todo: add title
  return (
    <div className="container lg:grid grid-cols-[300px_1fr] gap-4 items-start">
      <FilterProvider categorySlug={categorySlug} />
      <ProductProvider categorySlug={categorySlug} />
    </div>
  );
};

export default CategoryPage;

const ProductProvider = async ({ categorySlug }: { categorySlug: string }) => {
  const result = await searchProductByQuery({
    params: { category: categorySlug },
  });
  const products = result.success ? result.data.products : [];
  const total = result.success ? result.data.total : 0;

  return (
    <ProductsView
      defaultFilter={{ category: categorySlug }}
      defaultProductsInfo={{
        page: 0,
        products,
        total,
      }}
    />
  );
};

const FilterProvider = async ({ categorySlug }: { categorySlug: string }) => {
  const result = await getFilterByCategorySlug(categorySlug);
  if (!result.success) {
    return <div>Error</div>;
  }
  const filter = result.data;

  filter.push(getPriceFilterOptions());

  return <FilterView attributes={filter} />;
};

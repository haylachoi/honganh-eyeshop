import FilterView from "@/components/shared/filter";
import ProductsView from "@/components/shared/view/products-view";
import { getFilterByCategorySlug } from "@/features/filter/filter.queries";
import { getPriceFilterOptions } from "@/features/filter/filter.utils";
import { Suspense } from "react";

type Params = { categorySlug: string };

const CategoryPage = async (props: { params: Promise<Params> }) => {
  const { categorySlug } = await props.params;

  return (
    <div className="container lg:grid grid-cols-[300px_1fr] gap-4">
      <Suspense fallback={<div>Loading...</div>}>
        <FilterProvider categorySlug={categorySlug} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductProvider categorySlug={categorySlug} />
      </Suspense>
    </div>
  );
};

export default CategoryPage;

const ProductProvider = async ({ categorySlug }: { categorySlug: string }) => {
  return <ProductsView defaultFilter={{ category: categorySlug }} />;
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

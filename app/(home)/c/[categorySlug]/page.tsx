import FilterView from "@/components/shared/filter";
import ProductsView from "@/components/shared/view/products-view";
import { getCategoryBySlug } from "@/features/categories/category.queries";
import {
  getFilterByCategorySlug,
  searchProductByQuery,
} from "@/features/filter/filter.queries";
import { getPriceFilterOptions } from "@/features/filter/filter.utils";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return [];
}
export const dynamic = "force-static";
export const revalidate = 3600;

type Params = { categorySlug: string };

const CategoryPage = async (props: { params: Promise<Params> }) => {
  const { categorySlug } = await props.params;
  const categoryResult = await getCategoryBySlug(categorySlug);
  if (!categoryResult.success) {
    return notFound();
  }
  const category = categoryResult.data;

  return (
    <div className="space-y-12">
      <div className="w-full relative isolate overflow-hidden py-12">
        {/* Background split */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: "url('/category-wallpaper.webp')",
          }}
        >
          {/* Overlay chỉ bên trái */}
          <div className="w-full h-full bg-primary/95 clip-left" />
        </div>

        {/* Hero Content */}
        <div className="container flex items-center justify-center sm:items-start flex-col h-[300px] text-white">
          <h1 className="text-4xl font-semibold uppercase tracking-tight">
            {category.name}
          </h1>
          <div className="mt-4 h-1 w-16 bg-primary rounded-full" />
          <p className="mt-2 max-w-sm text-muted">{category.description}</p>
        </div>
      </div>

      <div className="container lg:grid grid-cols-[300px_1fr] gap-4 items-start">
        <FilterProvider categorySlug={categorySlug} />
        <ProductProvider categorySlug={categorySlug} />
      </div>
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

import ProductsView from "@/components/shared/view/products-view";
import { getProductsByCategorySlug } from "@/features/categories/category.queries";

type Params = Promise<{ categorySlug: string }>;
const CategoryPage = async ({ params: parmas }: { params: Params }) => {
  const { categorySlug } = await parmas;
  const result = await getProductsByCategorySlug(categorySlug);
  if (!result.success) {
    return <div>Error</div>;
  }
  const products = result.data;

  return (
    <div className="container">
      <ProductsView products={products} />
    </div>
  );
};

export default CategoryPage;

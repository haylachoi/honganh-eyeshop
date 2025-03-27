import { getProductById } from "@/features/products/product.query";
import ProductUpdateForm from "./product-form.update";
import { getAllCategories } from "@/features/categories/category.query";
import { getAllTags } from "@/features/tags/tag.query";

type Params = Promise<{ productId: string }>;

const UpdateProductPage = async ({ params }: { params: Params }) => {
  const { productId } = await params;
  const [productResult, categoriesResult, tagsResult] = await Promise.all([
    getProductById(productId),
    getAllCategories(),
    getAllTags(),
  ]);

  if (
    !productResult.success ||
    !categoriesResult.success ||
    !tagsResult.success
  ) {
    return <div>Error</div>;
  }

  const product = productResult.data;
  const categories = categoriesResult.data;
  const tags = tagsResult.data;

  return <ProductUpdateForm {...{ product, categories, tags }} />;
};

export default UpdateProductPage;

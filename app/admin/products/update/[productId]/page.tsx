import { getProductById } from "@/features/products/product.queries";
import ProductUpdateForm from "./product-form.update";
import { getAllCategories } from "@/features/categories/category.queries";
import { getAllTags } from "@/features/tags/tag.queries";

type Params = Promise<{ productId: string }>;

const UpdateProductPage = async ({ params }: { params: Params }) => {
  const { productId } = await params;
  const [productResult, categoriesResult, tagsResult] = await Promise.all([
    getProductById({ id: productId, includePrivateProduct: true }),
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

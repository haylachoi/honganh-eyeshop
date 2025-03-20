import ProductView from "@/app/(home)/c/[categorySlug]/[productSlug]/_components/product-view";
import { getProductBySlug } from "@/features/products/product.query";

type Params = Promise<{ categorySlug: string; productSlug: string }>;
const ProductPage = async ({ params }: { params: Params }) => {
  const { categorySlug, productSlug } = await params;
  const result = await getProductBySlug({ categorySlug, productSlug });

  if (!result.success) {
    return <div>Sản phẩm không tồn tại</div>;
  }

  const product = result.data;

  return <ProductView product={product} />;
};

export default ProductPage;

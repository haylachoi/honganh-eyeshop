import ProductView from "@/app/(home)/c/[categorySlug]/[productSlug]/_components/product-view";
import { getProductBySlug } from "@/features/products/product.query";
import { getReviewsWithUserNameByProductId } from "@/features/reviews/review.queries";

// todo: generate metadata

export async function generateStaticParams() {
  return [];
}
export const dynamic = "force-static";

export const revalidate = 3600;

type Params = Promise<{ categorySlug: string; productSlug: string }>;
const ProductPage = async ({ params }: { params: Params }) => {
  const { categorySlug, productSlug } = await params;
  const result = await getProductBySlug({ categorySlug, productSlug });

  if (!result.success) {
    return <div>Sản phẩm không tồn tại</div>;
  }

  const product = result.data;
  const reviewsPromise = getReviewsWithUserNameByProductId(product.id);

  return (
    <div className="container">
      <ProductView product={product} reviewsPromise={reviewsPromise} />
    </div>
  );
};

export default ProductPage;

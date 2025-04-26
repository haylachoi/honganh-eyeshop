import ProductView from "@/app/(home)/c/[categorySlug]/[productSlug]/_components/product-view";
import { getProductBySlug } from "@/features/products/product.queries";
import { getReviewsWithUserNameByProductId } from "@/features/reviews/review.queries";
import { Id } from "@/types";
import { ReviewsView } from "./_components/reviews-view";
import { Suspense } from "react";
import { ReviewForm } from "./_components/review-form";

type Params = Promise<{ categorySlug: string; productSlug: string }>;
const ProductPage = async ({ params }: { params: Params }) => {
  const { categorySlug, productSlug } = await params;
  const result = await getProductBySlug({ categorySlug, productSlug });

  if (!result.success) {
    return <div>Sản phẩm không tồn tại</div>;
  }

  const product = result.data;

  return (
    <div className="container">
      <ProductView product={product} />
      <ReviewForm productId={product.id} />
      <Suspense fallback={<div>Loading...</div>}>
        <ReviewsProvider productId={product.id} />
      </Suspense>
    </div>
  );
};

export default ProductPage;

const ReviewsProvider = async ({ productId }: { productId: Id }) => {
  const reviewsResult = await getReviewsWithUserNameByProductId(productId);
  if (!reviewsResult.success) {
    return null;
  }
  const reviews = reviewsResult.data;
  return (
    <div className="py-8 bg-secondary fluid-container">
      <ReviewsView reviews={reviews} />
    </div>
  );
};

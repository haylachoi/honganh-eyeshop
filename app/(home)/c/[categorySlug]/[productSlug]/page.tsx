import ProductView from "@/app/(home)/c/[categorySlug]/[productSlug]/_components/product-view";
import { getProductBySlug } from "@/features/products/product.queries";
import { getReviewsWithUserNameByProductId } from "@/features/reviews/review.queries";
import { Id } from "@/types";
import { ReviewsView } from "./_components/reviews-view";
import { cache, Suspense } from "react";
import { ReviewForm } from "./_components/review-form";
import { ViewCount } from "./_components/view-count";
import { notFound } from "next/navigation";
import { getFullLink } from "@/lib/utils";
import { PRICE_CURRENCY } from "@/constants";

const getProduct = cache(
  async ({
    categorySlug,
    productSlug,
  }: {
    categorySlug: string;
    productSlug: string;
  }) => {
    const result = await getProductBySlug({ categorySlug, productSlug });
    if (!result.success) {
      notFound();
    }
    const product = result.data;
    return product;
  },
);

type Params = Promise<{ categorySlug: string; productSlug: string }>;

export const generateMetadata = async ({ params }: { params: Params }) => {
  const { categorySlug, productSlug } = await params;
  const product = await getProduct({ categorySlug, productSlug });

  return {
    title: product.name,
    description: product.description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      images: [
        {
          url: product.variants?.[0].images?.[0],
          width: 400,
          height: 200,
          alt: product.name,
        },
      ],
    },
  };
};

const ProductPage = async ({ params }: { params: Params }) => {
  const { categorySlug, productSlug } = await params;

  const product = await getProduct({ categorySlug, productSlug });

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: getFullLink(product.variants?.[0].images?.[0]),
    offers: {
      "@type": "AggregateOffer",
      availability: product.variants.some((variant) => variant.countInStock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      //ISO 4217
      priceCurrency: PRICE_CURRENCY,
      highPrice: product.maxPrice,
      lowPrice: product.minPrice,
    },
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <ViewCount />
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

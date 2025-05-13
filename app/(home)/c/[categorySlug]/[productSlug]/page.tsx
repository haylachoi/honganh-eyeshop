import ProductView from "@/app/(home)/c/[categorySlug]/[productSlug]/_components/product-view";
import {
  getProductBySlug,
  getPublishedProductsForEachCategory,
} from "@/features/products/product.queries";
import { getReviewsWithUserNameByProductId } from "@/features/reviews/review.queries";
import { Id } from "@/types";
import { ReviewsView } from "./_components/reviews-view";
import { cache, Suspense } from "react";
import { ReviewForm } from "./_components/review-form";
import { ViewCount } from "./_components/view-count";
import { notFound } from "next/navigation";
import { getFullLink, getLink } from "@/lib/utils";
import { APP_NAME, PRICE_CURRENCY } from "@/constants";
import { ProductType } from "@/features/products/product.types";
import { RelatedProductsView } from "./_components/related-products";

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
    description:
      product.description ??
      "Sản phẩm chất lượng, giá cả hợp lý, phù hợp với mọi nhu cầu.",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      locale: "vi_VN",
      type: "website",
      siteName: APP_NAME,
      url: getFullLink(getLink.product.home({ categorySlug, productSlug })),
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
    description:
      product.description ??
      "Sản phẩm chất lượng, giá cả hợp lý, phù hợp với mọi nhu cầu.",
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

      <Suspense fallback={<div>Loading...</div>}>
        <RelatedProductsProvider product={product} />
      </Suspense>
    </div>
  );
};

export default ProductPage;

const RelatedProductsProvider = async ({
  product,
}: {
  product: ProductType;
}) => {
  const categoryWithProducts = await getPublishedProductsForEachCategory();
  if (!categoryWithProducts.success) {
    return null;
  }
  const categoryWithProductsResult = categoryWithProducts.data;

  const relatedProducts = categoryWithProductsResult.find(
    (category) => category.id === product.category.id,
  );

  if (!relatedProducts) {
    return null;
  }

  return <RelatedProductsView products={relatedProducts.products} />;
};

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

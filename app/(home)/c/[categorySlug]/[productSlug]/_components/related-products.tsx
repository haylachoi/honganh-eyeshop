"use client";

import { CarouselList } from "@/components/shared/carousel-list";
import { PreviewCard } from "@/components/shared/product-preview-card";
import { ProductType } from "@/features/products/product.types";

export const RelatedProductsView = ({
  products,
}: {
  products: ProductType[];
}) => {
  return (
    <div className="container py-4">
      <h3 className="text-2xl font-semibold mb-4 border-b-6 border-primary/60 inline-block">
        Sản phẩm liên quan
      </h3>

      <CarouselList
        items={products}
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        render={(product) => <PreviewCard product={product} />}
        // isDotButtonVisible={{ desktop: true, mobile: false }}
      />
    </div>
  );
};

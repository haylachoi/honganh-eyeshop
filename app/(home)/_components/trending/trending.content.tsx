"use client";

import React from "react";
import { ProductPreview } from "@/features/products/product.types";
import { CarouselProducts } from "@/components/shared/carousel-products";
import { PreviewCard } from "@/components/shared/product-preview-card";

const TrendingContent = ({
  className,
  products,
}: {
  className?: string;
  products: ProductPreview[];
}) => {
  return (
    // toto: fix mobile screen with no carousel
    <CarouselProducts
      products={products}
      className={className}
      render={(product) => <PreviewCard product={product} />}
    />
  );
};

export default TrendingContent;

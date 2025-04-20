"use client";

import React from "react";
import { ProductPreview } from "@/features/products/product.types";
import { ProductsContainer } from "../products-container";

const TrendingContent = ({
  className,
  products,
}: {
  className?: string;
  products: ProductPreview[];
}) => {
  return <ProductsContainer products={products} className={className} />;
};

export default TrendingContent;

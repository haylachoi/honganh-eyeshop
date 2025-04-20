"use client";

import React from "react";
import { ProductPreview } from "@/features/products/product.types";
import { ProductsContainer } from "../products-container";

export const ArrivalContent = ({
  className,
  products,
}: {
  className?: string;
  products: ProductPreview[];
}) => {
  return <ProductsContainer products={products} className={className} />;
};

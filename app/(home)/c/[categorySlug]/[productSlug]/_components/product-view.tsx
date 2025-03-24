"use client";

import { ProductType } from "@/features/products/product.types";
import TopSection from "./top-section";
import MiddleSection from "./middle-section";

const ProductView = ({ product }: { product: ProductType }) => {
  return (
    <div className="space-y-10">
      <TopSection product={product} />
      <MiddleSection product={product} />
    </div>
  );
};

export default ProductView;

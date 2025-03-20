"use client";

import { ProductType } from "@/features/products/product.types";
import TopSection from "./top-section";
import MiddleSection from "./middle-section";

const ProductView = ({ product }: { product: ProductType }) => {
  console.log(product);
  return (
    <div>
      <TopSection product={product} />
      <MiddleSection product={product} />
    </div>
  );
};

export default ProductView;

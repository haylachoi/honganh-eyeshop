import { ProductType } from "@/features/products/product.types";
import TopSection from "./top-section";
import MiddleSection from "./middle-section";
import { Benefit } from "@/components/shared/benefit";
import { Suspense } from "react";
import { LoadingIndicator } from "@/components/shared/loading-indicator";

const ProductView = ({ product }: { product: ProductType }) => {
  return (
    <div className="space-y-10">
      <TopSection product={product} />
      <Suspense fallback={<LoadingIndicator />}>
        <Benefit className="bg-secondary fluid-container" />
      </Suspense>
      <MiddleSection product={product} />
    </div>
  );
};

export default ProductView;

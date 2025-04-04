"use client";

import { ProductType } from "@/features/products/product.types";
import TopSection from "./top-section";
import MiddleSection from "./middle-section";
import { BotSection } from "./bot-section";
import { Result } from "@/types";
import { ReviewType } from "@/features/reviews/review.type";
import { Suspense } from "react";

const ProductView = ({
  product,
  reviewsPromise,
}: {
  product: ProductType;
  reviewsPromise: Promise<
    Result<
      ReviewType[],
      {
        message: string;
        type?: string;
      }
    >
  >;
}) => {
  return (
    <div className="space-y-10">
      <TopSection product={product} />
      <MiddleSection product={product} />
      <Suspense fallback={<div>Loading...</div>}>
        <BotSection product={product} reviewsPromise={reviewsPromise} />
      </Suspense>
    </div>
  );
};

export default ProductView;

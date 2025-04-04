"use client";

import { ProductType } from "@/features/products/product.types";
import { ReviewType } from "@/features/reviews/review.type";
import { Result } from "@/types";
import React, { use } from "react";
import { ReviewsView } from "./reviews-view";
import { ReviewForm } from "./review-form";

export const BotSection = ({
  product,
  reviewsPromise,
}: {
  product: ProductType;
  reviewsPromise: Promise<
    Result<ReviewType[], { message: string; type?: string }>
  >;
}) => {
  const reviewsResult = use(reviewsPromise);
  const reviews = reviewsResult.success ? reviewsResult.data : [];

  return (
    <div className="py-4 flex flex-col gap-12">
      <ReviewForm product={product} />
      <div className="py-8 bg-secondary fluid-container">
        <ReviewsView reviews={reviews} />
      </div>
    </div>
  );
};

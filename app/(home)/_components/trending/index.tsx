import React from "react";

import { Heading } from "../heading";
import TrendingContent from "./trending.content";
import { getPublishedProductsByTags } from "@/features/products/product.queries";
import { PAGE_SIZE } from "@/constants";

const Trending = async () => {
  const result = await getPublishedProductsByTags({
    tags: ["trending"],
    page: 0,
    size: PAGE_SIZE.TRENDING.SM,
  });
  const trendingProducts = result.success ? result.data.products : [];
  return (
    <div className="container">
      <Heading title="Trending Now" />
      <TrendingContent products={trendingProducts} />
    </div>
  );
};

export default Trending;

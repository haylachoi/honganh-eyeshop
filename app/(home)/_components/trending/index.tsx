import React from "react";

import { Heading } from "../heading";
import TrendingContent from "./trending.content";
import { getProductsByTags } from "@/features/products/product.query";

const Trending = async () => {
  const result = await getProductsByTags(["trending"]);
  const trendingProducts = result.success ? result.data : [];
  return (
    <div className="container">
      <Heading title="Trending Now" />
      <TrendingContent products={trendingProducts} />
    </div>
  );
};

export default Trending;

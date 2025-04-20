import React from "react";

import { Heading } from "../heading";
import TrendingContent from "./trending.content";
import { getPublishedProductsByTags } from "@/features/products/product.queries";
import { PAGE_SIZE } from "@/constants";
import Link from "next/link";
import { getLink } from "@/lib/utils";

const Trending = async () => {
  const result = await getPublishedProductsByTags({
    tags: ["trending"],
    page: 0,
    size: PAGE_SIZE.TRENDING.SM,
  });
  const trendingProducts = result.success ? result.data.products : [];
  return (
    <div className="container">
      <Link href={getLink.tag.trending()}>
        <Heading title="Trending Now" />
      </Link>
      <TrendingContent products={trendingProducts} />
    </div>
  );
};

export default Trending;

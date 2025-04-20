import React from "react";
import { ArrivalContent } from "./new-arrival.content";
import { Heading } from "../heading";
import { getPublishedProductsByTags } from "@/features/products/product.queries";
import { PAGE_SIZE } from "@/constants";
import Link from "next/link";
import { getLink } from "@/lib/utils";

const NewArrival = async () => {
  const result = await getPublishedProductsByTags({
    tags: ["new-arrival"],
    page: 0,
    size: PAGE_SIZE.NEW_ARRIVAL.SM,
  });
  const newArrivalProducts = result.success ? result.data.products : [];
  return (
    <div className="container">
      <Link href={getLink.tag.newArrival()}>
        <Heading title="Hàng sắp về" />
      </Link>
      <ArrivalContent products={newArrivalProducts} />
    </div>
  );
};

export default NewArrival;

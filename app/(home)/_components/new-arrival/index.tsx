import React from "react";
import { ArrivalContent } from "./new-arrival.content";
import { Heading } from "../heading";
import { getPublishedProductsByTags } from "@/features/products/product.queries";
import { PAGE_SIZE } from "@/constants";

const NewArrival = async () => {
  const result = await getPublishedProductsByTags({
    tags: ["new-arrival"],
    page: 0,
    size: PAGE_SIZE.NEW_ARRIVAL.SM,
  });
  const newArrivalProducts = result.success ? result.data.products : [];
  return (
    <div className="container">
      <Heading title="Hàng sắp về" />
      <ArrivalContent products={newArrivalProducts} />
    </div>
  );
};

export default NewArrival;

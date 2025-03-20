import React from "react";
import { ArrivalContent } from "./new-arrival.content";
import { Heading } from "../heading";
import { getProductsByTags } from "@/features/products/product.query";

const NewArrival = async () => {
  const result = await getProductsByTags(["new-arrival"]);
  const newArrivalProducts = result.success ? result.data : [];
  return (
    <div className="container">
      <Heading title="Hàng sắp về" />
      <ArrivalContent products={newArrivalProducts} />
    </div>
  );
};

export default NewArrival;

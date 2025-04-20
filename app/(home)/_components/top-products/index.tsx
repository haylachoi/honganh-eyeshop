import {
  TabList,
  TabPanel,
  Tabs,
  TabTrigger,
} from "@/components/custom-ui/tabs";
import { cn } from "@/lib/utils";
import React from "react";
import { Heading } from "../heading";
import { getPublishedProductsForEachCategory } from "@/features/products/product.queries";
import { ProductsContainer } from "../products-container";

const TopProducts = async ({ className }: { className?: string }) => {
  const result = await getPublishedProductsForEachCategory();
  if (!result.success) return null;

  const categories = result.data;
  return (
    <Tabs className={cn("container", className)}>
      <div className="flex justify-between items-baseline">
        <Heading title="Sản phẩm" />
        <TabList>
          {categories.map((category) => (
            <TabTrigger
              key={category.category.id}
              value={category.category.id}
              className="text-foreground/70"
              activeClassName="text-primary"
            >
              {category.category.name}
            </TabTrigger>
          ))}
        </TabList>
      </div>
      {categories.map((category) => (
        <TabPanel key={category.category.id} value={category.category.id}>
          <div>
            <ProductsContainer products={category.products} />
          </div>
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default TopProducts;

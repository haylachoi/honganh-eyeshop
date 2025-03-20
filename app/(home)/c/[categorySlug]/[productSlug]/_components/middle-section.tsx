import {
  TabList,
  TabPanel,
  Tabs,
  TabTrigger,
} from "@/components/custom-ui/tabs";
import { ProductType } from "@/features/products/product.types";
import React from "react";

const header = ["Details", "Reviews"];

const MiddleSection = ({ product }: { product: ProductType }) => {
  return (
    <div>
      <Tabs>
        <TabList>
          {header.map((header) => (
            <TabTrigger
              className="text-xl"
              activeClassName="border-b-5 border-primary"
              key={header}
              value={header}
            >
              {header}
            </TabTrigger>
          ))}
        </TabList>
        <TabPanel value={header[0]}>content</TabPanel>
        <TabPanel value={header[1]}>content reviews</TabPanel>
      </Tabs>
    </div>
  );
};

export default MiddleSection;

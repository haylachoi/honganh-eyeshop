import {
  TabList,
  TabPanel,
  Tabs,
  TabTrigger,
} from "@/components/custom-ui/tabs";
import { ProductType } from "@/features/products/product.types";
import React from "react";

const header = ["Chi tiết", "Miêu tả"];

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
        <TabPanel className="mt-4" value={header[0]}>
          <DetailsSection attributes={product.attributes} />
        </TabPanel>
        <TabPanel className="mt-4" value={header[1]}>
          <pre>{product.description}</pre>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default MiddleSection;

const DetailsSection = ({
  attributes,
}: {
  attributes: ProductType["attributes"];
}) => {
  return (
    <div className="">
      <table className="table-auto max-w-[40rem] border-collapse border border-gray-200 dark:border-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="text-left px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-semibold">
              Tên
            </th>
            <th className="text-left px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-semibold">
              Giá trị
            </th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((attribute) => (
            <tr
              key={attribute.name}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                {attribute.name}
              </td>
              <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                {attribute.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

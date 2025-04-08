"use client";

import { PreviewCard } from "../product-preview-card";
import { useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { searchProductByQuery } from "@/features/search/search.actions";
import React from "react";
import SortingOptions from "../sorting-options";

const ProductsView = ({
  defaultFilter,
}: {
  defaultFilter?: Record<string, string>;
}) => {
  const searchParams = useSearchParams();
  const { execute, result, isPending } = useAction(searchProductByQuery);

  React.useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (defaultFilter) {
      Object.entries(defaultFilter).forEach(([key, value]) => {
        if (!params[key]) {
          params[key] = value;
        }
      });
    }

    execute(params);
  }, [searchParams, execute, defaultFilter]);

  const products = result.data ? result.data : [];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <SortingOptions />
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isPending && <div>Loading...</div>}
        {!isPending &&
          products.map((product) => (
            <li key={product.id}>
              <PreviewCard product={product} />
            </li>
          ))}
      </ul>
    </div>
  );
};

// const ProductsView = ({ products }: { products: ProductType[] }) => {
//   return (
//     <ul className="grid grid-cols-4 gap-4">
//       {products.map((product) => (
//         <li key={product.id}>
//           <PreviewCard product={product} />
//         </li>
//       ))}
//     </ul>
//   );
// };

export default ProductsView;

"use client";

import { PreviewCard } from "../product-preview-card";
import { useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import SortingOptions from "../sorting-options";
import { searchProductByQuery } from "@/features/filter/filter.actions";
import { ProductType } from "@/features/products/product.types";
import { PRODUCTS_PER_PAGE } from "@/constants";
import { Loader } from "lucide-react";

const pageSize = PRODUCTS_PER_PAGE;

const emptyProductsInfo = {
  page: 0,
  products: [],
  total: 0,
};

const ProductsView = ({
  defaultFilter,
  defaultProductsInfo = { page: 0, products: [], total: 0 },
}: {
  defaultFilter?: Record<string, string>;
  defaultProductsInfo?: {
    page: number;
    products: ProductType[];
    total: number;
  };
}) => {
  const searchParams = useSearchParams();
  const { execute, isPending } = useAction(searchProductByQuery, {
    onSuccess: (result) => {
      const data = result.data;
      if (data) {
        if (result.input.page && result.input.page > 0) {
          setProductsInfo((prev) => ({
            products: [...prev.products, ...data.products],
            total: data.total,
            page: data.page,
          }));

          return;
        }

        setProductsInfo(data);
      }
    },
  });

  const [productsInfo, setProductsInfo] = React.useState<{
    page: number;
    products: ProductType[];
    total: number;
  }>(!searchParams.toString() ? defaultProductsInfo : emptyProductsInfo);

  const fetchData = (props?: { page?: number; size?: number }) => {
    const params = Object.fromEntries(searchParams.entries());
    if (defaultFilter) {
      Object.entries(defaultFilter).forEach(([key, value]) => {
        if (!params[key]) {
          params[key] = value;
        }
      });
    }

    execute({
      params,
      ...props,
    });
  };
  const hasMounted = React.useRef(false);

  React.useEffect(() => {
    if (!hasMounted.current && !searchParams.toString()) {
      hasMounted.current = true;
      return;
    }

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, execute, defaultFilter]);

  const products = productsInfo.products;
  const total = productsInfo.total;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          {isPending ? "Đang tìm kiếm ..." : `Tìm thấy ${total} kết quả `}
        </div>
        <SortingOptions />
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {products.map((product) => (
          <li key={product.id}>
            <PreviewCard className="w-full" product={product} />
          </li>
        ))}
      </ul>
      {productsInfo.products.length < productsInfo.total && (
        <button
          className="mt-4 py-2 px-2 cursor-pointer border border-foreground hover:border-primary w-max mx-auto flex items-center gap-4"
          onClick={() =>
            fetchData({
              page: productsInfo.page + 1,
            })
          }
          disabled={isPending}
        >
          {`Hiển thị thêm ${Math.min(productsInfo.total - (productsInfo.page + 1) * pageSize, pageSize)} kết quả`}
          {isPending && <Loader className="animate-spin" />}
        </button>
      )}
    </div>
  );
};

export default ProductsView;

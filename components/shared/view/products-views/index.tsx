"use client";

import { ProductPreviewCard } from "../../product-preview-card";
import SortingOptions from "../../sorting-options";
import { ProductPreview } from "@/features/products/product.types";
import { Loader } from "lucide-react";
import { PAGE_SIZE } from "@/constants";
import { useInfiniteProducts } from "./use-infinite-products";

const firstPage = 1;
const emptyProductsInfo = {
  page: firstPage,
  items: [],
  total: 0,
  size: PAGE_SIZE.DEFAULT,
};

const ProductsView = ({
  defaultFilter,
  defaultProductsInfoWhenNoParams = emptyProductsInfo,
}: {
  defaultFilter?: Record<string, string>;
  defaultProductsInfoWhenNoParams?: {
    page: number;
    items: ProductPreview[];
    size: number;
    total: number;
  };
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProducts({
      defaultFilter,
      defaultProductsInfoWhenNoParams,
    });

  const allProducts = data?.pages.flatMap((page) => page.items) || [];
  const total = data?.pages[0]?.total || 0;
  const size = data?.pages[0]?.size || defaultProductsInfoWhenNoParams?.size;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div>
          {isLoading ? "Đang tìm kiếm ..." : `Tìm thấy ${total} kết quả `}
        </div>
        <SortingOptions />
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {allProducts.map((product) => (
          <li key={product.id}>
            <ProductPreviewCard className="w-full" product={product} />
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <button
          className="mt-4 py-2 px-2 cursor-pointer border border-foreground hover:border-primary w-max mx-auto flex items-center gap-4"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {`Hiển thị thêm ${Math.min(
            total - allProducts.length,
            size,
          )} kết quả`}
          {isFetchingNextPage && <Loader className="animate-spin" />}
        </button>
      )}
    </div>
  );
};
export default ProductsView;

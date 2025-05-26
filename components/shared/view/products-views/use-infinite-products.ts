import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductPreview } from "@/features/products/product.types";
import { paginationInfoSchema } from "@/lib/validator";
import { productPreviewTypeSchema } from "@/features/products/product.validator";
import { PAGE_SIZE } from "@/constants";
import { API_ENDPOINTS } from "@/constants/endpoints.constants";

const firstPage = 1;
const emptyProductsInfo = {
  page: firstPage,
  items: [],
  total: 0,
  size: PAGE_SIZE.DEFAULT,
};

export const useInfiniteProducts = ({
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
  const searchParams = useSearchParams();

  const mergedParams = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    if (defaultFilter) {
      Object.entries(defaultFilter).forEach(([key, value]) => {
        if (!params[key]) {
          params[key] = value;
        }
      });
    }
    return params;
  }, [searchParams, defaultFilter]);

  const hasQueryParams = useMemo(() => {
    return Array.from(searchParams.keys()).length > 0;
  }, [searchParams]);

  const fetchPage = async ({ pageParam = firstPage }) => {
    if (!hasQueryParams && pageParam === firstPage) {
      return defaultProductsInfoWhenNoParams ?? emptyProductsInfo;
    }

    const res = await fetch(API_ENDPOINTS.products.search, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...mergedParams,
        page: pageParam,
      }),
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    return data?.success
      ? paginationInfoSchema(productPreviewTypeSchema).parse(data.data)
      : emptyProductsInfo;
  };

  return useInfiniteQuery({
    queryKey: ["products", JSON.stringify(mergedParams)],
    queryFn: fetchPage,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      const canLoadMore = lastPage.page * lastPage.size < lastPage.total;
      return canLoadMore ? nextPage : undefined;
    },
    initialPageParam: firstPage,
    initialData:
      defaultProductsInfoWhenNoParams && !hasQueryParams
        ? {
            pageParams: [firstPage],
            pages: [defaultProductsInfoWhenNoParams],
          }
        : undefined,
  });
};

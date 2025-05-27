import { useQuery } from "@tanstack/react-query";
import { CACHE_CONFIG } from "@/cache/cache.constant";
import { API_ENDPOINTS } from "@/constants/endpoints.constants";
import { OrderType } from "@/features/orders/order.types";
import { SORTING_KEYWORDS } from "@/constants";

export const useFetchAllOrders = ({
  page,
  size,
  sortBy,
  orderBy,
}: {
  page: number;
  size: number;
  sortBy: string;
  orderBy: string;
}) => {
  const query = useQuery({
    queryKey: [
      CACHE_CONFIG.ORDER.ALL.KEY_PARTS[0],
      {
        page,
        sortBy,
        orderBy,
        size,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        [SORTING_KEYWORDS.sort_by]: sortBy,
        [SORTING_KEYWORDS.order_by]: orderBy,
      });

      const res = await fetch(`${API_ENDPOINTS.orders}?${params.toString()}`);

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch orders");
      }
      return json.data as {
        total: number;
        items: OrderType[];
        size: number;
      };
    },
  });

  return query;
};

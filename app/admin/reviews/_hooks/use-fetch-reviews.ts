import { useQuery } from "@tanstack/react-query";
import { CACHE_CONFIG } from "@/cache/cache.constant";
import { API_ENDPOINTS } from "@/constants/endpoints.constants";
import { ReviewWithFullInfoType } from "@/features/reviews/review.type";
import { SORTING_KEYWORDS } from "@/constants";

export const useFetchReviews = ({
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
  // todo: stringify params of queryKey
  const query = useQuery({
    queryKey: [
      CACHE_CONFIG.REVIEWS.ALL.KEY_PARTS[0],
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

      const res = await fetch(`${API_ENDPOINTS.reviews}?${params.toString()}`);

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to fetch orders");
      }
      return json.data as {
        total: number;
        items: ReviewWithFullInfoType[];
        size: number;
      };
    },
  });

  return query;
};

import { useQuery } from "@tanstack/react-query";
import { FILTER_KEYWORDS } from "@/constants";
import { API_ENDPOINTS } from "@/constants/endpoints.constants";
import { GlobalSearchResult } from "@/features/filter/filter.types";
import { globalSearchResultSchema } from "@/features/filter/filter.validator";

export const defaultSearchResult: GlobalSearchResult = {
  products: {
    items: [],
    total: 0,
  },
  blogs: {
    items: [],
    total: 0,
  },
};

export const useGlobalSearch = (query: string, enabled: boolean) => {
  return useQuery<GlobalSearchResult>({
    queryKey: ["global-search", query],
    queryFn: async () => {
      const res = await fetch(API_ENDPOINTS.globalSearch, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [FILTER_KEYWORDS.search]: query }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();

      const result = globalSearchResultSchema.safeParse(data?.data);

      if (!result.success) {
        return defaultSearchResult;
      }
      return result.data;
    },
    enabled,
  });
};

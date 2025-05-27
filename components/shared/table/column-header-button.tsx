"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SORTING_KEYWORDS } from "@/constants";

type SortHandler =
  | string
  | ((args: {
      router: ReturnType<typeof useRouter>;
      searchParams: ReturnType<typeof useSearchParams>;
    }) => void);

interface ColumnHeaderButtonProps {
  onSort: SortHandler;
  children: React.ReactNode;
}

export const ColumnHeaderButton = ({
  onSort,
  children,
}: ColumnHeaderButtonProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    if (typeof onSort === "function") {
      onSort({ router, searchParams });
    } else if (typeof onSort === "string") {
      const currentSort = searchParams.get(SORTING_KEYWORDS.sort_by);
      const currentOrder =
        searchParams.get(SORTING_KEYWORDS.order_by) || SORTING_KEYWORDS.desc;
      const newOrder =
        currentSort === onSort && currentOrder === SORTING_KEYWORDS.asc
          ? SORTING_KEYWORDS.desc
          : SORTING_KEYWORDS.asc;

      const newParams = new URLSearchParams(searchParams);
      newParams.set(SORTING_KEYWORDS.sort_by, onSort);
      newParams.set(SORTING_KEYWORDS.order_by, newOrder);

      router.replace(`?${newParams.toString()}`);
    }
  };

  return (
    <Button variant="ghost" onClick={handleClick}>
      {children}
    </Button>
  );
};

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SORTING_OPTIONS } from "@/constants";

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
      const currentSort = searchParams.get(SORTING_OPTIONS.SORT_BY);
      const currentOrder =
        searchParams.get(SORTING_OPTIONS.ORDER_BY) || SORTING_OPTIONS.DESC;
      const newOrder =
        currentSort === onSort && currentOrder === SORTING_OPTIONS.ASC
          ? SORTING_OPTIONS.DESC
          : SORTING_OPTIONS.ASC;

      const newParams = new URLSearchParams(searchParams);
      newParams.set(SORTING_OPTIONS.SORT_BY, onSort);
      newParams.set(SORTING_OPTIONS.ORDER_BY, newOrder);

      router.replace(`?${newParams.toString()}`);
    }
  };

  return (
    <Button variant="ghost" onClick={handleClick}>
      {children}
    </Button>
  );
};

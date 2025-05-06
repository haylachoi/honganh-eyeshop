"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

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
      const currentSort = searchParams.get("sortBy");
      const currentOrder = searchParams.get("orderBy") || "DESC";
      const newOrder =
        currentSort === onSort && currentOrder === "ASC" ? "DESC" : "ASC";

      const newParams = new URLSearchParams(searchParams);
      newParams.set("sortBy", onSort);
      newParams.set("orderBy", newOrder);

      router.replace(`?${newParams.toString()}`);
    }
  };

  return (
    <Button variant="ghost" onClick={handleClick}>
      {children}
    </Button>
  );
};

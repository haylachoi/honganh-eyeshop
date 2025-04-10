"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxSelected,
  ComboboxTrigger,
} from "@/components/custom-ui/combobox";
import { SORTING_OPTIONS } from "@/constants";
import { ChevronDown } from "lucide-react";

const SORT_DESCRIPTIONS = {
  [SORTING_OPTIONS.NAME]: {
    [SORTING_OPTIONS.ASC]: "A to Z",
    [SORTING_OPTIONS.DESC]: "Z to A",
  },
  [SORTING_OPTIONS.PRICE]: {
    [SORTING_OPTIONS.ASC]: "Low to High",
    [SORTING_OPTIONS.DESC]: "High to Low",
  },
} as const;

const getDescription = (sortBy?: string, orderBy?: string) =>
  SORT_DESCRIPTIONS[sortBy as keyof typeof SORT_DESCRIPTIONS]?.[
    orderBy as keyof (typeof SORT_DESCRIPTIONS)[string]
  ] || "Default";

interface SortingOptionsProps {
  className?: string;
}

const SortingOptions = ({ className }: SortingOptionsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSort = searchParams.get(SORTING_OPTIONS.SORT_BY) ?? "";
  const currentOrder = searchParams.get(SORTING_OPTIONS.ORDER_BY) ?? "";

  const handleSortChange = (sortKey: string, orderKey: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(SORTING_OPTIONS.SORT_BY, sortKey);
    params.set(SORTING_OPTIONS.ORDER_BY, orderKey);

    router.replace(`?${params.toString()}`);
  };

  return (
    <Combobox
      className={cn("bg-background w-[200px]", className)}
      defaultValue={getDescription(currentSort, currentOrder)}
    >
      <ComboboxTrigger className="border">
        <ComboboxSelected
          defaultDisplayValue="Sắp xếp"
          render={({ value, isOpen }) => (
            <div className="flex justify-between items-center px-2 py-1 cursor-pointer">
              <span>{value}</span>
              <ChevronDown
                className={cn(
                  "ml-1 h-4 w-4 transition-all",
                  isOpen && "rotate-180",
                )}
              />
            </div>
          )}
        />
      </ComboboxTrigger>
      <ComboboxList>
        {Object.entries(SORT_DESCRIPTIONS).flatMap(([sortKey, orders]) =>
          Object.entries(orders).map(([orderKey, label]) => (
            <ComboboxItem key={`${sortKey}-${orderKey}`} value={label}>
              <div
                className="px-2 py-1 w-full cursor-pointer hover:bg-secondary"
                onClick={() => handleSortChange(sortKey, orderKey)}
              >
                {label}
              </div>
            </ComboboxItem>
          )),
        )}
      </ComboboxList>
    </Combobox>
  );
};

export default SortingOptions;

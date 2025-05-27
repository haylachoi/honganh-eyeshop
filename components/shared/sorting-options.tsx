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
import { SORTING_KEYWORDS } from "@/constants";
import { ChevronDown } from "lucide-react";

const SORT_DESCRIPTIONS = {
  [SORTING_KEYWORDS.name]: {
    [SORTING_KEYWORDS.asc]: "A - Z",
    [SORTING_KEYWORDS.desc]: "Z - A",
  },
  [SORTING_KEYWORDS.price]: {
    [SORTING_KEYWORDS.asc]: "Thấp - cao",
    [SORTING_KEYWORDS.desc]: "Cao - thấp",
  },
} as const;

const getDescription = (sortBy?: string, orderBy?: string) =>
  SORT_DESCRIPTIONS[sortBy as keyof typeof SORT_DESCRIPTIONS]?.[
    orderBy as keyof (typeof SORT_DESCRIPTIONS)[string]
  ] || "Default";

interface SortingOptionsProps {
  className?: string;
  isShalowRouting?: boolean;
}

const SortingOptions = ({
  className,
  isShalowRouting = true,
}: SortingOptionsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentSort = searchParams.get(SORTING_KEYWORDS.sort_by) ?? "";
  const currentOrder = searchParams.get(SORTING_KEYWORDS.order_by) ?? "";

  const handleSortChange = (sortKey: string, orderKey: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(SORTING_KEYWORDS.sort_by, sortKey);
    params.set(SORTING_KEYWORDS.order_by, orderKey);

    if (isShalowRouting) {
      window.history.replaceState(null, "", `?${params.toString()}`);
    } else {
      router.replace(`?${params.toString()}`, {
        scroll: false,
      });
    }
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

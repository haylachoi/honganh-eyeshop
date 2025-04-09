"use client";

import { FilterGroupType } from "@/features/filter/filter.types";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../custom-ui/accordion";
import { ChevronDown, ListFilter, LucideFilter } from "lucide-react";
import React from "react";

const FilterView = ({ attributes }: { attributes: FilterGroupType[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setSearchParam = ({ name, value }: { name: string; value: string }) => {
    const params = new URLSearchParams(searchParams);
    const existingValue = params.get(name);

    if (existingValue) {
      // Nếu có giá trị, tách thành mảng
      const valuesArray = decodeURIComponent(existingValue).split(",");

      if (valuesArray.includes(value)) {
        // Nếu đã có giá trị, xóa nó
        const updatedValues = valuesArray.filter((v) => v !== value);
        if (updatedValues.length > 0) {
          params.set(name, updatedValues.join(","));
        } else {
          params.delete(name);
        }
      } else {
        // Nếu chưa có, thêm giá trị mới
        valuesArray.push(value);
        params.set(name, valuesArray.join(","));
      }
    } else {
      // Nếu chưa có, thêm mới
      params.set(name, value);
    }

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  const clearFilter = () => {
    const params = new URLSearchParams();

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div>
      <input type="checkbox" className="hidden peer" id="filter-trigger" />
      <label
        htmlFor="filter-trigger"
        className="fixed inset-0 z-10 cursor-pointer bg-foreground opacity-60 hidden peer-checked:block"
      />
      <div className="border border-muted-foreground h-[max(100dvh,200px)] max-lg:w-0 max-lg:peer-checked:w-[280px] grid grid-rows-[auto_1fr] max-lg:fixed inset-0 left-auto z-20 max-lg:bg-background transition-all">
        <div className="overflow-hidden">
          <label
            className="absolute right-full top-1/2 p-2 bg-primary text-primary-foreground cursor-pointer"
            htmlFor="filter-trigger"
          >
            <LucideFilter />
          </label>
          <div className="px-3 pt-4 pb-2 flex justify-between items-baseline gap-2">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              Bộ lọc
              <ListFilter />
            </h2>
            <button
              onClick={clearFilter}
              className="cursor-pointer hover:text-primary underline"
            >
              Xóa bộ lọc
            </button>
          </div>
          <ul className="overflow-y-auto">
            {attributes.map((filterGroup) => (
              <li key={filterGroup.name} className="px-3">
                <div className="-mx-3 h-px bg-muted-foreground" />
                <Accordion defaultActiveValue={filterGroup.name}>
                  <AccordionItem value={filterGroup.name}>
                    <AccordionTrigger className="h-full py-2 flex justify-between items-center gap-2 text-xl font-bold cursor-pointer">
                      <h4 className="capitalize text-primary font-medium text-lg text-left">
                        {filterGroup.name}
                      </h4>
                      <ChevronDown className="size-6 inline-block max-lg:group-data-[accordion-active='true']:rotate-180 transition-all duration-300 lg:group-hover:rotate-180" />
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="has-[li]:mb-2 flex flex-col gap-2">
                        {filterGroup.values.map((value) => (
                          <li key={value.value}>
                            <label className="flex gap-2 cursor-pointer capitalize">
                              <input
                                type="checkbox"
                                className="cursor-pointer"
                                checked={
                                  searchParams.has(filterGroup.name) &&
                                  decodeURIComponent(
                                    searchParams.get(filterGroup.name) || "",
                                  )
                                    .split(",")
                                    .includes(value.valueSlug)
                                }
                                onChange={() =>
                                  setSearchParam({
                                    name: filterGroup.name,
                                    value: value.valueSlug,
                                  })
                                }
                              />
                              {value.value}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FilterView;

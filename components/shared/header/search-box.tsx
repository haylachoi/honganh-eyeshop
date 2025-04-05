"use client";

import { searchProductsAction } from "@/features/products/product.actions";
import { ProductType } from "@/features/products/product.types";
import { cn } from "@/lib/utils";
import { LoaderIcon, SearchIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { useDebounce } from "use-debounce";

const SearchBox = () => {
  const [search, setSearch] = React.useState("");
  const [debounceSearch] = useDebounce(search, 500);
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState<ProductType[]>([]);
  const ref = React.useRef<HTMLDivElement>(null);
  const { execute: searchProducts, isPending } = useAction(
    searchProductsAction,
    {
      onSuccess: (result) => {
        if (result.data) {
          setSearchResult(result.data);
        }
      },
    },
  );

  React.useEffect(() => {
    if (search && !isOpen) {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  React.useEffect(() => {
    if (debounceSearch) {
      searchProducts(debounceSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch]);

  React.useEffect(() => {
    if (isOpen && ref.current) {
      ref.current.style.height = Math.max(300, ref.current.scrollHeight) + "px";
    } else if (ref.current) {
      ref.current.style.height = "0px";
    }
  }, [isOpen]);

  return (
    <div
      className="relative flex items-center gap-2 px-2 bg-secondary"
      onKeyUp={(e) => e.key === "Escape" && setIsOpen(false)}
    >
      <input
        type="checkbox"
        id="search-box-trigger"
        className="hidden"
        checked={isOpen}
        onChange={(e) => setIsOpen(e.target.checked)}
      />
      <input
        className="py-1 focus-visible:outline-none"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      />
      <SearchIcon
        className={cn("size-5 text-foreground/60", isPending && "hidden")}
      />
      <LoaderIcon
        className={cn("size-5 text-foreground/60 hidden", isPending && "block")}
      />
      {/* search result */}
      <div
        ref={ref}
        className={cn(
          "fixed z-20 left-0 right-0 top-[48px] bg-background transition-all duration-400 ease-in-out overflow-hidden",
        )}
      >
        <div className="overflow-hidden">
          <div className="w-full h-[1px] bg-foreground" />
          <ul>
            {searchResult.map((product) => (
              <li key={product.id}>{product.name}</li>
            ))}
          </ul>
        </div>
      </div>
      {/* overlay */}
      <div
        className={cn(
          "cursor-pointer fixed z-10 inset-0 top-[48px] bg-foreground/50 transition-opacity",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      ></div>
    </div>
  );
};

export default SearchBox;

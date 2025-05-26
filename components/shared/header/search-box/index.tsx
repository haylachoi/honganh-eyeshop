"use client";

import { MIN_CHARACTER_LENGTH_FOR_SEARCH } from "@/constants";
import { FILTER_NAME } from "@/features/filter/filter.constants";
import { cn, getLink } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import { useDebounce } from "use-debounce";
import { defaultSearchResult, useGlobalSearch } from "./use-global-search";
import DesktopInput from "./desktop-input";
import MobileInput from "./mobile-input";
import SearchResults from "./search-result";
import { useBreakpoint } from "@/hooks/use-is-mobile";

const SearchBox = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [debounceSearch] = useDebounce(search, 300);
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const breakpoint = useBreakpoint();

  const { data: searchResult = defaultSearchResult, isFetching: isPending } =
    useGlobalSearch(
      debounceSearch,
      debounceSearch.length >= MIN_CHARACTER_LENGTH_FOR_SEARCH,
    );

  React.useEffect(() => {
    if (search && !isOpen) {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  React.useEffect(() => {
    if (debounceSearch === "" && breakpoint !== "mobile") {
      setIsOpen(false);
    }
  }, [debounceSearch, breakpoint]);

  React.useEffect(() => {
    if (isOpen && ref.current) {
      ref.current.style.height = Math.max(300, ref.current.scrollHeight) + "px";
    } else if (ref.current) {
      ref.current.style.height = "0px";
    }
  }, [isOpen]);

  return (
    <div
      className="relative flex items-center gap-2 px-2 md:bg-secondary"
      onKeyUp={(e) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
        if (e.key === "Enter") {
          setIsOpen(false);
          router.push(
            getLink.search({
              queries: [
                {
                  key: FILTER_NAME.SEARCH,
                  value: search,
                },
              ],
            }),
          );
        }
      }}
    >
      <input
        type="checkbox"
        id="search-box-trigger"
        className="hidden"
        checked={isOpen}
        onChange={(e) => setIsOpen(e.target.checked)}
      />
      <DesktopInput
        search={search}
        setSearch={setSearch}
        setIsOpen={setIsOpen}
        isPending={isPending}
      />
      {/* search result */}
      <div
        ref={ref}
        className={cn(
          "fixed z-20 left-0 right-0 top-[48px] bg-background transition-all duration-400 ease-in-out overflow-y-auto hidden max-h-[60dvh]",
          isOpen && "block",
        )}
      >
        <div className="w-full h-[2px] bg-foreground" />
        <div className="overflow-hidden container py-2 flex flex-col gap-6">
          <MobileInput
            search={search}
            setSearch={setSearch}
            isPending={isPending}
            isOpen={isOpen}
          />
          {search && (
            <SearchResults
              searchResult={searchResult}
              setSearch={setSearch}
              setIsOpen={setIsOpen}
            />
          )}
        </div>
      </div>
      {/* overlay */}
      <div
        className={cn(
          "cursor-pointer fixed z-10 h-dvh inset-0 top-[48px] bg-foreground/50 transition-opacity",
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

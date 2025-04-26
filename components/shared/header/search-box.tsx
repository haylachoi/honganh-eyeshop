"use client";

import { MIN_CHARACTER_LENGTH_FOR_SEARCH } from "@/constants";
import { searchAction } from "@/features/filter/filter.actions";
import {
  SearchBlogResultType,
  searchProductResultType,
} from "@/features/filter/filter.types";
import { cn, currencyFormatter, getLink } from "@/lib/utils";
import { LoaderIcon, SearchIcon, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useDebounce } from "use-debounce";

const defaultSearchResult = {
  products: {
    result: [],
    total: 0,
  },
  blogs: {
    result: [],
    total: 0,
  },
};

const SearchBox = () => {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [debounceSearch] = useDebounce(search, 500);
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState<{
    products: {
      result: searchProductResultType[];
      total: number;
    };
    blogs: {
      result: SearchBlogResultType[];
      total: number;
    };
  }>(defaultSearchResult);
  const ref = React.useRef<HTMLDivElement>(null);
  const { execute: searchProducts, isPending } = useAction(searchAction, {
    onSuccess: (result) => {
      if (result.data) {
        setSearchResult({
          products: {
            result: result.data.products.result,
            total: result.data.products.total,
          },
          blogs: {
            result: result.data.blogs.result,
            total: result.data.blogs.total,
          },
        });
      }
    },
  });

  React.useEffect(() => {
    if (search && !isOpen) {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  React.useEffect(() => {
    if (
      debounceSearch &&
      debounceSearch.length >= MIN_CHARACTER_LENGTH_FOR_SEARCH
    ) {
      searchProducts(debounceSearch);
    }
    if (debounceSearch === "") {
      setSearchResult(defaultSearchResult);
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
      className="relative flex items-center gap-2 px-2 md:bg-secondary"
      onKeyUp={(e) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
        if (e.key === "Enter") {
          setIsOpen(false);
          router.push(getLink.search({ keyword: search }));
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
      <input
        className="py-1 focus-visible:outline-none hidden md:block"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      />
      <button
        className="cursor-pointer"
        onClick={() => {
          const width = window.innerWidth;
          // if mobile screen, text input not show, so we don't need to delete search text, other button will delete text
          if (!isPending && search && width > 768) {
            setSearch("");
            return;
          }

          if (!isPending) {
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <SearchIcon
          className={cn(
            "size-5 text-foreground/60 md:hidden",
            !isPending && !search && "md:block",
          )}
        />
        <X
          className={cn(
            "size-5 text-foreground/60 hidden",
            !isPending && search && "md:block",
          )}
        />
        <LoaderIcon
          className={cn(
            "size-5 text-foreground/60 hidden",
            isPending && "md:block",
          )}
        />
      </button>
      {/* search result */}
      <div
        ref={ref}
        className={cn(
          "fixed z-20 left-0 right-0 top-[48px] bg-background transition-all duration-400 ease-in-out overflow-hidden hidden",
          isOpen && "block",
        )}
      >
        <div className="w-full h-[2px] bg-foreground" />
        <div className="overflow-hidden container py-2 flex flex-col gap-6">
          <div
            className={cn(
              "w-full bg-secondary hidden outline-1 focus-within:outline-primary",
              isOpen && "max-md:grid grid-cols-[1fr_auto]",
            )}
          >
            <input
              className="py-1 px-2 focus-visible:outline-none"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nhập từ khóa..."
            />
            <button
              className="px-2 bg-secondary cursor-pointer"
              onClick={() => {
                if (!isPending && search) setSearch("");
              }}
            >
              {isPending ? (
                <LoaderIcon
                  className={cn(
                    "size-5 text-foreground/60 hidden",
                    isPending && "block",
                  )}
                />
              ) : (
                "X"
              )}
            </button>
          </div>
          {search && (
            <div className="grid grid-rows-[auto_auto] lg:grid-cols-[1fr_1fr] lg:grid-rows-none gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-primary font-medium">
                  {`Sản phẩm (${searchResult.products.total > 0 ? "ít nhất" : ""} ${searchResult.products.total} kết quả)`}
                </p>
                {searchResult.products.result.length === 0 && (
                  <p>Không tìm thấy sản phẩm nào</p>
                )}
                <ul className="flex flex-col gap-4">
                  {searchResult.products.result.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={product.link}
                        className="grid grid-cols-[auto_1fr] gap-4"
                        onClick={() => {
                          setIsOpen(false);
                          setSearch("");
                        }}
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={80}
                          height={40}
                        />
                        <div>
                          <p>{product.name}</p>
                          <p className="text-destructive">
                            {currencyFormatter.format(product.price)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-primary font-medium">
                  {`Tin tức (${searchResult.blogs.total > 0 ? "ít nhất" : ""} ${searchResult.blogs.total} kết quả)`}
                </p>
                {searchResult.blogs.result.length === 0 && (
                  <p>Không tìm thấy tin tức nào</p>
                )}
                <ul className="flex flex-col gap-4">
                  {searchResult.blogs.result.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={product.link}
                        className="grid grid-cols-[auto_1fr] gap-4"
                        onClick={() => {
                          setIsOpen(false);
                          setSearch("");
                        }}
                      >
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={80}
                          height={40}
                        />
                        <div className="flex items-center gap-2">
                          <p>{product.title}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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

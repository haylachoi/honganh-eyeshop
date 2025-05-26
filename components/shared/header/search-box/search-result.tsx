import React from "react";
import { currencyFormatter } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { GlobalSearchResult } from "@/features/filter/filter.types";

type Props = {
  searchResult: GlobalSearchResult;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

const SearchResults = ({ searchResult, setSearch, setIsOpen }: Props) => {
  return (
    <div className="grid grid-rows-[auto_auto] lg:grid-cols-[1fr_1fr] lg:grid-rows-none gap-4">
      <ResultSection
        title="Sản phẩm"
        total={searchResult.products.total}
        items={searchResult.products.items}
        emptyMessage="Không tìm thấy sản phẩm nào"
        renderItem={(item) => (
          <>
            <Image
              className="h-full aspect-[18/9] overflow-hidden"
              src={item.image}
              alt={item.name}
              width={80}
              height={40}
            />
            <div>
              <p>{item.name}</p>
              <p className="text-destructive">
                {currencyFormatter.format(item.price)}
              </p>
            </div>
          </>
        )}
        onClickItem={() => {
          setIsOpen(false);
          setSearch("");
        }}
      />
      <ResultSection
        title="Tin tức"
        total={searchResult.blogs.total}
        items={searchResult.blogs.items}
        emptyMessage="Không tìm thấy tin tức nào"
        renderItem={(item) => (
          <>
            <Image
              className="h-full aspect-[18/9] overflow-hidden"
              src={item.image}
              alt={item.title}
              width={80}
              height={40}
            />
            <div className="flex items-center gap-2">
              <p>{item.title}</p>
            </div>
          </>
        )}
        onClickItem={() => {
          setIsOpen(false);
          setSearch("");
        }}
      />
    </div>
  );
};

type ResultSectionProps<T> = {
  title: string;
  total: number;
  items: T[];
  emptyMessage: string;
  renderItem: (item: T) => React.ReactNode;
  onClickItem: () => void;
};

function ResultSection<T extends { id: string; link: string }>({
  title,
  total,
  items,
  emptyMessage,
  renderItem,
  onClickItem,
}: ResultSectionProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-primary font-medium">
        {`${title} (${total > 0 ? "ít nhất" : ""} ${total} kết quả)`}
      </p>
      {items.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.link}
                className="grid grid-cols-[auto_1fr] gap-4"
                onClick={onClickItem}
              >
                {renderItem(item)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchResults;

import { cn } from "@/lib/utils";
import { LoaderIcon, SearchIcon, X } from "lucide-react";
import React from "react";

type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPending: boolean;
};

const DesktopInput = ({ search, setSearch, setIsOpen, isPending }: Props) => {
  return (
    <>
      <input
        className="py-1 focus-visible:outline-none hidden md:block"
        aria-label="search something"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
      />
      <button
        className="cursor-pointer"
        aria-label="Search"
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
            "size-5 text-foreground/60 hidden animate-spin",
            isPending && "md:block",
          )}
        />
      </button>
    </>
  );
};

export default DesktopInput;

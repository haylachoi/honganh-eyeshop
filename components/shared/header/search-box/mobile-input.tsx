import React from "react";
import { LoaderIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  isPending: boolean;
  isOpen: boolean;
};

const MobileInput = ({ search, setSearch, isPending, isOpen }: Props) => (
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
            "size-5 text-foreground/60 hidden animate-spin",
            isPending && "block",
          )}
        />
      ) : (
        <X />
      )}
    </button>
  </div>
);

export default MobileInput;

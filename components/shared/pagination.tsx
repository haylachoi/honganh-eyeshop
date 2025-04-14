import { cn } from "@/lib/utils";
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getPageLink: (page: number) => string;
  className?: string;
};

export const Pagination = ({
  currentPage,
  totalPages,
  getPageLink,
  className,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pagesToShow = 5;
  const half = Math.floor(pagesToShow / 2);
  let start = Math.max(currentPage - half, 1);
  const end = Math.min(start + pagesToShow - 1, totalPages);

  if (end - start < pagesToShow - 1) {
    start = Math.max(end - pagesToShow + 1, 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div
      className={cn("flex justify-center items-center gap-2 mt-6", className)}
    >
      <PaginationLink
        page={currentPage - 1}
        disabled={currentPage === 1}
        getPageLink={getPageLink}
      >
        &larr; Trước
      </PaginationLink>

      {start > 1 && (
        <>
          <PaginationLink page={1} getPageLink={getPageLink}>
            1
          </PaginationLink>
          {start > 2 && <span className="px-1">...</span>}
        </>
      )}

      {pages.map((page) => (
        <PaginationLink
          key={page}
          page={page}
          isActive={page === currentPage}
          getPageLink={getPageLink}
        >
          {page}
        </PaginationLink>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1">...</span>}
          <PaginationLink page={totalPages} getPageLink={getPageLink}>
            {totalPages}
          </PaginationLink>
        </>
      )}

      <PaginationLink
        page={currentPage + 1}
        disabled={currentPage === totalPages}
        getPageLink={getPageLink}
      >
        Sau &rarr;
      </PaginationLink>
    </div>
  );
};

const PaginationLink = ({
  page,
  children,
  disabled,
  isActive,
  getPageLink,
}: {
  page: number;
  children: React.ReactNode;
  disabled?: boolean;
  isActive?: boolean;
  getPageLink: (page: number) => string;
}) => {
  if (disabled) {
    return (
      <span className="px-3 py-1 text-gray-400 cursor-not-allowed">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={getPageLink(page)}
      className={`px-3 py-1 border border-foreground text-sm ${
        isActive
          ? "bg-primary text-white border-primary"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
};

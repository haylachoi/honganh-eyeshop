"use client";

import { Pagination } from "@/components/shared/pagination";
import { usePaginationLink } from "@/hooks/use-pagination-link";

export const BlogsPagination = ({
  total,
  page,
  size,
}: {
  total: number;
  page: number;
  size: number;
}) => {
  const getPaginationLink = usePaginationLink();
  return (
    <Pagination
      className="justify-end"
      currentPage={page}
      totalPages={Math.ceil(total / size)}
      getPageLink={(page) => getPaginationLink(page)}
    />
  );
};

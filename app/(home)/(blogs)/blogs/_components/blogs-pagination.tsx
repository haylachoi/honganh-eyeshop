"use client";

import { Pagination } from "@/components/shared/pagination";
import { getLink } from "@/lib/utils";

export const BlogsPagination = ({
  total,
  page,
  size,
}: {
  total: number;
  page: number;
  size: number;
}) => {
  return (
    <Pagination
      className="justify-end"
      currentPage={page}
      totalPages={Math.ceil(total / size)}
      getPageLink={(page) => getLink.blog.home({ page })}
    />
  );
};

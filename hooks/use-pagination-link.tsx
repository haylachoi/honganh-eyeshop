"use client";

import { usePathname, useSearchParams } from "next/navigation";

export const usePaginationLink = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", targetPage.toString());

    return `${pathname}?${params.toString()}`;
  };
};

"use client";

import { MODIFIABLE_SUPPORT_PAGES } from "@/features/support-pages/support-pages.constants";
import { getLink, updateSearchParam } from "@/lib/utils";
import Link from "next/link";
import { useEffect } from "react";

interface SupportItemProps {
  label: string;
  slug: string;
}

const SupportItem = ({ label, slug }: SupportItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-background rounded-lg shadow-sm">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Link
        href={getLink.support.update({ supportSlug: slug })}
        className="text-primary hover:underline text-sm font-medium"
      >
        Thay đổi
      </Link>
    </div>
  );
};

export const SupportPages = () => {
  useEffect(() => {
    updateSearchParam("tab", "support");
  }, []);

  const supportPages = MODIFIABLE_SUPPORT_PAGES.map((item) => ({
    label: item.title,
    slug: item.slug,
  }));

  return (
    <div className="space-y-4 p-4 bg-muted rounded-xl">
      <h2 className="text-lg font-semibold">Chỉnh sửa các trang hỗ trợ</h2>

      {supportPages.map((item) => (
        <SupportItem key={item.slug} {...item} />
      ))}
    </div>
  );
};

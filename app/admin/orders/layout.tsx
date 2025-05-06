"use client";

import MainPageHeading from "@/components/shared/admin/main-page-heading";
import { ADMIN_ENDPOINTS } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    {
      label: "Last 30 days",
      href: ADMIN_ENDPOINTS.ORDERS.LAST_30_DAYS,
    },
    {
      label: "All",
      href: ADMIN_ENDPOINTS.ORDERS.ALL,
    },
  ];

  return (
    <div className="space-y-4">
      <MainPageHeading title="Đơn hàng" />
      <div className="flex gap-2">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded px-3 py-1 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            {label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}

"use client";

import { ADMIN_ENDPOINTS } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListTree,
  Package,
  Tags,
  Newspaper,
  Percent,
  ShoppingCart,
  Star,
  MoreHorizontal,
} from "lucide-react";

const links = [
  { name: "Tổng quan", href: ADMIN_ENDPOINTS.OVERVIEW, icon: LayoutDashboard },
  { name: "Danh mục", href: ADMIN_ENDPOINTS.CATEGORIES, icon: ListTree },
  { name: "Sản phẩm", href: ADMIN_ENDPOINTS.PRODUCTS, icon: Package },
  { name: "Tags", href: ADMIN_ENDPOINTS.TAGS, icon: Tags },
  { name: "Bài viết", href: ADMIN_ENDPOINTS.BLOGS, icon: Newspaper },
  { name: "Mã giảm giá", href: ADMIN_ENDPOINTS.COUPONS, icon: Percent },
  {
    name: "Đơn hàng",
    href: ADMIN_ENDPOINTS.ORDERS.LAST_30_DAYS,
    icon: ShoppingCart,
  },
  { name: "Đánh giá", href: ADMIN_ENDPOINTS.REVIEWS, icon: Star },
  { name: "Khác", href: ADMIN_ENDPOINTS.OTHERS, icon: MoreHorizontal },
];

const AdminNavigation = () => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-6">
      {links.map(({ name, href, icon: Icon }) => (
        <li key={name}>
          <Link
            className={cn(
              "flex items-center gap-2 transition-colors h-7",
              pathname === href
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-primary",
            )}
            href={href}
          >
            <Icon className="w-5 h-5" />
            <span className="hidden @sidebar:inline-block">{name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default AdminNavigation;

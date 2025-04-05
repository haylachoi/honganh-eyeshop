"use client";

import { ADMIN_ENDPOINTS, ENDPOINTS } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  // { name: "Overview", href: ADMIN_ENDPOINTS.OVERVIEW },
  { name: "Categories", href: ADMIN_ENDPOINTS.CATEGORIES },
  { name: "Products", href: ADMIN_ENDPOINTS.PRODUCTS },
  { name: "Tags", href: ADMIN_ENDPOINTS.TAGS },
  { name: "Blogs", href: ADMIN_ENDPOINTS.BLOGS },
  { name: "Coupons", href: ADMIN_ENDPOINTS.COUPONS },
  { name: "Order", href: ADMIN_ENDPOINTS.ORDERS },
];

const AdminHeader = () => {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-6 container">
      <div>
        <Link href={ENDPOINTS.HOME} className="text-2xl font-bold">
          Logo
        </Link>
      </div>
      <ul className="flex gap-6">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              className={cn(
                "px-6 py-3 flex items-center",
                pathname === link.href &&
                  "bg-primary/80 text-primary-foreground",
              )}
              href={link.href}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHeader;

"use client";

import UserButton from "@/components/shared/user-button";
import { ADMIN_ENDPOINTS, ENDPOINTS } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Overview", href: ADMIN_ENDPOINTS.OVERVIEW },
  { name: "Categories", href: ADMIN_ENDPOINTS.CATEGORIES },
  { name: "Products", href: ADMIN_ENDPOINTS.PRODUCTS },
  { name: "Tags", href: ADMIN_ENDPOINTS.TAGS },
  { name: "Blogs", href: ADMIN_ENDPOINTS.BLOGS },
  { name: "Coupons", href: ADMIN_ENDPOINTS.COUPONS },
  { name: "Order", href: ADMIN_ENDPOINTS.ORDERS },
  { name: "Reviews", href: ADMIN_ENDPOINTS.REVIEWS },
  { name: "Others", href: ADMIN_ENDPOINTS.OTHERS },
];

const AdminHeader = () => {
  const pathname = usePathname();
  return (
    <div className="flex items-center justify-between gap-6 container">
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
                "px-6 py-2 flex items-center",
                pathname === link.href && "text-primary font-bold",
              )}
              href={link.href}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <UserButton />
    </div>
  );
};

export default AdminHeader;

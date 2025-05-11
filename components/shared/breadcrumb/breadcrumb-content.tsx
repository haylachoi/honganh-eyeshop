"use client";

import { House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BreadcrumbContent = ({ map }: { map: Record<string, string> }) => {
  const pathname = usePathname();
  if (!pathname?.[1]) return null;
  if (pathname.startsWith("/checkout")) return null;

  // todo: should auto replace blog
  const segments = pathname
    .split("/")
    .filter(Boolean) // ignore empty
    .map((s) => (s === "b" ? "blogs" : s));

  const breadcrumbs = segments
    .slice(0, -1)
    .map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      return {
        label: map[segment] || segment, // Lấy tên từ map, fallback là segment gốc
        href,
      };
    })
    .filter((segment) => segment.href !== "/c");

  return (
    <nav className="">
      <ul className="flex items-center gap-3">
        <li className="after:content-['>'] flex items-center gap-1">
          <Link aria-label="Home" href="/" className="hover:underline">
            <House className="size-5" />
          </Link>
        </li>
        {breadcrumbs.map((crumb) => (
          <li
            key={crumb.href}
            className="not-last:after:content-['>'] flex items-center gap-1"
          >
            <Link href={crumb.href} className="hover:underline">
              {crumb.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

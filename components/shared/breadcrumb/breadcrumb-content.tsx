"use client";

import { House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function generateBreadcrumbs(
  pathname: string,
  breadcrumbsPath: Record<string, { label: string; href: string }>,
) {
  const breadcrumbs: { label: React.ReactNode; href: string }[] = [
    { label: <House />, href: "/" },
  ];

  const segments = pathname.split("/").filter(Boolean); // ignore empty
  segments.forEach((segment) => {
    const matched = Object.entries(breadcrumbsPath).find(
      ([key]) => key === segment,
    );
    if (matched) {
      breadcrumbs.push(matched[1]);
    }
  });

  return breadcrumbs;
}

export const BreadcrumbContent = ({
  breadcrumbsMap,
}: {
  breadcrumbsMap: Record<string, { label: string; href: string }>;
}) => {
  const pathname = usePathname();
  if (!pathname?.[1]) return null;

  const breadcrumbs = generateBreadcrumbs(pathname, breadcrumbsMap);
  console.log(breadcrumbsMap, breadcrumbs);

  return (
    <nav className="py-2">
      <ul className="flex items-center gap-3">
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

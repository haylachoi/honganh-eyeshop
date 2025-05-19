"use client";
import { usePathname, useSearchParams } from "next/navigation";

export const RerenderOnNavigate = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <div key={pathname + searchParams.toString()} className="contents">
      {children}
    </div>
  );
};

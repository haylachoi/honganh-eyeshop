import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const ThreeDotsMenuLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <DropdownMenuItem>
      <Link className={cn("w-full", className)} href={href}>
        {children}
      </Link>
    </DropdownMenuItem>
  );
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export const ThreeDotsMenuForHeader = ({
  canOpen,
  children,
  ...props
}: {
  canOpen: boolean;
  children: React.ReactNode;
} & React.ComponentProps<typeof DropdownMenu>) => {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild disabled={canOpen}>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ThreeDotsMenu = ({
  children,
  canOpen,
  ...props
}: {
  children: React.ReactNode;
  canOpen?: boolean;
} & React.ComponentProps<typeof DropdownMenu>) => {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild disabled={canOpen}>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

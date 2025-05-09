import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const ThreeDotsMenuButtonItem = ({
  action,
  isPending = false,
  children,
}: {
  action: () => void;
  isPending?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={action}
      disabled={isPending}
    >
      {children}
    </DropdownMenuItem>
  );
};

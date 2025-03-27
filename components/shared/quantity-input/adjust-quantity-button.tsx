import { cn } from "@/lib/utils";

export const AdjustQuantityButton = ({
  type,
  onClick,
  disabled,
  className,
}: {
  type: "increase" | "decrease";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-3 py-1 border cursor-pointer",
        className,
        disabled && "opacity-50",
      )}
    >
      {type === "increase" ? "+" : "-"}
    </button>
  );
};

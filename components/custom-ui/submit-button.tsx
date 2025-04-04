import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type SubmitButtonProps = {
  className?: string;
  label: string;
  isLoading?: boolean;
} & React.ComponentPropsWithoutRef<"button">;

const SubmitButton = ({
  className,
  label,
  isLoading,
  type = "submit",
  ...props
}: SubmitButtonProps) => {
  return (
    <Button
      className={cn("grid grid-cols-[1fr_auto_1fr] gap-1", className)}
      type={type}
      {...props}
    >
      <span className="col-start-2">{label}</span>
      <div className="col-start-3 text-left">
        <span
          className={cn(
            "inline-block invisible",
            isLoading && "visible animate-spin",
          )}
        >
          🌀
        </span>
      </div>
    </Button>
  );
};

export default SubmitButton;

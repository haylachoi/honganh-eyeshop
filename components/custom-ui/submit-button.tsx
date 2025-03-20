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
  ...props
}: SubmitButtonProps) => {
  return (
    <Button className={cn("", className)} type="submit" {...props}>
      {label}
      {isLoading && <span className="ml-2 inline-block animate-spin">🌀</span>}
    </Button>
  );
};

export default SubmitButton;

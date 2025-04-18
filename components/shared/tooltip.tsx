import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TooltipWrapper({
  render,
  children,
}: {
  children?: React.ReactNode;
  render: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{render}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

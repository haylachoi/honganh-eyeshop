import { cn } from "@/lib/utils";

export const LoadingIndicator = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center w-full h-[16px]",
        className,
      )}
    >
      <div className="animate-spin rounded-full h-full aspect-square border-t-2 border-b-2 border-gray-700"></div>
    </div>
  );
};

import { cn } from "@/lib/utils";

export const SupportPagesHeading = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h1 className={cn("text-3xl font-bold text-gray-900 mb-8", className)}>
      {children}
    </h1>
  );
};

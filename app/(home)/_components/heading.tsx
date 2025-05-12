import { cn } from "@/lib/utils";

export const Heading = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <h2
      className={cn(
        "mb-8 w-max py-1 block capitalize text-3xl border-b-5 border-b-primary/70 hue-rotate-20",
        className,
      )}
    >
      {title}
    </h2>
  );
};

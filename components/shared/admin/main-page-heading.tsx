import { cn } from "@/lib/utils";

export default function MainPageHeading({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1 className={cn("text-3xl font-bold uppercase", className)}>{title}</h1>
  );
}

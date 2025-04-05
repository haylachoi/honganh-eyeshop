import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export const StarRatingDisplay = ({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) => {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "size-4 text-yellow-300 fill-current",
            i > rating && "text-muted-foreground fill-none",
            className,
          )}
        />
      ))}
    </div>
  );
};

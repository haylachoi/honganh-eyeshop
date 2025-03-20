import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  className?: string;
  count: number;
  current: number;
  onDotButtonClick: (index: number) => void;
}
const CarouselDotButton = ({
  className,
  count,
  current,
  onDotButtonClick,
}: Props) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {Array.from({ length: count }, (_, i) => i).map((n) => (
        <button
          key={n}
          onClick={() => onDotButtonClick(n)}
          className={cn(
            "size-[10px] bg-primary opacity-50 transition-all cursor-pointer",
            current === n &&
              "scale-150 rotate-45 opacity-100 cursor-not-allowed",
          )}
        ></button>
      ))}
    </div>
  );
};

export default CarouselDotButton;

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
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: count }, (_, i) => i).map((n) => (
        <button
          key={n}
          onClick={() => onDotButtonClick(n)}
          aria-label={`slide ${n + 1}`}
          className={cn(
            "size-[24px] opacity-50 transition-all cursor-pointer flex items-center justify-center",
            current === n &&
              "scale-150 rotate-45 opacity-100 cursor-not-allowed",
          )}
        >
          <div className="p-[5px] bg-primary"></div>
        </button>
      ))}
    </div>
  );
};

export default CarouselDotButton;

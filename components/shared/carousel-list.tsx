"use client";

import React from "react";
import useCarousel from "@/hooks/use-carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import CarouselDotButton from "@/components/custom-ui/dot-button";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _keepTailwindClasses = `
  basis-full basis-1/2 basis-1/3 basis-1/4 basis-1/5
  md:basis-full md:basis-1/2 md:basis-1/3 md:basis-1/4 md:basis-1/5
  lg:basis-full lg:basis-1/2 lg:basis-1/3 lg:basis-1/4 lg:basis-1/5
  xl:basis-full xl:basis-1/2 xl:basis-1/3 xl:basis-1/4 xl:basis-1/5
`;

// todo: use this insteexport
export const CarouselList = <T extends { id: string }>({
  className,
  items,
  render,
  isDotButtonVisible = { desktop: true, mobile: true },
  isArrowButtonVisible = true,
  columns = {},
}: {
  className?: string;
  items: T[];
  render: (item: T) => React.ReactNode;
  isDotButtonVisible?: {
    desktop: boolean;
    mobile: boolean;
  };
  isArrowButtonVisible?: boolean;
  columns?: Partial<{
    sm: 1 | 2;
    md: 2 | 3;
    lg: 2 | 3 | 4;
    xl: 4 | 5;
  }>;
}) => {
  const { setEmblaApi, ...opts } = useCarousel();

  if (!items.length) {
    return <div>Hiện tại chưa có thông tin</div>;
  }

  const shouldShowDotButton =
    isDotButtonVisible.desktop || isDotButtonVisible.mobile;

  const getBasisClass = (count: number) => {
    switch (count) {
      case 1:
        return "basis-full";
      case 2:
        return "basis-1/2";
      case 3:
        return "basis-1/3";
      case 4:
        return "basis-1/4";
      case 5:
        return "basis-1/5";
      default:
        return "basis-1/2"; // fallback mặc định nếu truyền sai
    }
  };

  // default values
  const defaultColumns = { sm: 2, md: 3, lg: 3, xl: 4 };

  const smCount = columns.sm ?? defaultColumns.sm;
  const mdCount = columns.md ?? defaultColumns.md;
  const lgCount = columns.lg ?? defaultColumns.lg;
  const xlCount = columns.xl ?? defaultColumns.xl;

  return (
    <Carousel
      opts={{ align: "start" }}
      setApi={setEmblaApi}
      className={cn("w-full", className)}
    >
      <CarouselContent className="-ml-2">
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className={cn(
              "pl-2",
              getBasisClass(smCount),
              `md:${getBasisClass(mdCount)}`,
              `lg:${getBasisClass(lgCount)}`,
              `xl:${getBasisClass(xlCount)}`,
            )}
          >
            {render(item)}
          </CarouselItem>
        ))}
      </CarouselContent>

      {isArrowButtonVisible && (
        <div className="hidden lg:block">
          <CarouselPrevious className="md:-left-3 size-12 rounded-none cursor-pointer" />
          <CarouselNext className="md:-right-3 size-12 rounded-none cursor-pointer" />
        </div>
      )}

      {shouldShowDotButton && (
        <CarouselDotButton
          className={cn(
            "mt-3 justify-center",
            !isDotButtonVisible.mobile && "max-md:hidden",
            !isDotButtonVisible.desktop && "md:hidden",
          )}
          {...opts}
        />
      )}
    </Carousel>
  );
};

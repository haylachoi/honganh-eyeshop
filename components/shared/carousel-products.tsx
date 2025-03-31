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
import { ProductPreview } from "@/features/products/product.types";
import { cn } from "@/lib/utils";
import CarouselDotButton from "@/components/custom-ui/dot-button";

export const CarouselProducts = ({
  className,
  products,
  render,
  isDotButtonVisible = true,
  isArrowButtonVisible = true,
}: {
  className?: string;
  products: ProductPreview[];
  render: (product: ProductPreview) => React.ReactNode;
  isDotButtonVisible?: boolean;
  isArrowButtonVisible?: boolean;
}) => {
  const { setEmblaApi, ...opts } = useCarousel();

  if (!!!products.length) {
    return <div>Hiện tại chưa có thông tin</div>;
  }

  return (
    <Carousel
      opts={{ align: "start" }}
      setApi={setEmblaApi}
      className={cn("max-sm:contents", className)}
    >
      <CarouselContent className="-ml-2 max-sm:grid grid-cols-2">
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="pl-2 basis-1/2 md:basis-1/3 xl:basis-1/4"
          >
            {render(product)}
          </CarouselItem>
        ))}
      </CarouselContent>
      {isArrowButtonVisible && (
        <div className="hidden lg:block">
          <CarouselPrevious className="md:-left-3 size-12 rounded-none cursor-pointer" />
          <CarouselNext className="md:-right-3 size-12 rounded-none cursor-pointer" />
        </div>
      )}
      {isDotButtonVisible && (
        <CarouselDotButton
          className="max-sm:hidden mt-3 justify-center"
          {...opts}
        />
      )}
    </Carousel>
  );
};

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

type ImageType = {
  imageUrl: string;
};

export const CarouselImages = ({
  className,
  images,
  render,
  isDotButtonVisible = true,
  isArrowButtonVisible = true,
}: {
  className?: string;
  images: ImageType[];
  render: (product: ImageType) => React.ReactNode;
  isDotButtonVisible?: boolean;
  isArrowButtonVisible?: boolean;
}) => {
  const { setEmblaApi, ...opts } = useCarousel();

  if (!!!images.length) {
    return <div>Hiện tại chưa có thông tin</div>;
  }

  return (
    <Carousel
      opts={{ align: "start" }}
      setApi={setEmblaApi}
      className={cn("", className)}
    >
      <CarouselContent className="-ml-2">
        {images.map((image) => (
          <CarouselItem
            key={image.imageUrl}
            className="pl-2 basis-1/2 md:basis-1/3 xl:basis-1/4"
          >
            {render(image)}
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
        <CarouselDotButton className="mt-3 justify-center" {...opts} />
      )}
    </Carousel>
  );
};

"use client";

import { CarouselApi } from "@/components/ui/carousel";
import React from "react";

export default function useCarousel() {
  const [emblaApi, setEmblaApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!emblaApi) {
      return;
    }

    setCount(emblaApi.scrollSnapList().length);
    setCurrent(emblaApi.selectedScrollSnap());

    emblaApi.on("resize", () => {
      setCount(emblaApi.scrollSnapList().length);
    });

    emblaApi.on("select", () => {
      setCurrent(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const onDotButtonClick = React.useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  return {
    emblaApi,
    setEmblaApi,
    current,
    setCurrent,
    count,
    onDotButtonClick,
  };
}

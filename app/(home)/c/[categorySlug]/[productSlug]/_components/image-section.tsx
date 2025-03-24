import { CarouselImages } from "@/components/shared/carousel-images";
import { ProductType } from "@/features/products/product.types";
import Image from "next/image";
import React from "react";
import { TopContext } from "./top-section";
import { cn } from "@/lib/utils";

const ImageSection = ({ product }: { product: ProductType }) => {
  const images = product.variants.flatMap((variant) => variant.images);
  const { currentImage, setCurrentImage } = React.use(TopContext);
  return (
    <div className="flex flex-col gap-2">
      <Image
        className="w-full aspect-[18/9] object-cover"
        src={currentImage}
        alt={product.name}
        width={500}
        height={250}
      />
      <CarouselImages
        isDotButtonVisible={false}
        isArrowButtonVisible={false}
        images={images.map((image) => ({ imageUrl: image }))}
        render={({ image }) => (
          <Image
            src={image.imageUrl}
            alt={product.name}
            className={cn(
              "w-full aspect-[18/9] object-cover cursor-pointer",
              image.imageUrl === currentImage &&
                "p-1 border-2 border-foreground",
            )}
            width={250}
            height={125}
            onClick={() => setCurrentImage(image.imageUrl)}
          />
        )}
      />
    </div>
  );
};

export default ImageSection;

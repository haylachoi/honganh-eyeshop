import { CarouselImages } from "@/components/shared/carousel-images";
import { ProductType } from "@/features/products/product.types";
import Image from "next/image";
import React from "react";
import { TopContext } from "./top-section";
import { cn } from "@/lib/utils";

const ImageSection = ({ product }: { product: ProductType }) => {
  const images = product.variants.flatMap((variant) => variant.images);
  const { currentImage, setCurrentImage } = React.use(TopContext);

  const [zoomPosition, setZoomPosition] = React.useState({ x: 50, y: 50 });
  const [isZoomVisible, setIsZoomVisible] = React.useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative w-full aspect-[18/9] overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomVisible(true)}
        onMouseLeave={() => setIsZoomVisible(false)}
      >
        <Image
          className="w-full h-full object-cover"
          src={currentImage}
          alt={product.name}
          width={600}
          height={300}
        />

        {/* Zoom overlay */}
        <div
          className={cn(
            "absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 ease-out",
            isZoomVisible ? "opacity-100" : "opacity-0",
          )}
          style={{
            backgroundImage: `url(${currentImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "200%", // Zoom scale
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
      </div>

      <CarouselImages
        isDotButtonVisible={false}
        isArrowButtonVisible={false}
        images={images.map((image) => ({ imageUrl: image }))}
        render={({ image }) => (
          <Image
            src={image.imageUrl}
            alt={product.name}
            className={cn(
              "w-full aspect-[18/9] object-cover cursor-pointer transition-all hover:scale-105",
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

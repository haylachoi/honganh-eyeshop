import { CarouselImages } from "@/components/shared/carousel-images";
import { ProductType } from "@/features/products/product.types";
import Image from "next/image";
import React from "react";
import { TopContext } from "./top-section";

const ImageSection = ({
  product,
  // currentImage,
  // setCurrentImage,
}: {
  product: ProductType;
  // currentImage: string;
  // setCurrentImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const images = product.variants.flatMap((variant) => variant.images);
  const { currentImage, setCurrentImage } = React.use(TopContext);
  return (
    <div>
      <Image
        className="w-full"
        src={currentImage}
        alt={product.name}
        width={400}
        height={300}
      />
      <CarouselImages
        isDotButtonVisible={false}
        images={images.map((image) => ({ imageUrl: image }))}
        render={(image) => (
          <Image
            src={image.imageUrl}
            alt={product.name}
            width={400}
            height={300}
            onClick={() => setCurrentImage(image.imageUrl)}
          />
        )}
      />
    </div>
  );
};

export default ImageSection;

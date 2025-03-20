import { ProductType } from "@/features/products/product.types";
import React from "react";
import ImageSection from "./image-section";
import VariantSection from "./variant-section";

type topContextProps = {
  currentImage: string;
  setCurrentImage: React.Dispatch<React.SetStateAction<string>>;
  currentVariant: ProductType["variants"][0] | undefined;
  setCurrentVariant: React.Dispatch<
    React.SetStateAction<ProductType["variants"][0] | undefined>
  >;
};

export const TopContext = React.createContext<topContextProps>({
  currentImage: "",
  setCurrentImage: () => {},
  currentVariant: undefined,
  setCurrentVariant: () => {},
});

const TopSection = ({ product }: { product: ProductType }) => {
  const [currentImage, setCurrentImage] = React.useState(
    product.variants?.[0].images?.[0] ?? "",
  );

  const [currentVariant, setCurrentVariant] = React.useState<
    ProductType["variants"][0]
  >(product.variants?.[0]);
  return (
    <TopContext.Provider
      value={{
        currentImage,
        setCurrentImage,
        currentVariant,
        setCurrentVariant,
      }}
    >
      <div className="grid grid-cols-2 gap-2">
        <ImageSection
          product={product}
          // currentImage={currentImage}
          // setCurrentImage={setCurrentImage}
        />
        <div>
          <h1 className="text-4xl text-primary font-bold capitalize mb-5">
            {product.name}
          </h1>

          <VariantSection
            variants={product.variants}
            // currentImage={currentImage}
            // setCurrentImage={setCurrentImage}
          />
        </div>
      </div>
    </TopContext.Provider>
  );
};

export default TopSection;

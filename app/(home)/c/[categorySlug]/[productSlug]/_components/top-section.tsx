import { ProductType } from "@/features/products/product.types";
import React from "react";
import ImageSection from "./image-section";
import VariantSelector from "./variant-section";
import BuyButton from "./buy-btn";
import { Star } from "lucide-react";
import { ERROR_MESSAGES } from "@/constants/messages.constants";
import { REVIEW_CONSTANT } from "@/features/reviews/review.constants";

type topContextProps = {
  product: ProductType;
  currentImage: string;
  setCurrentImage: React.Dispatch<React.SetStateAction<string>>;
  currentVariant: ProductType["variants"][0] | undefined;
  setCurrentVariant: React.Dispatch<
    React.SetStateAction<ProductType["variants"][0] | undefined>
  >;
};

export const TopContext = React.createContext<topContextProps>({
  // todo: create empty product
  product: {} as ProductType,
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
    ProductType["variants"][0] | undefined
  >(product.variants?.[0]);
  return (
    <TopContext.Provider
      value={{
        product,
        currentImage,
        setCurrentImage,
        currentVariant,
        setCurrentVariant,
      }}
    >
      <div className="flex flex-col lg:flex-row [&>*]:flex-1 gap-8">
        <ImageSection product={product} />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 mb-5">
            <h1 className="text-4xl text-primary font-bold capitalize">
              {product.name}
            </h1>
            <div className="flex gap-6">
              <div className="flex gap-2 items-center">
                <Star className="text-yellow-300 fill-current size-4" />
                <span>
                  {product.avgRating !== 0
                    ? product.avgRating.toFixed(1)
                    : "Chưa có đánh giá"}
                </span>
              </div>
              {product.totalReviews > 0 && (
                <a
                  href={`#${REVIEW_CONSTANT.CUSTOMER.PRODUCT.ID}`}
                  className="text-primary/90 underline hover:no-underline"
                >
                  {product.totalReviews} Bình luận
                </a>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <VariantSelector variants={product.variants} />
            <BuyButton />
            <p className="text-destructive text-sm">
              {product.isAvailable ? "" : ERROR_MESSAGES.PRODUCT.NOT_AVAILABLE}
            </p>
          </div>
        </div>
      </div>
    </TopContext.Provider>
  );
};

export default TopSection;

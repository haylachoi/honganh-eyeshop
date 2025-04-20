import React from "react";
import Image from "next/image";
import { ProductPreview } from "@/features/products/product.types";
import { cn, currencyFormatter, getLink } from "@/lib/utils";
import Link from "next/link";

export const PreviewCard = ({
  product,
  className,
}: {
  product: ProductPreview;
  className?: string;
}) => {
  const formater = currencyFormatter;
  const imageUrl = product.variants[0].images[0] ?? "/images/none-image.png";
  const { minPrice, maxPrice } = product;
  return (
    <div
      className={cn(
        "w-full border-5 border-secondary border-t-transparent border-r-transparent",
        className,
      )}
    >
      <Link
        href={getLink.product.home({
          categorySlug: product.category.slug,
          productSlug: product.slug,
        })}
        className="p-1 w-full relative inline-block cursor-pointer hover:border-transparent hover:outline-2 outline-foreground"
      >
        <ProductBadge product={product} className="absolute top-2 right-2" />
        <Image
          className="w-full aspect-[18/9]"
          src={imageUrl}
          alt={product.name}
          width={200}
          height={100}
        />
        <div className="p-4">
          <p className="text-xl truncate">{product.name}</p>
          <div className="flex gap-2">
            <span className="text-foreground font-bold">
              {minPrice === maxPrice
                ? formater.format(minPrice)
                : `${formater.format(minPrice)} - ${formater.format(maxPrice)}`}
            </span>
            {product.variants[0].originPrice !== product.variants[0].price && (
              <span className="text-foreground/60 line-through">
                {formater.format(product.variants[0].originPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

const ProductBadge = ({
  className,
  product,
}: {
  className?: string;
  product: ProductPreview;
}) => {
  const variant0 = product.variants[0];
  const rawValue =
    (variant0.originPrice - variant0.price) / variant0.originPrice;
  const value = Math.round(rawValue * 100);

  if (value === 0) return;

  return (
    <div
      className={cn(
        "bg-destructive text-destructive-foreground px-4 py-1 rounded-full",
        className,
      )}
    >
      {`-${value}%`}
    </div>
  );
};

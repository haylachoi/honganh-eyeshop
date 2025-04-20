"use client";

import { CarouselProducts } from "@/components/shared/carousel-products";
import { PreviewCard } from "@/components/shared/product-preview-card";
import { ProductPreview } from "@/features/products/product.types";
import { useBreakpoint } from "@/hooks/use-is-mobile";

export const ProductsContainer = ({
  products,
  className,
}: {
  className?: string;
  products: ProductPreview[];
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  if (isMobile) {
    return (
      <ul className="grid grid-cols-2 gap-2">
        {products.map((product) => (
          <PreviewCard product={product} key={product.id} />
        ))}
      </ul>
    );
  }
  return (
    // toto: fix mobile screen with no carousel
    <CarouselProducts
      products={products}
      className={className}
      render={(product) => <PreviewCard product={product} />}
    />
  );
};

"use client";

import { CarouselList } from "@/components/shared/carousel-list";
import { ProductPreviewCard } from "@/components/shared/product-preview-card";
import { ProductPreview } from "@/features/products/product.types";
import { useBreakpoint } from "@/hooks/use-is-mobile";

export const ProductsContainer = ({
  products,
}: {
  products: ProductPreview[];
  className?: string;
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";
  if (isMobile) {
    return (
      <ul className="grid grid-cols-2 gap-2">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreviewCard product={product} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <CarouselList
      items={products}
      render={(product) => <ProductPreviewCard product={product} />}
    />
  );
};

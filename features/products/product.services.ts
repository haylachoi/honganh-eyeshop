import { ProductPreview } from "@/features/products/product.types";

export const getOnSaleProducts: () => Promise<ProductPreview[]> = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return productPreviewsSample;
};

const productPreviewsSample: ProductPreview[] = [];

import { ProductPreview } from "@/types/products";

export const getOnSaleProducts: () => Promise<ProductPreview[]> = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return productPreviewsSample;
};

const productPreviewsSample: ProductPreview[] = [];

import { ProductPreview } from "@/features/products/product.types";

export const getTrendingProductPreviews: () => Promise<
  ProductPreview[]
> = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return productPreviewsSample;
};

export const getNewArrivalPreviews: () => Promise<
  ProductPreview[]
> = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return productPreviewsSample;
};
export const getOnSaleProducts: () => Promise<ProductPreview[]> = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return productPreviewsSample;
};

const productPreviewsSample: ProductPreview[] = [
  {
    id: "1",
    name: "Product 1",
    imageUrl: "/home/product-image.webp",
    slug: "product-1",
    categoryId: "1",
    categorySlug: "category-1",
    price: 10000,
    originPrice: 12000,
  },
  {
    id: "2",
    name: "Product 2",
    imageUrl: "/home/product-image.webp",
    slug: "product-2",
    categoryId: "1",
    categorySlug: "category-1",
    price: 16,
    originPrice: 20,
  },
  {
    id: "3",
    name: "Product 3",
    imageUrl: "/home/product-image.webp",
    slug: "product-3",
    categoryId: "1",
    categorySlug: "category-1",
    price: 300,
    originPrice: 300,
  },
  {
    id: "4",
    name: "Product 4",
    imageUrl: "/home/product-image.webp",
    slug: "product-4",
    categoryId: "1",
    categorySlug: "category-1",
    price: 120,
    originPrice: 120,
  },
  {
    id: "5",
    name: "Product 5",
    imageUrl: "/home/product-image.webp",
    slug: "product-5",
    categoryId: "1",
    categorySlug: "category-1",
    price: 200,
    originPrice: 220,
  },
  {
    id: "6",
    name: "Product 6",
    imageUrl: "/home/product-image.webp",
    slug: "product-6",
    categoryId: "1",
    categorySlug: "category-1",
    price: 200,
    originPrice: 200,
  },
];

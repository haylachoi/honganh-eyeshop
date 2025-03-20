import productRepository from "@/lib/db/repositories/products";
import { safeQuery } from "@/lib/query";
import { z } from "zod";
import { getProductBySlugQuerySchema } from "./product.validator";

export const getAllProducts = safeQuery.query(async () => {
  const products = await productRepository.getAllProducts();
  return products;
});

export const getProductsByTags = safeQuery
  .schema(z.array(z.string()))
  .query(async ({ inputParams }) => {
    const products = await productRepository.getProductByTags(inputParams);
    return products;
  });

export const getProductBySlug = safeQuery
  .schema(getProductBySlugQuerySchema)
  .query(async ({ inputParams }) => {
    const products = await productRepository.getProductBySlug(inputParams);
    return products;
  });

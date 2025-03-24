import productRepository from "@/lib/db/repositories/products";
import { safeQuery } from "@/lib/query";
import { z } from "zod";
import { getProductBySlugQuerySchema } from "./product.validator";
import { IdSchema } from "@/lib/validator";

export const getAllProducts = safeQuery.query(async () => {
  const products = await productRepository.getAllProducts();
  return products;
});

export const getProductById = safeQuery
  .schema(IdSchema)
  .query(async ({ parsedInput }) => {
    const products = await productRepository.getProductById(parsedInput);
    return products;
  });

export const getProductsByTags = safeQuery
  .schema(z.array(z.string()))
  .query(async ({ parsedInput }) => {
    const products = await productRepository.getProductByTags(parsedInput);
    return products;
  });

export const getProductBySlug = safeQuery
  .schema(getProductBySlugQuerySchema)
  .query(async ({ parsedInput }) => {
    const products = await productRepository.getProductBySlug(parsedInput);
    return products;
  });

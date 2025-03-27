import productRepository from "@/lib/db/repositories/products";
import { safeQuery } from "@/lib/query";
import { z } from "zod";
import { getProductBySlugQuerySchema } from "./product.validator";
import { IdSchema } from "@/lib/validator";
import { ERROR_MESSAGES } from "@/constants";
import { NotFoundError } from "@/lib/error";

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
    if (!products) {
      throw new NotFoundError({
        resource: "product",
        message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
      });
    }
    return products;
  });

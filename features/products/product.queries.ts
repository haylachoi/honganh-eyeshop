import productRepository from "@/lib/db/repositories/products";
import { authQueryClient, safeQuery } from "@/lib/query";
import { z } from "zod";
import { getProductBySlugQuerySchema } from "./product.validator";
import { IdSchema } from "@/lib/validator";
import { ERROR_MESSAGES, PAGE_SIZE } from "@/constants";
import { NotFoundError } from "@/lib/error";
import next_cache from "@/cache";

export const getAllProducts = authQueryClient.query(async () => {
  const products = await next_cache.products.getAll();
  return products;
});

export const getProductById = safeQuery
  .schema(
    z.object({
      id: IdSchema,
      includePrivateProduct: z.boolean().optional().default(false),
    }),
  )
  .query(async ({ parsedInput }) => {
    const products = await productRepository.getProductById(parsedInput);
    return products;
  });

export const getPublishedProductsByTags = safeQuery
  .schema(
    z.object({
      tags: z.array(z.string()),
      page: z.number().optional().default(0),
      size: z.number().optional().default(PAGE_SIZE.PRODUCTS.MD),
    }),
  )
  .query(async ({ parsedInput: { tags, page, size } }) => {
    const result = await next_cache.products.getByTags({
      tags,
      limit: size,
      skip: size * page,
    });

    return result;
  });

export const getProductBySlug = safeQuery
  .schema(getProductBySlugQuerySchema)
  .query(async ({ parsedInput }) => {
    const products = await productRepository.getProductBySlug({
      input: parsedInput,
    });
    if (!products) {
      throw new NotFoundError({
        resource: "product",
        message: ERROR_MESSAGES.PRODUCT.NOT_FOUND,
      });
    }
    return products;
  });

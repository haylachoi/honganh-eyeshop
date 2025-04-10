import productRepository from "@/lib/db/repositories/products";
import { safeQuery } from "@/lib/query";
import { z } from "zod";
import { getProductBySlugQuerySchema } from "./product.validator";
import { IdSchema } from "@/lib/validator";
import { ERROR_MESSAGES, PAGE_SIZE } from "@/constants";
import { NotFoundError } from "@/lib/error";
// import { canAccess } from "../authorization/authorization.utils";
// import {
//   ACTIONS,
//   RESOURCE_TYPES,
//   ROLES,
//   SCOPES,
// } from "../authorization/authorization.constants";

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

export const getPublishedProductsByTags = safeQuery
  .schema(
    z.object({
      tags: z.array(z.string()),
      page: z.number().optional().default(0),
      size: z.number().optional().default(PAGE_SIZE.PRODUCTS.MD),
    }),
  )
  .query(async ({ parsedInput: { tags, page, size } }) => {
    const result = await productRepository.getProductByTags({
      tags,
      limit: size,
      skip: size * page,
    });

    return result;
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

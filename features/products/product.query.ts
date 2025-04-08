import productRepository from "@/lib/db/repositories/products";
import { safeQuery } from "@/lib/query";
import { z } from "zod";
import { getProductBySlugQuerySchema } from "./product.validator";
import { IdSchema } from "@/lib/validator";
import { ERROR_MESSAGES } from "@/constants";
import { NotFoundError } from "@/lib/error";
import { FilterQuery } from "mongoose";
import { ProductType } from "./product.types";

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

export const searchProductByQuery = safeQuery
  .schema(z.record(z.array(z.string())))
  .query(async ({ parsedInput }) => {
    const andConditions: FilterQuery<ProductType>[] = [];
    const {
      category: categoryFilter,
      price: priceFilter,
      search: searchFilter,
      ...attrFilters
    } = parsedInput;

    for (const [name, values] of Object.entries(attrFilters)) {
      andConditions.push({
        attributes: {
          $elemMatch: {
            name,
            valueSlug: { $in: values },
          },
        },
      });
    }

    if (categoryFilter) {
      andConditions.push({ "category.slug": { $in: categoryFilter } });
    }
    if (searchFilter) {
      console.log(searchFilter);
      andConditions.push({
        nameNoAccent: { $regex: searchFilter[0], $options: "i" },
      });
    }

    if (priceFilter?.[0]) {
      const [min, rawMax] = priceFilter[0].split("-").map(Number);
      const max = rawMax === 0 ? 10_000_000 : rawMax;

      andConditions.push({
        $and: [{ maxPrice: { $gte: min } }, { minPrice: { $lte: max } }],
      });
    }

    const query: FilterQuery<ProductType> = andConditions.length
      ? { $and: andConditions }
      : {};

    return productRepository.searchProductByQuery({ query });
  });

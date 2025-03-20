"use server";

import { writeFile } from "fs/promises";
import { authActionClient } from "@/lib/actions";
import { ProductInputSchema, productUpdateSchema } from "./product.validator";
import crypto from "crypto";
import path from "path";
import productRepository from "@/lib/db/repositories/products";
import { CACHE } from "@/constants";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { getCategoryInfoById } from "../categories/category.utils";
import {
  transformCreateInputVariantToDbVariant,
  transformUpdateInputVariantToDbVariant,
} from "./product.utils";

export const createProductAction = authActionClient
  .metadata({
    actionName: "createProduct",
  })
  .schema(ProductInputSchema)
  .action(async ({ parsedInput }) => {
    // const progress: Promise<void>[] = [];
    //
    // const newVariants = parsedInput.variants.map(({ images, ...rest }) => {
    //   const imageUrls: string[] = [];
    //   const localProgress = images.map(async (file) => {
    //     const data = await file.arrayBuffer();
    //     const buffer = Buffer.from(data);
    //     const fileName = `${parsedInput.name}_${crypto.randomUUID()}${path.extname(file.name)}`;
    //     const basePath = path.join("images", "products", fileName);
    //     const fileLink = path.join("/", basePath);
    //     const filePath = path.join(process.cwd(), "public", basePath);
    //     imageUrls.push(fileLink);
    //     return writeFile(filePath, buffer);
    //   });
    //   progress.push(...localProgress);
    //
    //   return {
    //     ...rest,
    //     images: imageUrls,
    //   };
    // });
    //
    // await Promise.all(progress);

    // // todo: get from safe query
    // const categories = await categoriesRepository.getAllCategories();
    // const category = categories.find(
    //   (category) => category.id === parsedInput.category,
    // );
    //
    // if (!category) {
    //   throw new AppError({
    //     message: ERROR_MESSAGES.NOT_FOUND.ID.SINGLE,
    //   });
    // }
    //
    // const newCatgory = {
    //   _id: category.id,
    //   name: category.name,
    //   slug: category.slug,
    // };

    const newVariants = await transformCreateInputVariantToDbVariant({
      variants: parsedInput.variants,
      productName: parsedInput.name,
    });

    const newCategory = await getCategoryInfoById(parsedInput.category);

    const newTags = parsedInput.tags.map((tag) => ({
      _id: tag.id,
      name: tag.name,
    }));

    const input = {
      ...parsedInput,
      category: newCategory,
      variants: newVariants,
      isPublished: true,
      tags: newTags,
    };

    await productRepository.createProduct(input);
    // todo: delete image if error

    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
  });

export const updateProductAction = authActionClient
  .metadata({
    actionName: "updateProduct",
  })
  .schema(productUpdateSchema)
  .action(async ({ parsedInput }) => {
    const newVariants = await transformUpdateInputVariantToDbVariant({
      variants: parsedInput.variants,
      productName: parsedInput.name,
    });

    const newCategory = await getCategoryInfoById(parsedInput.category);

    const newTags = parsedInput.tags.map((tag) => ({
      _id: tag.id,
      name: tag.name,
    }));

    const input = {
      ...parsedInput,
      category: newCategory,
      variants: newVariants,
      isPublished: true,
      tags: newTags,
    };

    await productRepository.updateProduct(input);
    //todo: delete images

    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
  });

export const deleteProductAction = authActionClient
  .metadata({
    actionName: "deleteProduct",
  })
  .schema(z.union([z.string(), z.array(z.string())]))
  .action(async ({ parsedInput }) => {
    await productRepository.deleteProduct(parsedInput);
    //todo: delete images

    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
  });

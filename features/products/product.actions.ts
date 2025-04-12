"use server";

import { authActionClient } from "@/lib/actions";
import { ProductInputSchema, productUpdateSchema } from "./product.validator";
import productRepository from "@/lib/db/repositories/products";
import { CACHE } from "@/constants";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { getCategoryInfoById } from "../categories/category.utils";
import {
  transformCreateInputVariantToDbVariant,
  transformUpdateInputVariantToDbVariant,
} from "./product.utils";
import { removeDiacritics } from "@/lib/utils";
import { randomBytes } from "crypto";

const fakeCategories = [
  {
    name: "Kính",
    slug: "kinh",
    _id: "67cc44c09c2ede4550a5636a",
  },
  {
    name: "Gọng kính",
    slug: "gong-kinh",
    _id: "67cb266b1014fc6500d1da64",
  },
  {
    name: "Kinh ram",
    slug: "kinh-ram",
    _id: "67cb34159340d0819c0afb8f",
  },
];

const fakeProduct = {
  name: "Gọng kịnh xuất khẩu",
  nameNoAccent: "gong kinh xuat khau",
  slug: "gong-kinh-xuat-khau",
  category: {
    name: "Gọng kính",
    slug: "gong-kinh",
    _id: "67cb266b1014fc6500d1da64",
  },
  attributes: [
    {
      name: "color",
      value: "dfgdfgdfg",
      valueSlug: "dfgdfgdfg",
    },
  ],
  brand: "brand",
  description: "hhihi",
  isPublished: true,
  isAvailable: true,
  tags: [
    {
      name: "trending",
      _id: "67d9503991d9ddf589b745a7",
    },
    {
      name: "new-arrival",
      _id: "67cc87986775dad7a0f11c56",
    },
  ],
  minPrice: 900,
  maxPrice: 1000000,
  variants: [
    {
      uniqueId: "42af18e0-1318-45f0-b5d6-372678849a84",
      attributes: [
        {
          name: "color",
          value: "den",
        },
      ],
      price: 1000000,
      originPrice: 1000000,
      countInStock: 100,
      images: [
        "/images/products/gong-kinh-xuat-khau_cd3420bb-f001-412f-9544-a3d00b5aa8df.webp",
        "/images/products/ten-moi-ne_b3e065d2-c540-45d8-aeb2-c7b386f3b15f.webp",
        "/images/products/ten-moi-ne_722cf9b5-1525-4aba-bbcf-c55c96e757ec.webp",
        "/images/products/ten-moi-ne_cc1fca90-63bf-4ace-818b-53e39e20cb96.webp",
      ],
    },
  ],
  avgRating: 0,
  totalReviews: 0,
  totalSales: 0,
};

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const generateFakeProducts = authActionClient
  .metadata({
    actionName: "generateFakeProducts",
  })
  .action(async () => {
    const test = Array.from({ length: 1500 }, () => {
      const name = "test" + randomBytes(8).toString("hex");
      const number = Math.floor(Math.random() * (700000 - 20000 + 1)) + 10000;
      const attrValue = "color" + Math.floor(Math.random() * 4) + 1;
      const attributes = [
        {
          name: "color",
          value: attrValue,
          valueSlug: attrValue,
        },
      ];
      const variant = {
        ...fakeProduct.variants[0],
        price: number,
        images: shuffleArray(fakeProduct.variants[0].images),
        uniqueId: crypto.randomUUID(),
      };

      return {
        ...fakeProduct,
        name,
        attributes,
        category: shuffleArray(fakeCategories)[0],
        nameNoAccent: name,
        variants: [variant],
        minPrice: number,
        maxPrice: number,
        slug: name,
      };
    });

    await productRepository.createProducts(test);
  });

export const deleteFakeProducts = authActionClient
  .metadata({
    actionName: "deleteFakeProducts",
  })
  .action(async () => {
    await productRepository.deleteFakeProducts();
  });

export const createProductAction = authActionClient
  .metadata({
    actionName: "createProduct",
  })
  .schema(ProductInputSchema)
  .action(async ({ parsedInput }) => {
    const newVariants = await transformCreateInputVariantToDbVariant({
      variants: parsedInput.variants,
      identity: parsedInput.slug,
    });

    const newCategory = await getCategoryInfoById(parsedInput.category);

    const newTags = parsedInput.tags.map((tag) => ({
      _id: tag.id,
      name: tag.name,
    }));

    let minPrice = Infinity;
    let maxPrice = -Infinity;

    parsedInput.variants.forEach((variant) => {
      if (variant.price < minPrice) {
        minPrice = variant.price;
      }
      if (variant.price > maxPrice) {
        maxPrice = variant.price;
      }
    });

    const input = {
      ...parsedInput,
      nameNoAccent: removeDiacritics(parsedInput.name),
      category: newCategory,
      variants: newVariants,
      minPrice,
      maxPrice,
      tags: newTags,
    };

    await productRepository.createProduct(input);
    // todo: delete image if error

    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
  });

// todo: update only changed value
export const updateProductAction = authActionClient
  .metadata({
    actionName: "updateProduct",
  })
  .schema(productUpdateSchema)
  .action(async ({ parsedInput }) => {
    const newVariants = await transformUpdateInputVariantToDbVariant({
      variants: parsedInput.variants,
      identity: parsedInput.slug,
    });

    const newCategory = await getCategoryInfoById(parsedInput.category);

    const newTags = parsedInput.tags.map((tag) => ({
      _id: tag.id,
      name: tag.name,
    }));

    let minPrice = Infinity;
    let maxPrice = -Infinity;

    parsedInput.variants.forEach((variant) => {
      if (variant.price < minPrice) {
        minPrice = variant.price;
      }
      if (variant.price > maxPrice) {
        maxPrice = variant.price;
      }
    });

    const input = {
      ...parsedInput,
      nameNoAccent: removeDiacritics(parsedInput.name),
      category: newCategory,
      variants: newVariants,
      minPrice,
      maxPrice,
      tags: newTags,
    };

    await productRepository.updateProduct(input);
    //todo: delete images
    // todo: delete variant in cart if change. Should move to repository

    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
    revalidateTag(CACHE.TAGS.ALL.TAGS);
  });

export const updateRatingAction = authActionClient
  .metadata({
    actionName: "updateRating",
  })
  .schema(z.object({ productId: z.string(), rating: z.number() }))
  .action(async ({ parsedInput }) => {
    await productRepository.updateRating(parsedInput);
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

    // delete item from cart

    revalidateTag(CACHE.PRODUCTS.ALL.TAGS);
  });

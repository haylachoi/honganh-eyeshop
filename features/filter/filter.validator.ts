import { IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";
import { categorySlugSchema } from "../categories/category.validator";
import { getLink } from "@/lib/utils";
import { blogSlugSchema } from "../blogs/blog.validators";
import { PRODUCTS_PER_PAGE } from "@/constants";

const filterNameSchema = z.string();
const filterValueSchema = z.object({
  value: z.string(),
  valueSlug: z.string(),
});

export const searchResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  link: z.string(),
  price: z.number(),
  image: z.string(),
});

export const filterGroupSchema = z.object({
  displayName: filterNameSchema,
  name: filterNameSchema,
  values: z.array(filterValueSchema),
});

export const filterInputSchema = z.object({
  categoryId: IdSchema,
  categorySlug: categorySlugSchema,
  name: filterNameSchema,
  displayName: filterNameSchema,
  values: z.array(filterValueSchema),
});

export const filterTypeSchema = filterInputSchema
  .extend({
    _id: MongoIdSchema,
    categoryId: MongoIdSchema,
  })
  .transform(({ _id, categoryId, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    categoryId: categoryId.toString(),
  }));

export const searchInputSchema = z.object({
  params: z.record(z.string()),
  page: z.number().optional().default(0),
  size: z.number().optional().default(PRODUCTS_PER_PAGE),
});

export const searchProductResultSchema = z
  .object({
    _id: MongoIdSchema,
    name: z.string(),
    slug: z.string(),
    category: z.object({
      slug: z.string(),
    }),
    price: z.number(),
    image: z.string(),
  })
  .transform(({ _id, category, slug, ...rest }) => ({
    ...rest,
    id: _id.toString(),
    link: getLink.product.home({
      categorySlug: category.slug,
      productSlug: slug,
    }),
  }));

export const searchBlogResultSchema = z
  .object({
    _id: MongoIdSchema,
    title: z.string(),
    slug: blogSlugSchema,
    image: z.string(),
    updatedAt: z.date(),
  })
  .transform(({ _id, slug, ...res }) => ({
    ...res,
    link: getLink.blog.view({ blogSlug: slug }),
    id: _id.toString(),
  }));

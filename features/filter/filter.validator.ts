import { idSchema, mongoIdSchema } from "@/lib/validator";
import { z } from "zod";
import { categorySlugSchema } from "../categories/category.validator";
import { getLink } from "@/lib/utils";
import { blogSlugSchema } from "../blogs/blog.validators";

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
  categoryId: idSchema.optional(),
  categorySlug: categorySlugSchema.optional(),
  name: filterNameSchema,
  displayName: filterNameSchema,
  values: z.array(filterValueSchema),
});

export const filterTypeSchema = filterInputSchema
  .extend({
    _id: mongoIdSchema,
    categoryId: mongoIdSchema,
  })
  .transform(({ _id, categoryId, ...rest }) => ({
    ...rest,
    id: _id?.toString(),
    categoryId: categoryId?.toString(),
  }));

export const searchInputSchema = z.object({
  params: z.record(z.string()),
  page: z.number().optional().default(1),
  size: z.number(),
});

export const searchProductResultSchema = z.object({
  id: idSchema,
  name: z.string(),
  price: z.number(),
  link: z.string(),
  image: z.string(),
});

export const searchProductResultTransformSchema = z
  .object({
    _id: mongoIdSchema,
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

export const searchBlogResultSchema = z.object({
  id: idSchema,
  title: z.string(),
  link: z.string(),
  image: z.string(),
});

export const searchBlogResultTranformSchema = z
  .object({
    _id: mongoIdSchema,
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

export const globalSearchResultSchema = z.object({
  products: z.object({
    items: z.array(searchProductResultSchema),
    total: z.number(),
  }),
  blogs: z.object({
    items: z.array(searchBlogResultSchema),
    total: z.number(),
  }),
});

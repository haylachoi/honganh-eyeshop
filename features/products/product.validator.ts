import { getLink } from "@/lib/utils";
import { MoneySchema, IdSchema, MongoIdSchema } from "@/lib/validator";
import { z } from "zod";

// general
const nameSchema = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters");
const slugSchema = z
  .string()
  .trim()
  .min(3, "Slug must be at least 3 characters");
const brandSchema = z.string().trim().min(1, "Brand is required");
const descriptionSchema = z.string().trim().optional();
const isPublishedSchema = z.boolean().default(true);
const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});
const categorySchema = z.string();

const imageSchema = z.instanceof(File);

export const variantAttributeSchema = z.object({
  name: z.string().min(1).trim(),
  value: z.string().min(1).trim(),
});

const attributeSchema = z.object({
  name: z.string().min(1).trim(),
  value: z.string().trim().optional().default(""),
});

// base
export const baseVariantSchema = z.object({
  // images: z.unknown().transform((value) => {
  //   return value as FileList;
  // }),
  uniqueId: z.string(),
  images: z.array(imageSchema),
  attributes: z
    .array(variantAttributeSchema)
    .min(1, "Variant must have at least one attribute"),
  price: MoneySchema,
  originPrice: MoneySchema,
  countInStock: z.coerce
    .number()
    .int()
    .nonnegative("count in stock must be a non-negative number"),
});

// update
const variantUpdateSchema = baseVariantSchema.extend({
  deletedImages: z.array(z.string()).default([]),
  oldImages: z.array(z.string()).default([]),
});

// main
export const baseProductSchema = z.object({
  name: nameSchema,
  slug: slugSchema,
  category: categorySchema,
  attributes: z.array(attributeSchema),
  brand: brandSchema,
  description: descriptionSchema,
  isPublished: isPublishedSchema,
  tags: z.array(tagSchema),
});

export const ProductInputSchema = baseProductSchema.extend({
  variants: z.array(baseVariantSchema),
});

export const ProductDbInputSchema = z.object({
  name: nameSchema,
  nameNoAccent: nameSchema,
  slug: slugSchema,
  category: z.object({ _id: IdSchema, name: z.string(), slug: z.string() }),
  attributes: z.array(attributeSchema),
  brand: brandSchema,
  description: descriptionSchema,
  isPublished: isPublishedSchema,
  tags: z.array(z.object({ _id: z.string(), name: z.string() })),
  variants: z.array(
    baseVariantSchema
      .omit({ images: true })
      .extend({ images: z.array(z.string()) }),
  ),
});

export const productUpdateSchema = baseProductSchema.extend({
  id: IdSchema,
  variants: z.array(variantUpdateSchema),
});

export const variantTypeSchema = baseVariantSchema
  .omit({ images: true })
  .extend({ images: z.array(z.string()) });

export const productTypeWithoutTransformSchema = z.object({
  _id: MongoIdSchema,
  name: nameSchema,
  nameNoAccent: nameSchema,
  slug: slugSchema,
  category: z
    .object({ _id: MongoIdSchema, name: z.string(), slug: z.string() })
    .transform(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    })),

  attributes: z.array(attributeSchema),
  brand: brandSchema,
  description: descriptionSchema,
  isPublished: isPublishedSchema,
  tags: z
    .array(z.object({ _id: MongoIdSchema, name: z.string() }))
    .transform((tag) =>
      tag.map(({ _id, ...rest }) => ({
        ...rest,
        id: _id.toString(),
      })),
    ),
  variants: z.array(variantTypeSchema),
  avgRating: z.number().default(0),
  totalReviews: z.number().default(0),
  totalSales: z.number().default(0),
});

export const ProductTypeSchema = productTypeWithoutTransformSchema.transform(
  ({ _id, ...rest }) => ({
    ...rest,
    id: _id.toString(),
  }),
);

export const getProductBySlugQuerySchema = z.object({
  categorySlug: z.string().optional(),
  productSlug: z.string(),
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
